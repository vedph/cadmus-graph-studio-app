import { Component, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { PaginationData } from '@ngneat/elf-pagination';

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

  constructor(private _repository: NodeMappingListRepository) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }
}
