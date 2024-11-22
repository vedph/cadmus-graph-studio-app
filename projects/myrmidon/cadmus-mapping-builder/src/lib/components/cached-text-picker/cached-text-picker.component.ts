import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { RamCacheService } from '../../services/ram-cache.service';

/**
 * Cached text picker. This allows the user to pick a text from a cache
 * by selecting its key, or to add a new text to the cache with the
 * specified key.
 */
@Component({
  selector: 'cadmus-cached-text-picker',
  templateUrl: './cached-text-picker.component.html',
  styleUrls: ['./cached-text-picker.component.css'],
  standalone: false,
})
export class CachedTextPickerComponent implements OnInit {
  private _keyPrefix: string | undefined;

  /**
   * The cache key prefix to use for this picker.
   */
  @Input()
  public get keyPrefix(): string | undefined | null {
    return this._keyPrefix;
  }
  public set keyPrefix(value: string | undefined | null) {
    if (this._keyPrefix === value) {
      return;
    }
    this._keyPrefix = value || undefined;
    this.loadKeys();
  }

  /**
   * The text, as set by consumer code. This can be added to the cache
   * with the specified key.
   */
  @Input()
  public text: string | undefined | null;

  /**
   * Emitted whenever a text is picked from the cache.
   */
  @Output()
  public textPick: EventEmitter<string>;

  public keys: string[];
  public key: FormControl<string | null>;

  public newKey: FormControl<string>;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _cacheService: RamCacheService
  ) {
    this.keys = [];
    this.key = formBuilder.control(null);

    // new key form
    this.newKey = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(50)],
      nonNullable: true,
    });
    this.form = formBuilder.group({
      newKey: this.newKey,
    });
    // events
    this.textPick = new EventEmitter<string>();
  }

  private loadKeys(): void {
    this.keys = this._cacheService.getKeys(this._keyPrefix).sort();
  }

  public ngOnInit(): void {
    this.loadKeys();
  }

  private buildPrefixedKey(key: string): string {
    return this._keyPrefix && key.startsWith(this._keyPrefix)
      ? key
      : `${this._keyPrefix}${key}`;
  }

  public pick(): void {
    if (!this.key.value) {
      return;
    }
    const text = this._cacheService.get(
      this.buildPrefixedKey(this.key.value)
    ) as string;
    if (text) {
      this.textPick.emit(text);
    }
  }

  public add(): void {
    if (this.form.invalid || !this.text || !this._keyPrefix) {
      return;
    }
    this._cacheService.add(`${this._keyPrefix}${this.newKey.value}`, this.text);
    this.keys = [...this.keys, this.newKey.value].sort();
  }

  public remove(): void {
    if (!this.key.value) {
      return;
    }
    const key = this.buildPrefixedKey(this.key.value);
    this._cacheService.remove(key);
    this.keys = this.keys.filter((k) => k !== key);
  }
}
