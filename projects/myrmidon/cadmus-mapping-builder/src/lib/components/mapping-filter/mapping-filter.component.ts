import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { NodeMappingFilter } from '../../models';
import { NodeMappingListRepository } from '../../state/mapping-list.repository';

@Component({
  selector: 'cadmus-mapping-filter',
  templateUrl: './mapping-filter.component.html',
  styleUrls: ['./mapping-filter.component.css'],
})
export class MappingFilterComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  public filter$: Observable<NodeMappingFilter>;
  public loading$: Observable<boolean>;

  public sourceType: FormControl<number>;
  public name: FormControl<string | null>;
  public facet: FormControl<string | null>;
  public group: FormControl<string | null>;
  public flags: FormControl<number>;
  public title: FormControl<string | null>;
  public partType: FormControl<string | null>;
  public partRole: FormControl<string | null>;
  public form: FormGroup;

  constructor(
    private _repository: NodeMappingListRepository,
    formBuilder: FormBuilder
  ) {
    this.filter$ = _repository.filter$;
    this.loading$ = _repository.loading$;
    // form
    this.sourceType = formBuilder.control(0, { nonNullable: true });
    this.name = formBuilder.control(null);
    this.facet = formBuilder.control(null);
    this.group = formBuilder.control(null);
    this.flags = formBuilder.control(0, { nonNullable: true });
    this.title = formBuilder.control(null);
    this.partType = formBuilder.control(null);
    this.partRole = formBuilder.control(null);
    this.form = formBuilder.group({
      sourceType: this.sourceType,
      name: this.name,
      facet: this.facet,
      group: this.group,
      flags: this.flags,
      title: this.title,
      partType: this.partType,
      partRole: this.partRole,
    });
  }

  ngOnInit(): void {
    this._sub = this.filter$.subscribe((f) => {
      this.updateForm(f);
    });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private updateForm(filter: NodeMappingFilter): void {
    this.sourceType.setValue(filter.sourceType || 0);
    this.name.setValue(filter.name || null);
    this.facet.setValue(filter.facet || null);
    this.group.setValue(filter.group || null);
    this.flags.setValue(filter.flags || 0);
    this.title.setValue(filter.title || null);
    this.partType.setValue(filter.partType || null);
    this.partRole.setValue(filter.partRole || null);
    this.form.markAsPristine();
  }

  private getFilter(): NodeMappingFilter {
    return {
      sourceType: this.sourceType.value || undefined,
      name: this.name.value || undefined,
      facet: this.facet.value || undefined,
      group: this.group.value || undefined,
      flags: this.flags.value || undefined,
      title: this.title.value || undefined,
      partType: this.partType.value || undefined,
      partRole: this.partRole.value || undefined,
    };
  }

  public reset(): void {
    this.form.reset();
    this.apply();
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    const filter = this.getFilter();
    // update filter in state
    this._repository.setFilter(filter);
  }
}
