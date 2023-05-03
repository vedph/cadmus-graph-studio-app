import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EnvService, ErrorService, ErrorWrapper } from '@myrmidon/ng-tools';

import { GraphSet, NodeMapping } from '../models';

@Injectable({
  providedIn: 'root',
})
export class GraphStudioApiService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  public runMappings(
    source: string,
    mappings: NodeMapping[]
  ): Observable<ErrorWrapper<GraphSet>> {
    const url = this._env.get('apiUrl') + '/mappings/run';
    // TODO: eventually add other parameters (see API)
    return this._http
      .post<ErrorWrapper<GraphSet>>(url, {
        source: source,
        mappings: mappings,
      })
      .pipe(catchError(this._error.handleError));
  }

  public jmesTransform(
    json: string,
    expression: string
  ): Observable<ErrorWrapper<string>> {
    const url = this._env.get('apiUrl') + '/jmes/transform';
    return this._http
      .post<ErrorWrapper<string>>(url, {
        json: json,
        expression: expression,
      })
      .pipe(catchError(this._error.handleError));
  }
}
