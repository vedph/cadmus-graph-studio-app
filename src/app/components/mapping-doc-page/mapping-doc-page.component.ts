import { Component, Inject } from '@angular/core';
import { take } from 'rxjs';

import {
  NODE_MAPPING_SERVICE,
  NodeMappingService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-mapping-doc-page',
  templateUrl: './mapping-doc-page.component.html',
  styleUrls: ['./mapping-doc-page.component.css'],
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

  constructor(
    formBuilder: FormBuilder,
    @Inject(NODE_MAPPING_SERVICE) private _mappingService: NodeMappingService
  ) {
    this.json = formBuilder.control('', { nonNullable: true });
    this.load();
  }

  private load() {
    this._mappingService
      .exportMappings()
      .pipe(take(1))
      .subscribe((json) => {
        this.json.setValue(json);
      });
  }
}
