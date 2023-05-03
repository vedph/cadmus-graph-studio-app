import { Component, Inject } from '@angular/core';
import { take } from 'rxjs';

import {
  NODE_MAPPING_SERVICE,
  NodeMappingListRepository,
  NodeMappingService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';

import { AssetService } from './services/asset.service';
import { DialogService } from '@myrmidon/ng-mat-tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    @Inject(NODE_MAPPING_SERVICE) private _mappingService: NodeMappingService,
    assetService: AssetService,
    private _repositoryService: NodeMappingListRepository,
    private _dialogService: DialogService
  ) {
    assetService
      .loadText('sample-mappings.json')
      .pipe(take(1))
      .subscribe((json) => {
        _mappingService.importMappings(json);
        _repositoryService.clearCache();
        _repositoryService.loadPage(1);
      });
  }

  public clear(): void {
    this._dialogService
      .confirm('WARNING', 'Clear all mappings?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._mappingService.clear();
          this._repositoryService.clearCache();
          this._repositoryService.loadPage(1);
        }
      });
  }

  public async export() {
    this._mappingService
      .exportMappings()
      .pipe(take(1))
      .subscribe((json) => {
        // save to file
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mappings.json';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  public import() {
    // load string from file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.item(0);
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const json = reader.result as string;
        this._mappingService.importMappings(json);
      };
      reader.readAsText(file);
    };
  }
}
