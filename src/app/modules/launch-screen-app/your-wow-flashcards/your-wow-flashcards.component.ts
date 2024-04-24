import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { YourWfPopupResolveFlagsComponent } from './your-wf-popup-resolve-flags/your-wf-popup-resolve-flags.component';
import { YourWfPopupRecommendComponent } from './your-wf-popup-recommend/your-wf-popup-recommend.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { EditGlobalCourseComponent } from '../i-frame/edit-global-course/edit-global-course.component';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
import { AccessPopupComponent } from '../i-frame/access-popup/access-popup.component';
import { AssignToStudentsPopupComponent } from '../i-frame/assign-to-students-popup/assign-to-students-popup.component';
import { FormControl } from '@angular/forms';
import { AddEditFlashcardsDataComponent } from '../i-frame/add-edit-flashcards-data/add-edit-flashcards-data.component';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { HidePopupComponent } from './hide-popup/hide-popup.component';
import { GlobalCommentsPopupComponent } from '../i-frame/global-comments-popup/global-comments-popup.component';

@Component({
  selector: 'app-your-wow-flashcards',
  templateUrl: './your-wow-flashcards.component.html',
  styleUrls: ['./your-wow-flashcards.component.scss']
})
export class YourWowFlashcardsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _apiService: ApiService,
    private _spinner: CustomSpinnerService,
    private _snacBar: SnackBarService,
    private _dataShareService: DataSharingService
  ) { }
  select_relevant_syllabus:FormControl = new FormControl()
  decodedToken: any;
  syllabus_of_your_interest: any = [];
  is_access: boolean = true;
  is_add_new: boolean = true;
  is_view_edit: boolean = true;
  is_hide: boolean = true;
  is_assign_to_students: boolean = true;
  is_resolve_flags: boolean = true;
  is_recommend: boolean = true;
  is_list_of_course_subject: boolean = true;
  public token_for_edit_global_course:any;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    console.log(this.decodedToken,'decodedTokendecodedToken');
    this.gen_token_for_p1()
    this.load_relevant_data();
    this._dataShareService.updateAuditTrailData(1);
  }
  gen_token_for_p1() {
    let payload:any = {
      user_id:this.decodedToken.user?.user_id,
      customer_id:this.decodedToken.user?.customer_id,
      country_code:this.decodedToken.user?.country_code,
      customer_sub_domain_name:this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name:this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string:this.decodedToken.user?.time_zone_iana_string,
      app_name:this.decodedToken.user?.app_name,
      default_currency_shortform:this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id:this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years:this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month:this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id:this.decodedToken.user?.socket_id,
      user_category_type:this.decodedToken.user?.user_category_type,
      educational_institution_category_id:this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids:this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status:this.decodedToken.user?.user_registration_login_approval_status,
      country:this.decodedToken.user?.country,
      pin_code:this.decodedToken.user?.pin_code,
      state_province:this.decodedToken.user?.state_province,
      city_district_county:this.decodedToken.user?.city_district_county,
      address_line_1:this.decodedToken.user?.address_line_1,
      address_line_2:this.decodedToken.user?.address_line_2,
      customer_type:this.decodedToken.user?.customer_type,
      app_type:1
    }

    this._apiService.CreateTokenBasedOnResponse(payload).subscribe({
      next:(res)=>{
        // console.log(res,'token');
        if(res.data != null){
          this.token_for_edit_global_course = res.data;
        }
      }
    });
  }
  load_relevant_data(){
    this._spinner.open();
    this._apiService.relevant_syllabus_of_your_interest().subscribe({
      next: (res) => {
        this._spinner.close();
        if (res.data?.length > 0) {
          this.syllabus_of_your_interest = [{type:1}].concat(res.data.map((item:any)=>({...item,type:0})));
          this.select_the_relevant_syllabus_values = [{type:1}];
          // console.log(this.select_the_relevant_syllabus_values,'relevant_syllabus_of_your_interest');
          this.select_relevant_syllabus.patchValue(this.syllabus_of_your_interest[0]);
          // Set Value when All 
          this.is_view_hidden_component = true;
          this.is_add_new = true;
          this.is_tree_view_component_value = 1;
          this.is_tree_view_component = true;
          this.loadTable();
        } else {
          this._snacBar.success('Data Not Found');
        }
      },error:()=>{
        this._spinner.close();
      }
    })
  }
  // select_the_relevant_syllabus
  share_data_to_tree_view: any;
  is_tree_view_component: boolean = true;
  is_tree_view_component_value: number = 0;
  public select_the_relevant_syllabus_values:any;
  select_the_relevant_syllabus(_data: any) {
    this.select_the_relevant_syllabus_values =[_data];
    console.log(this.select_the_relevant_syllabus_values,'dd');
    this.dataSource.data = [];
    this.share_data_to_table_two = [];
    this.is_resolve_flags = true;
    this.is_access = true;
    this.is_add_new = true;
    this.is_view_edit = true;
    this.is_hide = true;
    this.is_assign_to_students = true;
    this.is_recommend = true;
    this.is_list_of_course_subject = true;
    this.is_view_hidden_wf = true;
    // console.log(_data,'select_the_relevant_syllabus');
    if (_data?.type == 1) {
      this.is_view_hidden_component = true;
      this.is_add_new = true;
      this.is_tree_view_component_value = 1;
      this.is_tree_view_component = true;
      this.loadTable();
      this.is_syllabus_of_your_interest = 1;
    } else {
      this.is_tree_view_component = false;
      this.is_tree_view_component_value = 0;
      this.share_data_to_tree_view = _data;
      this.is_syllabus_of_your_interest = 0;
      // console.log(this.share_data_to_tree_view,'share_data_to_tree_view')
    }
  }
  public is_syllabus_of_your_interest:number;
  loadTable() {
    this._spinner.open();
    this._apiService.GetAllWowFlashcards().subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res,'dsdsd');
        if (res.data.length > 0) {
          this.is_syllabus_of_your_interest = 1;
          const flashcardsData = res.data
            flashcardsData.sort((a:any,b:any)=>{
              const dateA:any = new Date(a.flashcards_edited_datetime);
              const dateB:any = new Date(b.flashcards_edited_datetime);
          
              return dateB - dateA;
            })
            this.dataSource.data = flashcardsData;
        } else {
          this.dataSource.data = [];
          this._snacBar.success('Data Not Found');
        }
      },error:()=>{
        this._spinner.close();
      }
    })
  }
  popup_resolve_flag_data: any;
  share_data_to_table_two: any;
  public assign_to_students_token:any;
  public access_token:any;
  public edit_flashcards_data_token:any;
  table_rad_btn(_data: any) {
    console.log(_data,'is_tree_view_component_value',this.is_tree_view_component_value);
    if(_data.is_hidden == 0){
      this.is_hide_value = 1;
      this.is_hide_text = 'Hide';
    }else{
      this.is_hide_value = 0;
      this.is_hide_text = 'UnHide';
    }
    console.log(this.is_hide_value,this.is_hide_text)
    if (this.is_tree_view_component_value == 1) {
      this.popup_resolve_flag_data = _data;
      this.is_list_of_course_subject = false;
      this.is_recommend = false;
      this.is_recommend = false;
      this.is_access = true;
      this.is_view_edit = false;
      // if(_data?.is_shared_globally == 1 || _data.global_wow_flashcards_id != null){
        if(_data?.is_shared_globally == 0){
        this.is_hide = false;
      }else if(_data.is_shared_globally == 1){
        this.is_hide = true;
      }
      this.is_assign_to_students = false;
      if (_data?.global_wow_flashcards_id != null && _data.no_of_total_flags != null) {
        this.is_resolve_flags = false;
      } else {
        this.is_resolve_flags = true;
      }
      this.share_data_to_table_two = [_data].concat({ syllabus_id: 'is_select_all' });
    } else {
      if(_data?.is_shared_globally == 0){
        this.is_hide = false;
      }else if(_data.is_shared_globally == 1){
        this.is_hide = true;
      }
      this.is_access = false;
      this.is_view_edit = false;
      this.is_assign_to_students = false;
      this.is_recommend = false;
      this.is_list_of_course_subject = false;
      if (_data?.global_wow_flashcards_id != null && _data.no_of_total_flags != null) {
        this.is_resolve_flags = false;
      } else {
        this.is_resolve_flags = true;
      }
      this.popup_resolve_flag_data = _data;
      // console.log(_data,'daa',this.selected_syllabus_id)
      this.share_data_to_table_two = [_data].concat({ syllabus_id: this.selected_syllabus_id });
      // console.log(this.share_data_to_table_two,'share_data_to_table_two')
    }

    let payload:any = {
      user_id:this.decodedToken.user?.user_id,
      customer_id:this.decodedToken.user?.customer_id,
      country_code:this.decodedToken.user?.country_code,
      customer_sub_domain_name:this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name:this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string:this.decodedToken.user?.time_zone_iana_string,
      app_name:this.decodedToken.user?.app_name,
      default_currency_shortform:this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id:this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years:this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month:this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id:this.decodedToken.user?.socket_id,
      user_category_type:this.decodedToken.user?.user_category_type,
      educational_institution_category_id:this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids:this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status:this.decodedToken.user?.user_registration_login_approval_status,
      country:this.decodedToken.user?.country,
      pin_code:this.decodedToken.user?.pin_code,
      state_province:this.decodedToken.user?.state_province,
      city_district_county:this.decodedToken.user?.city_district_county,
      address_line_1:this.decodedToken.user?.address_line_1,
      address_line_2:this.decodedToken.user?.address_line_2,
      customer_type:this.decodedToken.user?.customer_type,
      access:1,
      global_wow_flashcards_id:_data?.global_wow_flashcards_id,
      is_institutional_flashcards:_data?.is_shared_globally,
      institutional_wow_flashcards_id:_data?.institutional_wow_flashcards_id
    }

    this._apiService.CreateTokenBasedOnResponse(payload).subscribe({
      next:(res)=>{
        // console.log(res,'token');
        if(res.data != null){
          this.assign_to_students_token = res.data;
        }
      }
    });

    let flashcards_id_inst:any;
    let flashcards_id_glob:any;

    if(_data.global_wow_flashcards_id !=null){
      flashcards_id_glob = _data.global_wow_flashcards_id;
      flashcards_id_inst = null;
    }else{
      flashcards_id_inst = _data.institutional_wow_flashcards_id;
      flashcards_id_glob = null;
    }
    let payLoad:any = {
      user_id:this.decodedToken.user?.user_id,
      customer_id:this.decodedToken.user?.customer_id,
      country_code:this.decodedToken.user?.country_code,
      customer_sub_domain_name:this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name:this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string:this.decodedToken.user?.time_zone_iana_string,
      app_name:this.decodedToken.user?.app_name,
      default_currency_shortform:this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id:this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years:this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month:this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id:this.decodedToken.user?.socket_id,
      user_category_type:this.decodedToken.user?.user_category_type,
      educational_institution_category_id:this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids:this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status:this.decodedToken.user?.user_registration_login_approval_status,
      country:this.decodedToken.user?.country,
      pin_code:this.decodedToken.user?.pin_code,
      state_province:this.decodedToken.user?.state_province,
      city_district_county:this.decodedToken.user?.city_district_county,
      address_line_1:this.decodedToken.user?.address_line_1,
      address_line_2:this.decodedToken.user?.address_line_2,
      customer_type:this.decodedToken.user?.customer_type,
      global_wow_flashcards_id:flashcards_id_glob,
      institutional_wow_flashcards_id:flashcards_id_inst
    }

    this._apiService.CreateTokenBasedOnResponse(payLoad).subscribe({
      next:(res)=>{
        // console.log(res,'token');
        if(res.data != null){
          this.access_token = res.data;
        }
      }
    });
    let gen_token_edit:any = {
      user_id:this.decodedToken.user?.user_id,
      customer_id:this.decodedToken.user?.customer_id,
      country_code:this.decodedToken.user?.country_code,
      customer_sub_domain_name:this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name:this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string:this.decodedToken.user?.time_zone_iana_string,
      app_name:this.decodedToken.user?.app_name,
      default_currency_shortform:this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id:this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years:this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month:this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id:this.decodedToken.user?.socket_id,
      user_category_type:this.decodedToken.user?.user_category_type,
      educational_institution_category_id:this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids:this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status:this.decodedToken.user?.user_registration_login_approval_status,
      country:this.decodedToken.user?.country,
      pin_code:this.decodedToken.user?.pin_code,
      state_province:this.decodedToken.user?.state_province,
      city_district_county:this.decodedToken.user?.city_district_county,
      address_line_1:this.decodedToken.user?.address_line_1,
      address_line_2:this.decodedToken.user?.address_line_2,
      customer_type:this.decodedToken.user?.customer_type,
      access:1,
      institutional_wow_flashcards_id:_data?.institutional_wow_flashcards_id,
      global_wow_flashcards_id:_data?.global_wow_flashcards_id,
      institutional_course_subject_id:this.tree_view_data?.table_data?.receive_data_from_parent?.institutional_course_subject_id,
      global_course_subject_id:this.tree_view_data?.table_data.receive_data_from_parent?.global_course_subject_id,
      is_global:this.tree_view_data?.table_data?.receive_data_from_parent?.is_global,
      educational_institution_category_country_code:this.tree_view_data?.table_data?.receive_data_from_parent?.educational_institution_category_country_code,
      syllabus_ids:this.tree_view_data?.selected_syllabus_id,
    }

    this._apiService.CreateTokenBasedOnResponse(gen_token_edit).subscribe({
      next:(res)=>{
        // console.log(res,'token');
        if(res.data != null){
          this.edit_flashcards_data_token = res.data;
        }
      }
    });
  }
  // get_tree_view_data
  is_view_hidden_wf: boolean = true;
  is_view_hidden_component: boolean = true;
  selected_syllabus_id: any;
  tree_view_data: any;
  public add_new_flashcards_data_token:any;
  public is_view_checked:boolean = true;
  get_tree_view_data(_data: any) {
    // console.log(_data,'daa');
    if (_data?.selected_syllabus_id.length > 0) {
      this.is_view_checked = true;
      this.is_view_hidden_wf = false;
      this.is_view_hidden_component = false;
      this.tree_view_data = _data;
      this.loadData();
      this.is_add_new = false;
      // this.dataSource.data = _data?.table_data;
      this.selected_syllabus_id = _data?.selected_syllabus_id;
      let payload:any = {
        user_id:this.decodedToken.user?.user_id,
        customer_id:this.decodedToken.user?.customer_id,
        country_code:this.decodedToken.user?.country_code,
        customer_sub_domain_name:this.decodedToken.user?.customer_sub_domain_name,
        registered_educational_institution_name:this.decodedToken.user?.registered_educational_institution_name,
        time_zone_iana_string:this.decodedToken.user?.time_zone_iana_string,
        app_name:this.decodedToken.user?.app_name,
        default_currency_shortform:this.decodedToken.user?.default_currency_shortform,
        accounting_standards_id:this.decodedToken.user?.accounting_standards_id,
        is_default_academic_year_format_spanning_two_calendar_years:this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
        default_academic_year_start_date_and_month:this.decodedToken.user?.default_academic_year_start_date_and_month,
        socket_id:this.decodedToken.user?.socket_id,
        user_category_type:this.decodedToken.user?.user_category_type,
        educational_institution_category_id:this.decodedToken.user?.educational_institution_category_id,
        user_registered_categories_ids:this.decodedToken.user?.user_registered_categories_ids,
        user_registration_login_approval_status:this.decodedToken.user?.user_registration_login_approval_status,
        country:this.decodedToken.user?.country,
        pin_code:this.decodedToken.user?.pin_code,
        state_province:this.decodedToken.user?.state_province,
        city_district_county:this.decodedToken.user?.city_district_county,
        address_line_1:this.decodedToken.user?.address_line_1,
        address_line_2:this.decodedToken.user?.address_line_2,
        customer_type:this.decodedToken.user?.customer_type,
        access:0,
        institutional_course_subject_id:_data.table_data.receive_data_from_parent?.institutional_course_subject_id,
        global_course_subject_id:_data.table_data.receive_data_from_parent?.global_course_subject_id,
        is_global:_data.table_data.receive_data_from_parent?.is_global,
        educational_institution_category_country_code:_data.table_data.receive_data_from_parent?.educational_institution_category_country_code,
        syllabus_ids:_data?.selected_syllabus_id,
      }
  
      this._apiService.CreateTokenBasedOnResponse(payload).subscribe({
        next:(res)=>{
          // console.log(res,'token');
          if(res.data != null){
            this.add_new_flashcards_data_token = res.data;
          }
        }
      });
    } else {
      this.is_view_hidden_component = true;
      this.is_add_new = true;
      this.dataSource.data = [];
      this.share_data_to_table_two = [];
      this.is_resolve_flags = true;
      this.is_access = true;
      this.is_view_edit = true;
      this.is_hide = true;
      this.is_assign_to_students = true;
      this.is_recommend = true;
      this.is_list_of_course_subject = true;
      this.is_view_hidden_wf = true;
      this.is_view_checked = true;
    }
  }
  get_table_two_data(_data:any) {
    if(_data == true){
      if(this.is_syllabus_of_your_interest == 1){
        this.loadTable();
      }else{
        this.loadData();
      }
      this.is_list_of_course_subject = true;
      this.is_recommend = true;
      this.is_hide = true;
      this.is_assign_to_students = true;
      this.is_view_edit = true;
    }
  }
  loadData() {
    this._spinner.open();
    this._apiService.GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId(this.tree_view_data?.table_data).subscribe({
      next: (res) => {
        // console.log(res,'res');
        this._spinner.close();
        if (res.data.length > 0) {
          this.dataSource.data = res.data;
        } else {
          this.dataSource.data = [];
          this._snacBar.success('Data Not Found');
        }
      },error:()=>{
        this._spinner.close();
      }
    })
  }

  is_hide_text: string = 'Hide';
  is_hide_value: number = 1;
  check_box_based(_data: any) {
    // console.log('check_box_based',this.tree_view_data?.table_data);
    this.is_access = true;
    // this.is_add_new = true;
    this.is_view_edit = true;
    this.is_hide = true;
    this.is_assign_to_students = true;
    this.is_resolve_flags = true;
    this.is_recommend = true;
    this.is_list_of_course_subject = true;
    if (_data.checked == true) {
      this.is_hide_text = 'UnHide';
      this.is_hide_value = 0;
      this.dataSource.data = [];
      Object.defineProperty(this.tree_view_data.table_data?.receive_data_from_parent, 'is_get_or_update', {
        value: 0,
        enumerable: true
      })
      this.loadData2();
    } else {
      this.is_hide_text = 'Hide';
      this.is_hide_value = 1;
      this.loadData();
    }
  }

  loadData2() {
    this._spinner.open();
    this._apiService.GetHiddenWOWFlashcardsOrUpdateHide(this.tree_view_data?.table_data).subscribe({
      next: (res) => {
        // console.log(res,'this.tree_view_data?.table_data');
        if (res.data.length > 0) {
          this._spinner.close();
          this.dataSource.data = res.data;
        } else {
          this.dataSource.data = [];
          this._spinner.close();
          this._snacBar.success('Data Not Found');
        }
      },error:()=>{
        this._spinner.close();
      }
    })
  }
  hide_status() {
    let config: MatDialogConfig = {
      disableClose: true,
      maxWidth: '300px',
      minHeight: 'auto',
      data:this.is_hide_text
    };

    const dialogRef = this.dialog.open(HidePopupComponent, config);
    dialogRef.afterClosed().subscribe((res) => {
      // console.log(res);
      let data: any = {
        receive_data_from_parent: { 
          is_get_or_update: 1, 
          institutional_wow_flashcards_id: this.popup_resolve_flag_data.institutional_wow_flashcards_id, 
          is_hide_value: this.is_hide_value 
        },
      }
      if (res == 'true') {
        this._apiService.GetHiddenWOWFlashcardsOrUpdateHide(data).subscribe({
          next: (res) => {
            // console.log(res,'');
            if (res.statusCode == 200) {
              this.is_access = true;
              // this.is_add_new = true;
              this.is_view_edit = true;
              this.is_hide = true;
              this.is_assign_to_students = true;
              this.is_resolve_flags = true;
              this.is_recommend = true;
              this.is_list_of_course_subject = true;
              if (this.is_tree_view_component_value == 1) {
                this.loadTable();
              } else {
                if (this.is_hide_value == 0) {
                  this.loadData2();
                } else if (this.is_hide_value == 1) {
                  this.loadData();
                }
              }
              this._snacBar.success('Data Updated Successfully');
            }
          },error:()=>{
            this._spinner.close();
          }
        })
      }
    });

    // let data: any = {
    //   receive_data_from_parent: { is_get_or_update: 1, institutional_wow_flashcards_id: this.popup_resolve_flag_data.institutional_wow_flashcards_id, is_hide_value: this.is_hide_value },
    // }
    // this._apiService.GetHiddenWOWFlashcardsOrUpdateHide(data).subscribe({
    //   next: (res) => {
    //     // console.log(res,'');
    //     if (res.statusCode == 200) {
    //       this.is_access = true;
    //       // this.is_add_new = true;
    //       this.is_view_edit = true;
    //       this.is_hide = true;
    //       this.is_assign_to_students = true;
    //       this.is_resolve_flags = true;
    //       this.is_recommend = true;
    //       this.is_list_of_course_subject = true;
    //       if (this.is_tree_view_component_value == 1) {
    //         this.loadTable();
    //       } else {
    //         if (this.is_hide_value == 0) {
    //           this.loadData2();
    //         } else if (this.is_hide_value == 1) {
    //           this.loadData();
    //         }
    //       }
    //       this._snacBar.success('Data Updated Successfully');
    //     }
    //   },error:()=>{
    //     this._spinner.close();
    //   }
    // })
  }
  // tables
  displayedColumns: string[] = [
    'edited_date_time',
    'wow_flashcard_name',
    'collaborated_with',
    'global_command',
    'no_of_flags_pending'
  ];
  dataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  rowValue: any[] = [];
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // console.log(this.selection.selected);
    this.rowValue = this.selection.selected;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngDoCheck(): void {
    if (this.selection.selected.length <= 0) {
      this.rowValue = [];
    }
    // console.log(this.relevantSyllabusData,'relevantSyllabusData')
  }
  showPageSizeOptions: boolean = true;


  exportReport(fileName: any): void {
    /* pass here the table id */
    let element = document.getElementById('excel_table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  onPrint() {
    window.print();
  }

  onRowClicked(row: any) { }
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  public downloadAsPDF() {
    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);
    let {
      registered_educational_institution_name,
      city_district_county,
      state_province,
      pin_code,
      address_line_1,
      address_line_2,
      user_id,
      customer_id,
      country_code,
      customer_sub_domain_name
    } = this.decodedToken.user;
    let customer_logo = `${environment.ceph_URL}${country_code}-${customer_id}/${customer_sub_domain_name}-icon-144x144.png`;

    const htmlToPrint =
      '' +
      '<style type="text/css">' +
      '.pageFooter {' +
      '    display: table-footer-group;' +
      '    counter-increment: page;' +
      '}' +
      '.pageFooter:after {' +
      '   content: "Page " counter(page)' +
      '}' +
      '</style>';
    var printContents = document.getElementById('pdfTable')!.innerHTML;
    let popupWin: any = window.open(
      'Angular Large Table to pdf',
      '_blank',
      'width=768,height=auto'
    );

    popupWin.document.write(
      '<html><head>' +
      '<link rel="stylesheet" href="' +
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"/>' +
      '<style type="text/css">' +
      '.pageFooter {' +
      '    display: table-footer-group;' +
      '    counter-increment: page;' +
      '}' +
      '.pageFooter:after {' +
      '   content: "Page Number" counter(page)' +
      '}' +
      '.mat-table {' +
      ' width: 80% ' +
      '}' +
      '.mat-radio-button {' +
      'visibility:hidden;' +
      '}' +
      '</style>' +
      `</head>
  
      <body onload="window.print()">
      <style>
      input[type=checkbox]{
                  display:none
                 }
                .mat-column-details,th,td,img{
                  height: 50px;
                  width: 50px;
                  padding-left:10px;
                }
      .mat-column-select{display:none}
      </style>
  
        <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
        <img style="width:100px;height:100px" src="${customer_logo}"  onerror="this.src='https://getsterapps.getwow.education/assets/icons/logo.png'"  alt="app-logo" />
        <div style=" display: flex;flex-direction: column; width:100%">
          <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">${this.decodedToken?.user?.customer_sub_domain_name}</span>
          <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Your WOW FlashCards relevant to the syllabus</span>
          <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${this.paginator.length
      } ) ${this.filterValue.length >= 1
        ? `(Filtered by -" ${this.filterValue} ")`
        : ''
      } </span>
        </div>
        </div>
  
        ` +
      printContents +
      '</body>' +
      `
        <footer style="position: fixed; bottom: 0; width: 100%;">
        <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${this.decodedToken?.user?.address_line_1}, ${this.decodedToken?.user?.address_line_2}, </span>
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${this.decodedToken?.user?.city_district_county}, ${this.decodedToken?.user?.state_province} ${this.decodedToken?.user?.pin_code}</span>
        </div>
        </footer>
      ` +
      '</html>'
    );
    popupWin.document.close();
  }

  filterDisable: boolean = true;
  pageChanged(event: PageEvent) {
    // console.log(event, 'event',event.pageSize.toString() , this.paginator.length.toString())
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.loadData();

    if (event.pageSize.toString() == this.paginator.length.toString()) {
      this.filterDisable = false;
    } else {
      this.filterDisable = true;
    }
  }
  openUserProfile(user_id: number, customer_id: number, country_id: string) {
    let config: MatDialogConfig = {
      disableClose: true,
      minHeight: 'auto',
      minWidth: '320px',

      data: {
        user_id,
        customer_id,
        country_id,
      },
    };
    const dialogRef = this.dialog.open(UserProfileCardComponent, config);
  }
  // popup's 
  // view_resolve_flags popup 
  view_resolve_flags() {
    const dialog = this.dialog.open(YourWfPopupResolveFlagsComponent, {
      disableClose: true,
      width: '900px',
      data: this.popup_resolve_flag_data
    });

    dialog.afterClosed().subscribe((result) => {
      console.log(result,'rest')
      if (result == 1) {
        this.is_list_of_course_subject = true;
        this.is_recommend = true;
        this.is_hide = true;
        this.is_assign_to_students = true;
        this.is_view_edit = true;
        this.is_resolve_flags = true;
        if(this.is_tree_view_component_value = 1){
          this.loadTable();
        }else{
          this.loadData();
        }
      }
    })
  }

  // recommend_teaching_faculty popup
  recommend_teaching_faculty() {
    const dialog = this.dialog.open(YourWfPopupRecommendComponent, {
      disableClose: true,
      width: '600px',
      data: this.popup_resolve_flag_data
    })

    dialog.afterClosed().subscribe((result) => {
      if (result == 1) {
        console.log(this.syllabus_of_your_interest[0].type ,'p')
        if(this.is_syllabus_of_your_interest == 1){
          this.loadTable();
        }else{
          this.loadData();
        }
        this.is_list_of_course_subject = true;
        this.is_recommend = true;
        this.is_hide = true;
        this.is_assign_to_students = true;
        this.is_view_edit = true;
      }
    })
  }

  // i-frames 
  edit_global_course() {
    const dialogRef = this.dialog.open(EditGlobalCourseComponent, {
      disableClose: true,
      width: '700px',
      data: this.token_for_edit_global_course
    });

    dialogRef.afterClosed().subscribe((result) => { 
      if(result == "true"){
        this.dataSource.data = [];
        this.share_data_to_table_two = [];
        this.is_resolve_flags = true;
        this.is_access = true;
        this.is_add_new = true;
        this.is_view_edit = true;
        this.is_hide = true;
        this.is_assign_to_students = true;
        this.is_recommend = true;
        this.is_list_of_course_subject = true;
        this.is_view_hidden_wf = true;
        this.load_relevant_data();
      }
    })
  }

  assign_to_students_popup() {
    const dialogRef = this.dialog.open(AssignToStudentsPopupComponent, {
      disableClose: true,
      width: '700px',
      data: this.assign_to_students_token
    });

    dialogRef.afterClosed().subscribe((result) => { })
  }

  access_popup() {
    const dialogRef = this.dialog.open(AccessPopupComponent, {
      disableClose: true,
      width: '700px',
      data: this.access_token
    });

    dialogRef.afterClosed().subscribe((result) => { })
  }

  add_new_or_edit(_data:any) {
    let dialogRef :any
    if(_data == 0){
      dialogRef = this.dialog.open(AddEditFlashcardsDataComponent, {
        disableClose:true,
        width: '1150px',
        minWidth:'334px',
        data: this.add_new_flashcards_data_token
      });
    }else if(_data == 1){
      dialogRef = this.dialog.open(AddEditFlashcardsDataComponent, {
        disableClose:true,
        width: '1150px',
        minWidth:'334px',
        data: this.edit_flashcards_data_token
      });
    }
    dialogRef.afterClosed().subscribe((result:any) => {
      // console.log(result,'result');
      let check = [true,"true"].includes(result);
      // console.log(check,'checkkk',[true,"true"].includes(result))
      if(result == check){
        // this.is_add_new = true;
        this.share_data_to_table_two = [];
        this.is_resolve_flags = true;
        this.is_access = true;
        this.is_view_edit = true;
        this.is_hide = true;
        this.is_assign_to_students = true;
        this.is_recommend = true;
        this.is_list_of_course_subject = true;
        this.is_view_hidden_wf = false;
        if(this.is_syllabus_of_your_interest == 1){
          this.loadTable();
        }else{
          this.loadData();
        }
      }
     })

  }

  global_comments_popup(_data:any) {
    const dialogRef = this.dialog.open(GlobalCommentsPopupComponent, {
      disableClose: true,
      width: '700px',
      data: _data
    });

    dialogRef.afterClosed().subscribe((result) => { })

  }
  //ceph
  shw_ceph_img = (ev: any) => {
    return `${environment.ceph_URL}${this.decodedToken.user?.country_code}-${this.decodedToken.user?.customer_id}/${ev}`;
  }

  ngOnDestroy() {
    this._dataShareService.updateAuditTrailData(undefined);
    this._spinner.close();
  }
  
  //* --------------------------  Public methods  --------------------------*//
  get relevantSyllabusData() {
    return this.select_relevant_syllabus.value;
  }

}
