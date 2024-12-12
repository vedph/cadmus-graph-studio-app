import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { DataPage } from '@myrmidon/ngx-tools';
import { DialogService } from '@myrmidon/ngx-mat-tools';

import { NodeMappingListRepository } from '../../state/mapping-list.repository';
import { NodeMapping } from '../../models';

@Component({
  selector: 'cadmus-mapping-list',
  templateUrl: './mapping-list.component.html',
  styleUrls: ['./mapping-list.component.css'],
  standalone: false,
})
export class MappingListComponent {
  public page$: Observable<DataPage<NodeMapping>>;
  public loading$: Observable<boolean | undefined>;
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
    this.page$ = _repository.page$;
    this.loading$ = _repository.loading$;
    // event
    this.mappingEdit = new EventEmitter<NodeMapping>();
  }

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public reset(): void {
    this._repository.reset();
  }

  public deleteMapping(mapping: NodeMapping): void {
    this._dialogService
      .confirm(`Delete mapping ${mapping.name}?`, 'Delete')
      .subscribe((yes) => {
        if (yes) {
          this._repository.deleteMapping(mapping.id);
        }
      });
  }

  public editMapping(mapping: NodeMapping): void {
    this.mappingEdit.emit(mapping);
  }
}
