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
})
export class CachedTextPickerComponent implements OnInit {
  private _cacheKey: string | undefined;

  /**
   * The cache key to use for this picker. This is the key of the
   * object with the texts to be picked. The object is stored in the
   * RAM cache, and has a string key for each text.
   */
  @Input()
  public get cacheKey(): string | undefined | null {
    return this._cacheKey;
  }
  public set cacheKey(value: string | undefined | null) {
    if (this._cacheKey === value) {
      return;
    }
    this._cacheKey = value || undefined;
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
    if (!this._cacheKey) {
      this.keys = [];
    } else {
      this.keys = Object.keys(
        this._cacheService.get(this._cacheKey) || {}
      ).sort();
    }
  }

  public ngOnInit(): void {
    this.loadKeys();
  }

  public pick(): void {
    if (!this.key.value || !this._cacheKey) {
      return;
    }
    const text = this._cacheService.get(this._cacheKey)?.[this.key.value];
    if (text) {
      this.textPick.emit(text);
    }
  }

  public add(): void {
    if (this.form.invalid || !this.text || !this._cacheKey) {
      return;
    }
    this._cacheService.add(
      this._cacheKey,
      Object.assign(this._cacheService.get(this._cacheKey) || {}, {
        [this.newKey.value]: this.text,
      })
    );
    this.keys = [...this.keys, this.newKey.value].sort();
  }

  public remove(): void {
    if (!this.key.value || !this._cacheKey) {
      return;
    }
    const obj = this._cacheService.get(this._cacheKey);
    if (obj) {
      obj[this.key.value] = undefined;
    }
    this._cacheService.add(this._cacheKey, obj);
    this.keys = this.keys.filter((k) => k !== this.key.value);
  }
}
