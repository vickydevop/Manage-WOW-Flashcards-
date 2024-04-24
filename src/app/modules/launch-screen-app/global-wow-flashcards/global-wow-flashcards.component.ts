import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { GlobalWfPopupRatingComponent } from './global-wf-popup-rating/global-wf-popup-rating.component';
import { GlobalWfPopupFlagComponent } from './global-wf-popup-flag/global-wf-popup-flag.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { EditGlobalCourseComponent } from '../i-frame/edit-global-course/edit-global-course.component';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { YourWfPopupRecommendComponent } from '../your-wow-flashcards/your-wf-popup-recommend/your-wf-popup-recommend.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { AccessPopupComponent } from '../i-frame/access-popup/access-popup.component';
import { AssignToStudentsPopupComponent } from '../i-frame/assign-to-students-popup/assign-to-students-popup.component';
import { FormControl } from '@angular/forms';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';

interface sort_by {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-global-wow-flashcards',
  templateUrl: './global-wow-flashcards.component.html',
  styleUrls: ['./global-wow-flashcards.component.scss']
})
export class GlobalWowFlashcardsComponent implements OnInit {

  sort_by: sort_by[] = [
    { value: '0', viewValue: 'FlashCards Globalized Date (Old to New)' },
    { value: '1', viewValue: 'FlashCards Globalized Date (New to Old)' },
    { value: '2', viewValue: 'Avg Global Rating (High to Low)' },
    { value: '3', viewValue: 'Your Rating (High to Low)' },
    { value: '4', viewValue: 'Total No of Global Users to whom this is assigned (High to Low)' },
    { value: '5', viewValue: 'Charges per User. (Low to High)' },
    { value: '6', viewValue: 'Charges per User. (High to Low)' },
  ];
  constructor(
    private _snackBar:SnackBarService,
    private dialog: MatDialog, 
    private _apiService: ApiService, 
    private _spinner:CustomSpinnerService,
    private _dataShareService: DataSharingService
    ) { }

