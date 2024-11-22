import { Component, Inject } from '@angular/core';

import {
  NODE_MAPPING_SERVICE,
  NodeMappingListRepository,
  NodeMappingService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    try {
      JSON.parse(control.value);
      return null;
    } catch (error) {
      return { invalidJson: true };
    }
  };
}

@Component({
    selector: 'app-mapping-doc-page',
    templateUrl: './mapping-doc-page.component.html',
    styleUrls: ['./mapping-doc-page.component.css'],
    standalone: false
})
export class MappingDocPageComponent {
  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  public json: FormControl<string>;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _snackbar: MatSnackBar,
    private _repository: NodeMappingListRepository,
    @Inject(NODE_MAPPING_SERVICE) private _mappingService: NodeMappingService
  ) {
    this.json = formBuilder.control('', {
      validators: [Validators.required, jsonValidator()],
      nonNullable: true,
    });
    this.form = formBuilder.group({
      json: this.json,
    });
    this.exportToDocument();
  }

  public exportToDocument() {
    this._mappingService.exportMappings().subscribe((json) => {
      this.json.setValue(json);
    });
  }

  public importFromDocument() {
    this._mappingService
      .importMappings(this.json.value)
      .subscribe((mappings) => {
        this._repository.reset();
        this._snackbar.open('Mappings imported: ' + mappings.length, 'OK', {
          duration: 3000,
        });
      });
  }
}
