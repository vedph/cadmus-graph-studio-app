import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgxToolsValidators } from '@myrmidon/ngx-tools';

import { NodeMapping, NodeMappingOutput } from '../../models';

/**
 * Single node mapping editor. Note that ID and parent ID are not editable.
 */
@Component({
  selector: 'cadmus-mapping-editor',
  templateUrl: './mapping-editor.component.html',
  styleUrls: ['./mapping-editor.component.css'],
  standalone: false,
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

  @Output()
  public mappingChange: EventEmitter<NodeMapping>;

  @Output()
  public editorClose: EventEmitter<any>;

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
  public scalarPattern: FormControl<string | null>;
  public output: FormControl<NodeMappingOutput | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
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
      validators: [
        NgxToolsValidators.conditionalValidator(
          () => !this._mapping?.parent,
          Validators.required
        ),
        Validators.maxLength(500),
      ],
      nonNullable: true,
    });
    this.scalarPattern = formBuilder.control(null, Validators.maxLength(500));
    this.output = formBuilder.control(null);
    this.form = formBuilder.group({
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
      scalarPattern: this.scalarPattern,
      output: this.output,
    });
    // events
    this.mappingChange = new EventEmitter<NodeMapping>();
    this.editorClose = new EventEmitter<any>();
  }

  private updateForm(mapping: NodeMapping | undefined): void {
    if (!mapping) {
      this.form.reset();
      return;
    }
    this.ordinal.setValue(mapping.ordinal || 0);
    this.name.setValue(mapping.name);
    this.sourceType.setValue(mapping.sourceType);
    this.facetFilter.setValue(mapping.facetFilter || null);
    this.groupFilter.setValue(mapping.groupFilter || null);
    this.flagsFilter.setValue(mapping.flagsFilter || 0);
    this.titleFilter.setValue(mapping.titleFilter || null);
    this.partTypeFilter.setValue(mapping.partTypeFilter || null);
    this.partRoleFilter.setValue(mapping.partRoleFilter || null);
    this.description.setValue(mapping.description || null);
    this.source.setValue(mapping.source);
    this.sid.setValue(mapping.sid);
    this.scalarPattern.setValue(mapping.scalarPattern || null);
    this.output.setValue(mapping.output || null);
    this.form.markAsPristine();
  }

  public onOutputChange(output: NodeMappingOutput): void {
    this.output.setValue(output);
    this.output.markAsDirty();
    this.output.updateValueAndValidity();
  }

  private getMapping(): NodeMapping {
    return {
      id: this._mapping?.id || 0,
      parentId: this._mapping?.parentId || undefined,
      ordinal: this.ordinal.value || undefined,
      name: this.name.value,
      sourceType: this.sourceType.value,
      facetFilter: this.facetFilter.value || undefined,
      groupFilter: this.groupFilter.value || undefined,
      flagsFilter: this.flagsFilter.value || undefined,
      titleFilter: this.titleFilter.value || undefined,
      partTypeFilter: this.partTypeFilter.value || undefined,
      partRoleFilter: this.partRoleFilter.value || undefined,
      description: this.description.value || undefined,
      source: this.source.value,
      sid: this.sid.value,
      scalarPattern: this.scalarPattern.value || undefined,
      output: this.output.value || undefined,
    };
  }

  public onExpressionChange(expression: string): void {
    this.source.setValue(expression);
    this.source.markAsDirty();
    this.source.updateValueAndValidity();
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    this._mapping = this.getMapping();
    this.mappingChange.emit(this._mapping);
  }
}
