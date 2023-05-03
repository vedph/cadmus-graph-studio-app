import { Component, Inject } from '@angular/core';
import { take } from 'rxjs';

import {
  NODE_MAPPING_SERVICE,
  NodeMappingListRepository,
  NodeMappingService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';

import { AssetService } from './services/asset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    @Inject(NODE_MAPPING_SERVICE) private _mappingService: NodeMappingService,
    assetService: AssetService,
    repositoryService: NodeMappingListRepository
  ) {
    assetService
      .loadText('sample-mappings.json')
      .pipe(take(1))
      .subscribe((json) => {
        _mappingService.importMappings(json);
        repositoryService.clearCache();
        repositoryService.loadPage(1);
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
}
