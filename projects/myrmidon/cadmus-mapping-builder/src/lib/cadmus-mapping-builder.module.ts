import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { PagedDataBrowsersModule } from '@myrmidon/paged-data-browsers';

import { MappingFilterComponent } from './components/mapping-filter/mapping-filter.component';
import { MappingListComponent } from './components/mapping-list/mapping-list.component';
import { MappingEditorComponent } from './components/mapping-editor/mapping-editor.component';
import { MappingOutputEditorComponent } from './components/mapping-output-editor/mapping-output-editor.component';
import { MappingTreeComponent } from './components/mapping-tree/mapping-tree.component';
import { MappingTreeEditorComponent } from './components/mapping-tree-editor/mapping-tree-editor.component';
import { JmesComponent } from './components/jmes/jmes.component';
import { CachedTextPickerComponent } from './components/cached-text-picker/cached-text-picker.component';
import { MappingRunnerComponent } from './components/mapping-runner/mapping-runner.component';

@NgModule({
  declarations: [
    MappingFilterComponent,
    MappingListComponent,
    MappingEditorComponent,
    MappingOutputEditorComponent,
    MappingTreeComponent,
    MappingTreeEditorComponent,
    JmesComponent,
    CachedTextPickerComponent,
    MappingRunnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    // vendor
    MonacoEditorModule,
    NgToolsModule,
    PagedDataBrowsersModule,
  ],
  exports: [
    MappingFilterComponent,
    MappingListComponent,
    MappingEditorComponent,
    MappingOutputEditorComponent,
    MappingTreeComponent,
    MappingTreeEditorComponent,
    JmesComponent,
    CachedTextPickerComponent,
    MappingRunnerComponent
  ],
})
export class CadmusMappingBuilderModule {}
