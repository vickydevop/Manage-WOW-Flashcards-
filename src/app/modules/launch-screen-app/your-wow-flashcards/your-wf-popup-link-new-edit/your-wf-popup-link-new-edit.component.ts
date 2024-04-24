import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { of } from 'rxjs';
import { TreeData } from 'src/app/models/tree.interface';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { EditGlobalCourseComponent } from '../../i-frame/edit-global-course/edit-global-course.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-your-wf-popup-link-new-edit',
  templateUrl: './your-wf-popup-link-new-edit.component.html',
  styleUrls: ['./your-wf-popup-link-new-edit.component.scss']
})
export class YourWfPopupLinkNewEditComponent implements OnInit {
  relevant_syllabus_of_your_interest_from: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _snackBar: SnackBarService,
    public _dialogRef: MatDialogRef<YourWfPopupLinkNewEditComponent>,
    private _apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.relevant_syllabus_of_your_interest_from = this.formBuilder.group({
      relevant_syllabus: ['', Validators.required]
    })
    this.nestedTreeControl = new NestedTreeControl<TreeData>(
      this._getChildren
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  is_select_all: boolean = true;
  select_all: boolean = false;
  syllabus_of_your_interest: any = [];
  ngOnInit(): void {
    console.log(this.data[0], 'ListOfLinedSyllabusLinkNewRelevantSyllabus');
    if (this.data[0]?.is_btn == 0) {
      this._apiService.ListOfLinedSyllabusLinkNewRelevantSyllabus(this.data[0]?.data[0]?.institutional_wow_flashcards_id).subscribe({
        next: (res) => {
          // console.log(res,'relevant_syllabus_of_your_interest');
          if (res.data?.length > 0) {
            this.syllabus_of_your_interest = res.data;
          }
        }
      })
    } else if (this.data[0]?.is_btn == 1) {
      this.syllabus_of_your_interest = this.data[0]?.ListOfLinkedSyllabusEditdata?.relevant_syllabus;
      // console.log('syllabus_of_your_interest', this.syllabus_of_your_interest);
      this.selected_syllabus_id = this.data[0]?.ListOfLinkedSyllabusEditdata?.syllabus_ids;
      this.relevant_syllabus_of_your_interest_from.get('relevant_syllabus').disable();
      let course_subject_id: any;
      let slt:any;
      if (this.data[0]?.selected_table_value?.is_global == 1) {
        course_subject_id = this.data[0]?.selected_table_value?.global_course_subject_id;
        slt = `{is_global:${this.data[0]?.selected_table_value?.is_global},global_course_subject_id:${course_subject_id},educational_institution_category_country_code:${this.data[0]?.selected_table_value?.educational_institution_category_country_code},educational_institution_category_id:${this.data[0]?.selected_table_value?.educational_institution_category_id}}`;
      } else if (this.data[0]?.selected_table_value?.is_global == 0) {
        course_subject_id = this.data[0]?.selected_table_value?.institutional_course_subject_id;
        slt = `{is_global:${this.data[0]?.selected_table_value?.is_global},institutional_course_subject_id:${course_subject_id},educational_institution_category_country_code:${this.data[0]?.selected_table_value?.educational_institution_category_country_code},educational_institution_category_id:${this.data[0]?.selected_table_value?.educational_institution_category_id}}`;
      }
      // console.log(slt,'sltslt');
      this.relevant_syllabus_of_your_interest_from.get('relevant_syllabus').patchValue(slt)
      this._apiService.get_tree_view_based_on_above_selected_id(this.data[0]?.ListOfLinkedSyllabusEditdata?.relevant_syllabus[0]).subscribe({
        next: (res) => {
          if (res.data.length > 0) {
            // console.log(res.data, 'treeview');
            this.nestedDataSource.data = res.data;
            this.nestedTreeControl.dataNodes = res.data;
            this.checkSelection();
          }
        }
      })
      this.is_save = false;
    }
  }
  set_edit_value = (_data: any) => {
    // console.log(_data,'adat');
    this.selected_value = _data;
    let { is_global, global_course_subject_id, institutional_course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = _data
    if (_data.is_global == true) {
      return `{is_global:${is_global},global_course_subject_id:${global_course_subject_id},educational_institution_category_country_code:${educational_institution_category_country_code},educational_institution_category_id:${educational_institution_category_id}}`
    } else {
      return `{is_global:${is_global},institutional_course_subject_id:${institutional_course_subject_id},educational_institution_category_country_code:${educational_institution_category_country_code},educational_institution_category_id:${educational_institution_category_id}}`
    }
  }

  checkSelection() {
    if (this.nestedDataSource.data.length > 0) {
      this.nestedDataSource.data.forEach((node: any) => {
        this.checkSelection1(node);
      });
      this.nestedTreeControl.expandAll();
    }
  }


  checkSelection1(node: any) {
    if (node.children) {
      node.children.forEach((childNode: any) => {
        this.checkSelection1(childNode);
      });
    }
    let checkNodeExist = this.data[0]?.ListOfLinkedSyllabusEditdata?.syllabus_ids.find((e: any) => {
      // console.log(node.syllabus_id,'node.syllabus_id',e)
      return (
        e ===
        node.syllabus_id
      );
    });
    if (checkNodeExist) {
      this.checklistSelection.toggle(node);
    }
  }

  selected_value: any;
  select_the_relevant_syllabus(_data: any) {
    // console.log(_data);
    this.selected_value = _data;
    this.checklistSelection.clear();
    // console.log(_data, 'adad');
    if (_data != null) {
      this._apiService.get_tree_view_based_on_above_selected_id(_data).subscribe({
        next: (res) => {
          // console.log(res,'treeview');
          this.nestedDataSource.data = res.data;
        }
      })
    }
  }
  selected_syllabus_id: any;
  is_save: boolean = true;
  tree_view_checkbox() {
    const tree_view = this.checklistSelection.selected;
    let push_syllabus_id = [];
    for (let i = 0; i < tree_view.length; i++) {
      push_syllabus_id.push(tree_view[i].syllabus_id);
    }
    this.selected_syllabus_id = push_syllabus_id;
    console.log(this.selected_syllabus_id,'sdadfd');
    if (tree_view.length > 0) {
      this.is_save = false;
    } else {
      this.is_save = true;
    }
  }

  save_btn() {
    let data:any;
    if(this.data[0]?.is_btn == 0){
        data = {
        is_insert_or_update: this.data[0]?.is_btn,
        institutional_wow_flashcards_id: this.data[0]?.data[0]?.institutional_wow_flashcards_id,
        global_course_subject_id: this.selected_value?.global_course_subject_id,
        institutional_course_subject_id: this.selected_value?.institutional_course_subject_id,
        is_global: this.selected_value?.is_global,
        educational_institution_category_country_code: this.selected_value?.educational_institution_category_country_code,
        educational_institution_category_id: this.selected_value?.educational_institution_category_id,
        is_shared_globally: 0,
        syllabus_id: this.selected_syllabus_id,
      }
    }else if(this.data[0]?.is_btn == 1){
      data = {
        is_insert_or_update: this.data[0]?.is_btn,
        institutional_wow_flashcards_id: this.data[0]?.data[0]?.institutional_wow_flashcards_id,
        global_course_subject_id: this.data[0]?.selected_table_value?.global_course_subject_id,
        institutional_course_subject_id: this.data[0]?.selected_table_value?.institutional_course_subject_id,
        is_global: this.data[0]?.selected_table_value?.is_global,
        educational_institution_category_country_code: this.data[0]?.selected_table_value?.educational_institution_category_country_code,
        educational_institution_category_id: this.data[0]?.selected_table_value?.educational_institution_category_id,
        is_shared_globally: this.data[0]?.selected_table_value?.is_shared_globally,
        syllabus_id: this.selected_syllabus_id,
      }
    }
    // console.log(data,'dads');
    this._apiService.ListOfLinkedSyllabusAddAndUpdate(data).subscribe({
      next: () => {
        this._dialogRef.close({ data: 1 });
        this._snackBar.success('Data Saved Successfully');
      },error:() =>{
        this._snackBar.error('Error While Saving Data');
      }
    })
  }

  Onclick() {
    this._dialogRef.close()
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
  callRecursion(node: any) {
    this.checklistSelection.isSelected(node);
    // this.total_count.push(node);
    this.todoLeafItemSelectionToggle(node);
    this.nestedTreeControl.expand(node);
    if (node.children) {
      node.children.forEach((childNode: any) => {
        this.callRecursion(childNode);
      });
    }
  }

  // i-frames 
  edit_global_course() {
    const dialogRef = this.dialog.open(EditGlobalCourseComponent, {
      width: '700px',
      data: {
        'access-token': sessionStorage.getItem('access_token')
      },
    });

    dialogRef.afterClosed().subscribe((result) => { })
  }
}
