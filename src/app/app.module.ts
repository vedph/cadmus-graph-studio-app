import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// elf
import { devTools } from '@ngneat/elf-devtools';
import { Actions } from '@ngneat/effects-ng';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

// monaco
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

// lib
import {
  CadmusMappingBuilderModule,
  NODE_MAPPING_SERVICE,
  RamNodeMappingService,
} from 'projects/myrmidon/cadmus-mapping-builder/src/public-api';

// app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MappingEditorPageComponent } from './components/mapping-editor-page/mapping-editor-page.component';
import { CachedTextPickerComponent } from './cached-text-picker/cached-text-picker.component';
import { EnvServiceProvider } from '@myrmidon/ng-tools';
import { MappingDocPageComponent } from './components/mapping-doc-page/mapping-doc-page.component';

// https://ngneat.github.io/elf/docs/dev-tools/
export function initElfDevTools(actions: Actions) {
  return () => {
    devTools({
      name: 'Cadmus Graph Studio',
      actionsDispatcher: actions,
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MappingEditorPageComponent,
    CachedTextPickerComponent,
    MappingDocPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    // vendor
    MonacoEditorModule.forRoot(),
    // locals
    CadmusMappingBuilderModule,
  ],
  providers: [
    // environment service
    EnvServiceProvider,
    // ELF dev tools
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initElfDevTools,
      deps: [Actions],
    },
    // use RAM-based store for mappings
    {
      provide: NODE_MAPPING_SERVICE,
      useClass: RamNodeMappingService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
