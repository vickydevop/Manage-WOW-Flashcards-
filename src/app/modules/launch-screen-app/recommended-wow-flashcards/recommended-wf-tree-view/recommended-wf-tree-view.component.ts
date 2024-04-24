import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { of } from 'rxjs';
import { TreeData } from 'src/app/models/tree.interface';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-recommended-wf-tree-view',
  templateUrl: './recommended-wf-tree-view.component.html',
  styleUrls: ['./recommended-wf-tree-view.component.scss']
})
export class RecommendedWfTreeViewComponent implements OnInit {
  @Input('receive_radio_button_value') receive_radio_button_value: any;
  constructor(
    private _apiService: ApiService
  ) {
    this.nestedTreeControl = new NestedTreeControl<TreeData>(
      this._getChildren
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  is_select_all: boolean = true;
  select_all: boolean = false;

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.receive_radio_button_value);
    if (this.receive_radio_button_value != null) {
      this.loadData();
    } else {
      this.nestedDataSource.data = [];
    }
  }
  loadData() {
    this._apiService.get_tree_view_based_on_above_selected_id(this.receive_radio_button_value[0]).subscribe({
      next: (res) => {
        // console.log(res,'treeview');
        if (res.data.length > 0) {
          this.nestedDataSource.data = res.data;
          this.nestedTreeControl.dataNodes = res.data;
          this.nestedTreeControl.expandAll();
          this.nestedDataSource.data.map((node) => {
            this.callRecursion(node)
          });
        } else {
          this.nestedDataSource.data = [];
        }
      }
    })
  }

  callRecursion(node: any) {
    for (let i = 0; i < this.receive_radio_button_value[1].syllabus_id.length; i++) {
      if (node.syllabus_id == this.receive_radio_button_value[1].syllabus_id[i]) {
        this.checklistSelection.isSelected(node);
        this.todoLeafItemSelectionToggle(node);
      }
    }
    if (node.children) {
      node.children.forEach((childNode: any) => {
        this.callRecursion(childNode);
      });
    }
  }
  // *---------------------------------Tree Structure--------------------------------------*//
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  checklistSelection = new SelectionModel<TreeData>(true /* multiple */);
  selected_category_val: any = [];

  private _getChildren = (node: TreeData) => of(node.children);
  // select_all: boolean = false;
  totalNodeCount: any;
  hasNestedChild = (_: string, nodeData: TreeData) =>
    nodeData.children.length > 0;

  refreshTreeData() {
    const data = this.nestedDataSource.data;
    this.nestedDataSource.data = [];
    this.nestedDataSource.data = data;
  }

  getLevel = (node: TreeData): any => node.level;

  isExpandable = (node: TreeData) => node.expandable;

  /* Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeData): boolean {
    const descendants = this.nestedTreeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }
  /* Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeData): boolean {
    const descendants = this.nestedTreeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /* Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeData): void {
    this.checklistSelection.toggle(node);
    const descendants = this.nestedTreeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every((child) => this.checklistSelection.isSelected(child));
    // this.checkAllParentsSelection(node);
    this.selected_category_val = this.checklistSelection.selected;
    if (this.selected_category_val.length == this.totalNodeCount - 1) {
      this.select_all = true;
    } else {
      this.select_all = false;
    }
  }

  /* Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: any): void {
    //
    this.checklistSelection.toggle(node);

    this.selected_category_val = this.checklistSelection.selected;
    if (this.selected_category_val.length > 0) {
      this.select_all = true;
    } else {
      this.select_all = false;
    }
    // this.checkAllParentsSelection(node);
  }
  checkRootNodeSelection(node: TreeData): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.nestedTreeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  selectAll() {

  }
  unselectAll() {
    this.checklistSelection.clear(true);
    this.nestedTreeControl.collapseAll();
  }
}
