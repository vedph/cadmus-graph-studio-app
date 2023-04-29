import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NodeMapping } from '@myrmidon/cadmus-mapping-builder';

import { NodeMappingOutput } from '../../models';

@Component({
  selector: 'cadmus-mapping-editor',
  templateUrl: './mapping-editor.component.html',
  styleUrls: ['./mapping-editor.component.css'],
})
export class MappingEditorComponent {
  private _mapping?: NodeMapping;

  @Input()
  public get mapping(): NodeMapping | undefined | null {
    return this._mapping;
  }
  public set mapping(value: NodeMapping | undefined | null) {
    this._mapping = value || undefined;
    this.updateForm(this._mapping);
  }

  public parentId: FormControl<number | null>;
  public ordinal: FormControl<number | null>;
  public name: FormControl<string>;
  public sourceType: FormControl<number>;
  public facetFilter: FormControl<string | null>;
  public groupFilter: FormControl<string | null>;
  public flagsFilter: FormControl<number>;
  public titleFilter: FormControl<string | null>;
  public partTypeFilter: FormControl<string | null>;
  public partRoleFilter: FormControl<string | null>;
  public description: FormControl<string | null>;
  public source: FormControl<string>;
  public sid: FormControl<string>;
  public output: FormControl<NodeMappingOutput | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.parentId = formBuilder.control(null);
    this.ordinal = formBuilder.control(null);
    this.name = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    });
    this.sourceType = formBuilder.control(0, { nonNullable: true });
    this.facetFilter = formBuilder.control(null, Validators.maxLength(100));
    this.groupFilter = formBuilder.control(null, Validators.maxLength(100));
    this.flagsFilter = formBuilder.control(0, { nonNullable: true });
    this.titleFilter = formBuilder.control(null, Validators.maxLength(100));
    this.partTypeFilter = formBuilder.control(null, Validators.maxLength(100));
    this.partRoleFilter = formBuilder.control(null, Validators.maxLength(100));
    this.description = formBuilder.control(null, Validators.maxLength(1000));
    this.source = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    });
    this.sid = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    });
    this.output = formBuilder.control(null);
    this.form = formBuilder.group({
      parentId: this.parentId,
      ordinal: this.ordinal,
      name: this.name,
      sourceType: this.sourceType,
      facetFilter: this.facetFilter,
      groupFilter: this.groupFilter,
      flagsFilter: this.flagsFilter,
      titleFilter: this.titleFilter,
      partTypeFilter: this.partTypeFilter,
      partRoleFilter: this.partRoleFilter,
      description: this.description,
      source: this.source,
      sid: this.sid,
      output: this.output,
    });
  }

  private updateForm(mapping: NodeMapping | undefined): void {
    if (!mapping) {
      this.form.reset();
      return;
    }
    // TODO
  }
}
