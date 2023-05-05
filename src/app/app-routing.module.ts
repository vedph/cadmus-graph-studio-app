import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MappingEditorPageComponent } from './components/mapping-editor-page/mapping-editor-page.component';
import { MappingDocPageComponent } from './components/mapping-doc-page/mapping-doc-page.component';

const routes: Routes = [
  // editor
  { path: 'mappings/:id', component: MappingEditorPageComponent },
  // doc
  { path: 'mappings-doc', component: MappingDocPageComponent },
  // home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // fallback
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
