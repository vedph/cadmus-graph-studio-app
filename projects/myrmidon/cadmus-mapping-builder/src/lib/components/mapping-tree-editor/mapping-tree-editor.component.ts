import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';

import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy } from '@myrmidon/ng-tools';

import { NodeMapping } from '../../models';
import { MappingJsonService } from '../../services/mapping-json.service';

/**
 * The mapping tree editor component. This orchestrates editing a mapping
 * and all its descendants, if any. It composes together a mapping tree
 * component and a mapping editor component. Any edit is in-memory, and
 * is persisted only when the user clicks the Save button for the whole
 * root mapping.
 */
@Component({
  selector: 'cadmus-mapping-tree-editor',
  templateUrl: './mapping-tree-editor.component.html',
  styleUrls: ['./mapping-tree-editor.component.css'],
})
export class MappingTreeEditorComponent {
  private _mapping?: NodeMapping;

  /**
   * The root mapping to edit. This also sets the currently edited mapping.
   */
  @Input()
  public get mapping(): NodeMapping | undefined | null {
    return this._mapping;
  }
  public set mapping(value: NodeMapping | undefined | null) {
    this._mapping = value || undefined;
    if (!value) {
      this.editedMapping = undefined;
    } else {
      this._jsonService.visitMappings(value);
      this.editedMapping = value;
    }
  }

  /**
   * Emitted when the root mapping with all its descendants changes.
   */
  @Output()
  public mappingChange: EventEmitter<NodeMapping>;

  /**
   * Emitted when the user requests to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public editedMapping?: NodeMapping;

  constructor(
    private _jsonService: MappingJsonService,
    private _dialogService: DialogService
  ) {
    this.mappingChange = new EventEmitter<NodeMapping>();
    this.editorClose = new EventEmitter<any>();
  }

  public onMappingSelected(mapping: NodeMapping): void {
    this.editedMapping = mapping;
  }

  /**
   * Save the specified mapping in its edited tree.
   * @param mapping The mapping to save.
   */
  public onMappingSave(mapping: NodeMapping): void {
    this.editedMapping = mapping;

    // if editing the root, just replace it and relink
    // its children to the new root
    if (!mapping.parent) {
      for (let child of this._mapping!.children!) {
        child.parent = mapping;
      }
      this._mapping = mapping;
    } else {
      // else insert/replace the descendant mapping in the tree
      if (!mapping.id) {
        // insert as last child
        this._jsonService.visitMappings(this._mapping!, false, (m) => {
          if (m.id === mapping.parent!.id) {
            if (!m.children) {
              m.children = [];
            }
            m.children?.push(mapping);
            mapping.parent = m;
            return false;
          } else {
            return true;
          }
        });
      } else {
        // replace
        this._jsonService.visitMappings(this._mapping!, false, (m) => {
          if (m.id === mapping.id) {
            // remove the old mapping from m.parent.children
            const siblings: NodeMapping[] = [];
            for (let i = 0; i < m.parent!.children!.length; i++) {
              if (m.parent!.children![i].id === m.id) {
                siblings.push(mapping);
                // update parent of all the children
                for (let child of m.children!) {
                  child.parent = mapping;
                }
              } else {
                siblings.push(m.parent!.children![i]);
              }
            }
            m.parent!.children = siblings;
            return false;
          }
          return true;
        });
      }
    }
  }

  public onMappingDelete(mapping: NodeMapping): void {
    this._dialogService
      .confirm(`Delete branch ${mapping.name}?`, 'Delete')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          // close edited mapping if it is the one being deleted
          if (this.editedMapping?.id === mapping.id) {
            this.editedMapping = undefined;
          }
          // remove from tree
          mapping.parent!.children = mapping.parent!.children!.filter(
            (m) => m.id !== mapping.id
          );
          // update the root mapping
          this.mapping = deepCopy(this._mapping!);
        }
      });
  }

  public onMappingAddChild(mapping: NodeMapping): void {
    // calculate the max ID by visiting mapping
    let maxId = 0;
    this._jsonService.visitMappings(mapping, false, (m) => {
      if (m.id && m.id > maxId) {
        maxId = m.id;
      }
      return true;
    });
    // edit the new mapping (it will be inserted on save)
    this.editedMapping = {
      id: maxId + 1,
      parentId: mapping.id,
      parent: mapping,
      name: 'New mapping',
      sourceType: 2,
      source: '',
      sid: '',
    };
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this._mapping) {
      this.mappingChange.emit(this._mapping);
    }
  }
}
