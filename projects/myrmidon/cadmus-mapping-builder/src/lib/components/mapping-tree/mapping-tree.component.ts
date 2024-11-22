import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { NodeMapping } from '../../models';

/**
 * Node mapping tree component. This represents the hierarchy of mappings
 * of a root mapping, allowing users to select any of the mapping descendants,
 * or the root mapping itself; add new children to a mapping; and delete a
 * mapping.
 */
@Component({
  selector: 'cadmus-mapping-tree',
  templateUrl: './mapping-tree.component.html',
  styleUrls: ['./mapping-tree.component.css'],
  standalone: false,
})
export class MappingTreeComponent {
  private _mapping?: NodeMapping;
  private _selected?: NodeMapping;

  /**
   * The root mapping.
   */
  @Input()
  public get mapping(): NodeMapping | undefined | null {
    return this._mapping;
  }
  public set mapping(value: NodeMapping | undefined | null) {
    if (this._mapping === value) {
      return;
    }
    this._mapping = value || undefined;
    this.updateTree(this._mapping);
  }

  /**
   * The currently selected mapping.
   * This is set by the user clicking a mapping in the tree.
   * When this changes, the `selectedChange` event is emitted.
   **/
  @Input()
  public get selected(): NodeMapping | undefined | null {
    return this._selected;
  }
  public set selected(value: NodeMapping | undefined | null) {
    if (this._selected === value) {
      return;
    }
    this._selected = value || undefined;
  }

  /**
   * Emitted when the selected mapping changes.
   */
  @Output()
  public selectedChange: EventEmitter<NodeMapping>;

  /**
   * Emitted when a mapping should be added as child
   * of the currently selected mapping.
   */
  @Output()
  public mappingAdd: EventEmitter<NodeMapping>;

  /**
   * Emitted when a mapping is to be deleted.
   */
  @Output()
  public mappingDelete: EventEmitter<NodeMapping>;

  public treeControl: NestedTreeControl<NodeMapping>;
  public treeDataSource: MatTreeNestedDataSource<NodeMapping>;

  public hasChildren = (index: number, node: NodeMapping) => {
    return node && node.children && node.children.length > 0;
  };

  public isRoot = (index: number, node: NodeMapping) => {
    return !node.parentId;
  };

  constructor() {
    this.treeControl = new NestedTreeControl<NodeMapping>(
      (node) => node.children
    );
    this.treeDataSource = new MatTreeNestedDataSource<NodeMapping>();
    // events
    this.selectedChange = new EventEmitter<NodeMapping>();
    this.mappingAdd = new EventEmitter<NodeMapping>();
    this.mappingDelete = new EventEmitter<NodeMapping>();
  }

  private updateTree(root?: NodeMapping | null) {
    this.selected = undefined;
    this.treeDataSource.data = root ? [root] : [];
    // required hack: https://github.com/angular/components/issues/12469
    this.treeControl.dataNodes = this.treeDataSource.data;
    this.treeControl.expandAll();
  }

  public isSelected(node: NodeMapping): boolean {
    return this._selected === node;
  }

  public onNodeClick(node: NodeMapping): void {
    this._selected = node;
    this.selectedChange.emit(node);
  }

  public addChildNode(node: NodeMapping): void {
    this.mappingAdd.emit(node);
  }

  public deleteNode(node: NodeMapping): void {
    this.mappingDelete.emit(node);
  }
}
