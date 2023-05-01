import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NodeMapping } from '@myrmidon/cadmus-mapping-builder';

@Component({
  selector: 'cadmus-mapping-tree',
  templateUrl: './mapping-tree.component.html',
  styleUrls: ['./mapping-tree.component.css'],
})
export class MappingTreeComponent {
  private _mapping?: NodeMapping;
  private _selected?: NodeMapping;

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

  @Output()
  public selectedChange: EventEmitter<NodeMapping>;

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
  }

  private updateTree(root?: NodeMapping | null) {
    this.selected = undefined;
    this.treeDataSource.data = root ? [root] : [];
  }

  public isSelected(node: NodeMapping): boolean {
    return this._selected === node;
  }

  public onNodeClick(node: NodeMapping): void {
    this._selected = node;
    this.selectedChange.emit(node);
  }
}
