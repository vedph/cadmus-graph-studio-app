import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { EnvServiceProvider } from '@myrmidon/ngx-tools';
import { MappingDocPageComponent } from './components/mapping-doc-page/mapping-doc-page.component';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        MappingEditorPageComponent,
        MappingDocPageComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
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
        MatSnackBarModule,
        MatTabsModule,
        MatTooltipModule,
        MatToolbarModule,
        // vendor
        MonacoEditorModule.forRoot(),
        // locals
        CadmusMappingBuilderModule], providers: [
        // environment service
        EnvServiceProvider,
        // use RAM-based store for mappings
        {
            provide: NODE_MAPPING_SERVICE,
            useClass: RamNodeMappingService,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
