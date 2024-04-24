import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { of } from 'rxjs';
import { TreeData } from 'src/app/models/tree.interface';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';

@Component({
  selector: 'app-monetization-prices-tree-view',
  templateUrl: './monetization-prices-tree-view.component.html',
  styleUrls: ['./monetization-prices-tree-view.component.scss']
})
export class MonetizationPricesTreeViewComponent implements OnInit {
  @Input('receive_data_from_parent') receive_data_from_parent: any;
  @Output() get_output_data = new EventEmitter<any>();
  constructor(
    private _apiService: ApiService,
    private _spinner:CustomSpinnerService
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
    console.log(this.receive_data_from_parent,'this.receive_data_from_parent')
    if (this.receive_data_from_parent != null) {

      this.select_all = false;
      this.is_select_all = false;
      if (this.receive_data_from_parent == 0) {

      } else {
        this._apiService.get_tree_view_based_on_above_selected_id(this.receive_data_from_parent).subscribe({
          next: (res) => {
            // console.log(res,'treeview');
            this.nestedDataSource.data = res.data;
            this.nestedTreeControl.dataNodes = res.data;
            this.nestedTreeControl.expandAll();
          }
        })
      }
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
    this.checklistSelection.clear(true);
    this.nestedDataSource.data.map((node) => {
      this.callRecursion(node)
    });
    this.tree_view_checkbox();
  }
  unselectAll() {
    this.checklistSelection.clear(true);
    this.nestedTreeControl.collapseAll();
    this.tree_view_checkbox();
  }
  total_count: any[] = [];
  selected_syllabus_id: any;
  tree_view_checkbox() {
    // console.log(this.receive_data_from_parent,this.checklistSelection.selected);
    const tree_view = this.checklistSelection.selected;
    let push_syllabus_id = [];
    for (let i = 0; i < tree_view.length; i++) {
      push_syllabus_id.push(tree_view[i].syllabus_id);
    }
    this.selected_syllabus_id = push_syllabus_id;
    let data: any = {
      subject_course_info: this.receive_data_from_parent,
      subject_ids: this.selected_syllabus_id
    }
    
    this.get_output_data.emit(data);
  }
  callRecursion(node: any) {
    this.checklistSelection.isSelected(node);
    this.total_count.push(node);
    this.todoLeafItemSelectionToggle(node);
    this.nestedTreeControl.expand(node);
    if (node.children) {
      node.children.forEach((childNode: any) => {
        this.callRecursion(childNode);
      });
    }
  }
  //
  masterToggle() {
    this.isAllSelected()
      ? this.checklistSelection.clear()
      : this.nestedTreeControl.dataNodes.forEach((row) => {
        let check = (node: any) => {
          for (let nod of node.children) {
            this.checklistSelection.select(nod)
            check(nod)
          }
        }
        check(row)
        this.checklistSelection.select(row)
      });
  }

  isAllSelected() {
    let count: number = 0
    this.nestedTreeControl.dataNodes.forEach((row) => {
      count += 1
      let check = (node: any) => {
        for (let nod of node.children) {
          count += 1
          check(nod)
        }
      }
      check(row)
    });
    let numSelected = this.checklistSelection.selected.length;
    return numSelected === count;
  }
}
