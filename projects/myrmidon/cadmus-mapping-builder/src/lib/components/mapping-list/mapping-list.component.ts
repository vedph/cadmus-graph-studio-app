import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, take } from 'rxjs';

import { PaginationData } from '@ngneat/elf-pagination';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { NodeMappingListRepository } from '../../state/mapping-list.repository';
import { NodeMapping } from '../../models';

@Component({
  selector: 'cadmus-mapping-list',
  templateUrl: './mapping-list.component.html',
  styleUrls: ['./mapping-list.component.css'],
})
export class MappingListComponent {
  public pagination$: Observable<PaginationData & { data: NodeMapping[] }>;
  public loading$: Observable<boolean>;
  public sourceTypes = [
    { id: 0, label: 'any' },
    { id: 1, label: 'item' },
    { id: 2, label: 'part' },
  ];

  @Output()
  public mappingEdit: EventEmitter<NodeMapping>;

  constructor(
    private _repository: NodeMappingListRepository,
    private _dialogService: DialogService
  ) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
    // event
    this.mappingEdit = new EventEmitter<NodeMapping>();
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  public deleteMapping(mapping: NodeMapping): void {
    this._dialogService
      .confirm(`Delete mapping ${mapping.name}?`, 'Delete')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._repository.deleteMapping(mapping.id);
          this.clearCache();
        }
      });
  }

  public editMapping(mapping: NodeMapping): void {
    this.mappingEdit.emit(mapping);
  }
}
