import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  take,
} from 'rxjs';

import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  deleteEntities,
  withActiveId,
  selectActiveEntity,
  upsertEntities,
  deleteAllEntities,
} from '@ngneat/elf-entities';
import {
  withRequestsCache,
  withRequestsStatus,
  selectRequestStatus,
  StatusState,
} from '@ngneat/elf-requests';
import {
  deleteAllPages,
  hasPage,
  PaginationData,
  selectCurrentPageEntities,
  selectPaginationData,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';
import { DataPage } from '@myrmidon/ng-tools';

import {
  NodeMappingService,
  NodeMapping,
  NodeMappingFilter,
  NODE_MAPPING_SERVICE,
} from '../models';

const PAGE_SIZE = 20;

export interface NodeMappingListProps {
  filter: NodeMappingFilter;
}

@Injectable({ providedIn: 'root' })
export class NodeMappingListRepository {
  private _store;
  private _lastPageSize: number;

  public activeNodeMapping$: Observable<NodeMapping | undefined>;
  public filter$: Observable<NodeMappingFilter>;
  public pagination$: Observable<PaginationData & { data: NodeMapping[] }>;
  public status$: Observable<StatusState>;
  private _saving$: BehaviorSubject<boolean>;
  private _loading$: BehaviorSubject<boolean>;

  public saving$: Observable<boolean>;
  public loading$: Observable<boolean>;

  constructor(
    @Inject(NODE_MAPPING_SERVICE)
    private _mappingRepository: NodeMappingService
  ) {
    // create store
    this._store = this.createStore();
    this._lastPageSize = PAGE_SIZE;

    // indicators
    this._saving$ = new BehaviorSubject<boolean>(false);
    this.saving$ = this._saving$.asObservable();
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();

    // combine pagination parameters with page data for our consumers
    this.pagination$ = combineLatest([
      this._store.pipe(selectPaginationData()),
      this._store.pipe(selectCurrentPageEntities()),
    ]).pipe(
      map(([pagination, data]) => ({ ...pagination, data })),
      debounceTime(0)
    );

    this.activeNodeMapping$ = this._store.pipe(selectActiveEntity());
    this.filter$ = this._store.pipe(select((state) => state.filter));

    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      this.loadPage(1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('node-mapping-list'));

    // load page 1 and subscribe to pagination
    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'document' },
      withProps<NodeMappingListProps>({
        filter: {},
      }),
      withEntities<NodeMapping>(),
      withActiveId(),
      withRequestsCache<'node-mapping-list'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<NodeMapping>
  ): PaginationData & { data: NodeMapping[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: NodeMapping[] }): void {
    const { data, ...paginationData } = response;
    this._store.update(
      upsertEntities(data),
      // addEntities(data),
      updatePaginationData(paginationData),
      setPage(
        paginationData.currentPage,
        data.map((c) => c.id)
      )
    );
  }

  public loadPage(pageNumber: number, pageSize?: number): void {
    if (!pageSize) {
      pageSize = PAGE_SIZE;
    }
    // if the page exists and page size is the same, just move to it
    if (
      this._store.query(hasPage(pageNumber)) &&
      pageSize === this._lastPageSize
    ) {
      console.log('Page exists: ' + pageNumber);
      this._store.update(setCurrentPage(pageNumber));
      return;
    }

    // reset cached pages if page size changed
    if (this._lastPageSize !== pageSize) {
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    // load page from server
    this._loading$.next(true);
    this._mappingRepository
      .getMappings(this._store.getValue().filter, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe((page) => {
        this.addPage({ ...this.adaptPage(page), data: page.items });
        this._loading$.next(false);
      });
  }

  public setFilter(filter: NodeMappingFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }

  public deleteMapping(id: NodeMapping['id']): void {
    this._saving$.next(true);

    this._mappingRepository
      .deleteMapping(id)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          this._saving$.next(false);
          this._store.update(deleteEntities(id));
        },
        error: (error) => {
          this._saving$.next(false);
          console.error(
            'Error deleting NodeMapping: ' +
              (error ? JSON.stringify(error) : '')
          );
        },
      });
  }

  public addMapping(entry: NodeMapping): void {
    this._saving$.next(true);

    this._mappingRepository
      .addMapping(entry)
      .pipe(take(1))
      .subscribe({
        next: (saved) => {
          this._saving$.next(false);
          this._store.update(upsertEntities(saved));
        },
        error: (error) => {
          this._saving$.next(false);
          console.error(
            'Error saving NodeMapping: ' + (error ? JSON.stringify(error) : '')
          );
        },
      });
  }
}
