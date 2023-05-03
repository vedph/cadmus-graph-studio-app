import { Component, Input } from '@angular/core';

import { GraphSet, NodeMapping } from '../../models';
import { GraphStudioApiService } from '../../services/graph-studio-api.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';

/**
 * Node mapping runner component. This allows you to run a mapping
 * on a given input text, and see the resulting graph set.
 */
@Component({
  selector: 'cadmus-mapping-runner',
  templateUrl: './mapping-runner.component.html',
  styleUrls: ['./mapping-runner.component.css'],
})
export class MappingRunnerComponent {
  private _mapping: NodeMapping | undefined;

  /**
   * The mapping to run.
   */
  @Input()
  public get mapping(): NodeMapping | undefined | null {
    return this._mapping;
  }
  public set mapping(value: NodeMapping | undefined | null) {
    this._mapping = value || undefined;
    this.graphSet = undefined;
  }

  public input: FormControl<string>;
  public form: FormGroup;

  public error?: string;
  public graphSet?: GraphSet;

  constructor(
    formBuilder: FormBuilder,
    private _apiService: GraphStudioApiService
  ) {
    this.input = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(5000)],
      nonNullable: true,
    });
    this.form = formBuilder.group({
      input: this.input,
    });
  }

  public run(): void {
    if (this.form.invalid || !this._mapping) {
      return;
    }
    this.error = undefined;
    this._apiService
      .runMappings(this.input.value, [this._mapping])
      .pipe(take(1))
      .subscribe((w) => {
        if (w.error) {
          this.error = w.error;
        } else {
          this.graphSet = w.value;
        }
      });
  }
}
