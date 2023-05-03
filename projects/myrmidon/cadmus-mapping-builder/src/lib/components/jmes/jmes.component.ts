import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, take } from 'rxjs';

import { RamCacheService } from '../../services/ram-cache.service';
import { GraphStudioApiService } from '../../services/graph-studio-api.service';

/**
 * JMES expression editor with inline test.
 */
@Component({
  selector: 'cadmus-jmes',
  templateUrl: './jmes.component.html',
  styleUrls: ['./jmes.component.css'],
})
export class JmesComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _expression: string | undefined;

  /**
   * The JMES expression being edited.
   */
  @Input()
  public get expression(): string | undefined | null {
    return this._expression;
  }
  public set expression(value: string | undefined | null) {
    if (this._expression === value) {
      return;
    }
    this._expression = value || undefined;
    this.jmes.setValue(this._expression || '');
  }

  /**
   * Emitted whenever the expression changes.
   */
  @Output()
  public expressionChange: EventEmitter<string>;

  public jmes: FormControl<string>;
  public input: FormControl<string>;
  public output: FormControl<string | null>;
  public form: FormGroup;

  public sampleKey: FormControl<string>;
  public sampleForm: FormGroup;

  public busy?: boolean;
  public error?: string;
  public sampleKeys: string[];

  constructor(
    formBuilder: FormBuilder,
    private _apiService: GraphStudioApiService,
    private _cacheService: RamCacheService
  ) {
    // form
    this.jmes = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    });
    this.input = formBuilder.control('', {
      validators: Validators.maxLength(5000),
      nonNullable: true,
    });
    this.output = formBuilder.control(null);
    this.form = formBuilder.group({
      jmes: this.jmes,
      input: this.input,
      output: this.output,
    });
    // sample
    this.sampleKeys = Object.keys(this._cacheService.get('jmes') || {});
    this.sampleKey = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(50)],
      nonNullable: true,
    });
    this.sampleForm = formBuilder.group({
      sampleKey: this.sampleKey,
    });
    // events
    this.expressionChange = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this._sub = this.jmes.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((_) => {
        this._expression = this.jmes.value;
        this.expressionChange.emit(this.jmes.value);
      });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public transform(): void {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.error = undefined;
    this._apiService
      .jmesTransform(this.input.value, this.jmes.value)
      .pipe(take(1))
      .subscribe({
        next: (w) => {
          this.busy = false;
          if (w.error) {
            this.error = w.error;
          } else {
            this.output.setValue(w.value || '');
            this.output.updateValueAndValidity();
            this.output.markAsDirty();
          }
        },
        error: (error) => {
          this.busy = false;
          this.error = error;
        },
      });
  }

  public onTextPick(text: string): void {
    this.input.setValue(text);
    this.input.updateValueAndValidity();
    this.input.markAsDirty();
  }

  public addSample(): void {
    if (this.sampleForm.invalid) {
      return;
    }
    this._cacheService.add(
      'jmes',
      Object.assign(this._cacheService.get('jmes') || {}, {
        [this.sampleKey.value]: this.input.value,
      })
    );
    this.sampleKeys = [...this.sampleKeys, this.sampleKey.value].sort();
  }
}