  decodedToken: any;
  syllabus_of_your_interest: any = [];
  is_disabled_btn: boolean = true;
  public token_for_edit_global_course:any;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this.gen_token_for_p1();
    this.loadData();
    this._dataShareService.updateAuditTrailData(2);
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
  select_relevant_syllabus:FormControl = new FormControl();
  loadData() {
    this._spinner.open();
    this._apiService.relevant_syllabus_of_your_interest().subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res,'relevant_syllabus_of_your_interest');
        if (res.data?.length > 0) {
          let get_global_syllabus_only: any = [];
          res.data?.map((item: any) => {
            if (item.is_global == 1) {
              get_global_syllabus_only.push(item)
            }
          });
          this.syllabus_of_your_interest = get_global_syllabus_only;
          // this.syllabus_of_your_interest = [{type:1}].concat(res.data.map((item:any)=>({...item,type:0})));
          this.select_relevant_syllabus.patchValue(this.syllabus_of_your_interest[0]);
          console.log(this.syllabus_of_your_interest[0],'asasasa');
          this.is_disabled_btn = true;
          this.is_disabled_btn_user = true;
          this.dataSource.data = [];
          this.share_data_to_tree_view_global = this.syllabus_of_your_interest[0];
        }else{
          this._snackBar.success('Data Not Found');
        }
      },error:()=>{
        this._spinner.close();
      }
    })
  }
  // select_the_relevant_syllabus
  share_data_to_tree_view_global: any;
  select_the_relevant_syllabus(_data: any) {
    this.is_disabled_btn = true;
    this.dataSource.data = [];
    this.share_data_to_tree_view_global = _data;
    this.is_disabled_btn_user = true;
  }

  // get_table_data_from_tree
  table_data_from_tree:any;
  get_table_data_from_tree(_data: any) {
    this.table_data_from_tree = _data;
    // console.log(_data,this.table_data_from_tree?.global_table_data?.syllabus_id.length, 'data');
    this.loadData_table();
  }

  table_value:any;
  loadData_table(){
    if(this.table_data_from_tree?.global_table_data?.syllabus_id.length>0 ){
      this._spinner.open();
      this._apiService.GetTableDataBasedOnRelevantSyllabusAndSyllabusId(this.table_data_from_tree?.global_table_data).subscribe({
        next:(res)=>{
          this._spinner.close();
          if(res.data.length>0){
            const flashcardsData = res.data
            flashcardsData.sort((a:any,b:any)=>{
              const dateA:any = new Date(a.flashcards_edited_datetime);
              const dateB:any = new Date(b.flashcards_edited_datetime);
          
              return dateB - dateA;
            })
            this.dataSource.data = flashcardsData;
            this.table_value = res.data;
          }else{
            this.dataSource.data =[];
            this._snackBar.success('Data Not Found');
          }
          // console.log(res,'GetTableDataBasedOnRelevantSyllabusAndSyllabusId');
        },error:()=>{
        this._spinner.close();
        }
      })
      // this._spinner.close();
    }else{
      this.dataSource.data = [];
      this.is_disabled_btn = true;
      this.is_disabled_btn_user = true;
    }
  }
  avg_global_rating = {
    faculty_rating_value: '1',
    avg_global_teaching_faculty_rating(item: any) {
      this.faculty_rating_value = `${Math.round(item)}`;
    }
  }

  your_rating_value = {
    rating: '1',
    your_rating(item: any) {
      this.rating = `${Math.round(item)}`
    }
  }
  global_wow_flashcards_select_rad_btn_value: any;
  public assign_to_students_token:any;
  public access_token:any;
  public is_disabled_btn_user:boolean = true;
  global_wow_flashcards_table(_data: any) {
    this.is_disabled_btn = false;
    this.global_wow_flashcards_select_rad_btn_value = _data;
    console.log(_data, 'data');
    if(_data.flashcards_entry_creator_user_id == _data.user_id){
      this.is_disabled_btn_user = true;
    }else{
      this.is_disabled_btn_user = false;
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

    let flashcards_id_glob:any;
    let flashcards_id_inst:any;
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
  }

    //sort by
    sort_by_table(value: any) {
    console.log(value,this.table_value,'value');
    // FlashCards Globalized Date (Old to New)
    if (value.value == 0) {
      let datas: any = [];
      for (let i = 0; i < this.table_value.length; i++) {
        if (
          this.table_value[i].flashcards_edited_datetime <
          new Date().toISOString()
        ) {
          datas.push(this.table_value[i]);
        }
      }
      datas.sort((a: any) => {
        let currentDate: any = new Date() as any;
        let currentDate1: any = new Date(a.flashcards_edited_datetime) as any;
        return currentDate1 - currentDate;
      });
      this.dataSource.data = datas;
    }
    //FlashCards Globalized Date (New to Old)
    else if (value.value == 1) {
      let datas: any = [];
      for (let i = 0; i < this.table_value.length; i++) {
        if (
          this.table_value[i].flashcards_edited_datetime <
          new Date().toISOString()
        ) {
          datas.push(this.table_value[i]);
        }
      }
      datas.sort((a: any) => {
        let currentDate: any = new Date() as any;
        let currentDate1: any = new Date(a.flashcards_edited_datetime) as any;
        return currentDate - currentDate1;
      });
      this.dataSource.data = datas;
    }
     else if (value.value == 2) {
      let atoz = this.table_value.sort(
        (a: any, b: any) =>
          b.avg_global_teaching_faculty_rating -
          a.avg_global_teaching_faculty_rating
      );
      this.dataSource.data = atoz;
    } 
    else if (value.value == 3) {
      let atoz = this.table_value.sort(
        (a: any, b: any) =>
          a.your_rating -
          b.your_rating
      );
      this.dataSource.data = atoz;
    } 
    else if (value.value == 4) {
      let atoz = this.table_value.sort(
        (a: any, b: any) =>
          a.up_to_date_total_no_global_users_to_whom_this_is_assigned -
          b.up_to_date_total_no_global_users_to_whom_this_is_assigned
      );
      this.dataSource.data = atoz;
    } 
    else if (value.value == 5) {
      let atoz = this.table_value.sort(
        (a: any, b: any) =>
          a.one_time_subscription_cost_per_user_for_global_users -
          b.one_time_subscription_cost_per_user_for_global_users
      );
      this.dataSource.data = atoz;
    } else if (value.value == 6) {
      let atoz = this.table_value.sort(
        (a: any, b: any) =>
          b.one_time_subscription_cost_per_user_for_global_users -
          a.one_time_subscription_cost_per_user_for_global_users
      );
      this.dataSource.data = atoz;
    }
  }

  recommend_data() {
    console.log(this.global_wow_flashcards_select_rad_btn_value,'global_wow_flashcards_select_rad_btn_value');
    const dialog = this.dialog.open(YourWfPopupRecommendComponent,{
      width:'600px',
      data:this.global_wow_flashcards_select_rad_btn_value
    })

    dialog.afterClosed().subscribe((result)=>{
      
    })
  }
  // tables
  displayedColumns: string[] = [
    'wow_flashcards_name',
    'charges_per_user',
    'total_no_of_global_users',
    'avg_global_teaching_faculty_rating',
    'your_rating',
    'has_unresolved_flags'
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
      ' width: 90% ' +
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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of GLOBAL WOW FlashCards relevant to the syllabus</span>
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
  // popup's 

  your_rating() {
    const dialog = this.dialog.open(GlobalWfPopupRatingComponent, {
      disableClose: true,
      width: '600px',
      data: this.global_wow_flashcards_select_rad_btn_value
    })

    dialog.afterClosed().subscribe((result) => {
      // console.log(result, 'result');
      if (result == 1) {
        this.loadData_table();
        this.is_disabled_btn = true;
        this.is_disabled_btn_user = true;
      }
    })
  }


  flag_inappropriate_content() {
    const dialog = this.dialog.open(GlobalWfPopupFlagComponent, {
      disableClose: true,
      width: '700px',
      data:this.global_wow_flashcards_select_rad_btn_value
    })

    dialog.afterClosed().subscribe((result) => {
      if(result == 1){
        this.loadData_table();
        this.is_disabled_btn = true;
        this.is_disabled_btn_user = true;
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
      if(result == "true") {
        this.is_disabled_btn = true;
        this.is_disabled_btn_user = true;
        this.dataSource.data = [];
        this.share_data_to_tree_view_global = [];
        this.loadData();
      }
    })
  }

  assign_to_students_popup() {
    const dialogRef = this.dialog.open(AssignToStudentsPopupComponent, {
      disableClose: true,
      width: '700px',
      data: this.assign_to_students_token
    });

    dialogRef.afterClosed().subscribe((result) => {})
     
  }

  access_popup() {
    const dialogRef = this.dialog.open(AccessPopupComponent, {
      disableClose: true,
      width: '750px',
      data: this.access_token
    });

    dialogRef.afterClosed().subscribe((result) => { })
  }

  shw_ceph_img = (ev: any) => {
    return `${environment.ceph_URL}${this.decodedToken.user?.country_code}-${this.decodedToken.user?.customer_id}/${ev}`;
  }

  ngOnDestroy() {
    this._dataShareService.updateAuditTrailData(undefined);
    this._spinner.close();
  }
  
  get relevantSyllabusData() {
    return this.select_relevant_syllabus.value;
  }
}
