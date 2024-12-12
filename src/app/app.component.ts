import { Component, Inject } from '@angular/core';
import { take } from 'rxjs';

import {
  NODE_MAPPING_SERVICE,
  NodeMappingListRepository,
  NodeMappingService,
  RamCacheService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';

import { AssetService } from './services/asset.service';
import { DialogService } from '@myrmidon/ngx-mat-tools';
import { Router } from '@angular/router';
import { EnvService } from '@myrmidon/ngx-tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  public version: string;

  constructor(
    private _router: Router,
    private _dialogService: DialogService,
    private _repositoryService: NodeMappingListRepository,
    @Inject(NODE_MAPPING_SERVICE) private _mappingService: NodeMappingService,
    assetService: AssetService,
    cacheService: RamCacheService,
    envService: EnvService
  ) {
    this.version = envService.get('version') ?? '0.0.1';
    // load sample mappings
    assetService
      .loadText('sample-mappings.json')
      .pipe(take(1))
      .subscribe((json) => {
        _mappingService.importMappings(json);
        _repositoryService.reset();
      });
    // load presets
    assetService
      .loadObject('sample-presets')
      .pipe(take(1))
      .subscribe((data: any) => {
        // for each property of data (jmes/map)
        for (let key in data) {
          cacheService.add(key, JSON.stringify(data[key], null, 2));
        }
      });
  }

  public clear(): void {
    this._dialogService
      .confirm('WARNING', 'Clear all mappings?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._mappingService.clear();
          this._repositoryService.reset();
        }
      });
  }

  public view(): void {
    this._router.navigate(['/mappings-doc']);
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
