import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NodeMapping } from '@myrmidon/cadmus-mapping-builder';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent {
  constructor(private _router: Router) {}

  public onEditMapping(mapping: NodeMapping): void {
    this._router.navigate(['mappings', mapping.id]);
  }

  public addMapping(): void {
    this._router.navigate(['mappings', 0]);
  }
}
