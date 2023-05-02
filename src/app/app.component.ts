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
    @Inject(NODE_MAPPING_SERVICE) mappingService: NodeMappingService,
    assetService: AssetService,
    repositoryService: NodeMappingListRepository
  ) {
    assetService
      .loadText('sample-mappings.json')
      .pipe(take(1))
      .subscribe((json) => {
        mappingService.importMappings(json);
        repositoryService.clearCache();
        repositoryService.loadPage(1);
      });
  }
}
