import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeMapping } from '../../models';
import { MappingJsonService } from '../../services/mapping-json.service';

/**
 * The mapping tree editor component. This orchestrates editing a mapping
 * and all its descendants, if any. It composes together a mapping tree
 * component and a mapping editor component.
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
      this._jsonService.visitMapping(value);
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

  constructor(private _jsonService: MappingJsonService) {
    this.mappingChange = new EventEmitter<NodeMapping>();
    this.editorClose = new EventEmitter<any>();
  }

  public onMappingSelected(mapping: NodeMapping): void {
    this.editedMapping = mapping;
  }

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
      // else replace the descendant mapping in the tree
      this._jsonService.visitMapping(this._mapping!, false, (m) => {
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

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this._mapping) {
      this.mappingChange.emit(this._mapping);
    }
  }
}
