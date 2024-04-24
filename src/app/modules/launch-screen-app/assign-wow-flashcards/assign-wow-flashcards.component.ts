import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { YourWfPopupRecommendComponent } from '../your-wow-flashcards/your-wf-popup-recommend/your-wf-popup-recommend.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeletePopupComponent } from '../your-wow-flashcards/your-wow-fc-table-two/delete-popup/delete-popup.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { AccessPopupComponent } from '../i-frame/access-popup/access-popup.component';
import { AssignToStudentsPopupComponent } from '../i-frame/assign-to-students-popup/assign-to-students-popup.component';
import { FormControl } from '@angular/forms';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { AssignWowDeletePopupComponent } from './assign-wow-delete-popup/assign-wow-delete-popup.component';

@Component({
  selector: 'app-assign-wow-flashcards',
  templateUrl: './assign-wow-flashcards.component.html',
  styleUrls: ['./assign-wow-flashcards.component.scss']
})
export class AssignWowFlashcardsComponent implements OnInit {

  constructor(
    private _apiService: ApiService, 
    private _spinner: CustomSpinnerService, 
    private dialog: MatDialog, 
    private _dataShareService: DataSharingService,
    private _snackBar: SnackBarService,
    private _dataSharingService:DataSharingService
    ) { }

  decodedToken: any;
  syllabus_of_your_interest: any = [];
  public assign_to_students_token_new: any;
  select_relevant_syllabus: FormControl = new FormControl();
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this.loadData();
    this.assign_token();
    this._dataSharingService.updateAuditTrailData(3);
  }

  assign_token() {
    // token 
    let payload: any = {
      user_id: this.decodedToken.user?.user_id,
      customer_id: this.decodedToken.user?.customer_id,
      country_code: this.decodedToken.user?.country_code,
      customer_sub_domain_name: this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name: this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string: this.decodedToken.user?.time_zone_iana_string,
      app_name: this.decodedToken.user?.app_name,
      default_currency_shortform: this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id: this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years: this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month: this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id: this.decodedToken.user?.socket_id,
      user_category_type: this.decodedToken.user?.user_category_type,
      educational_institution_category_id: this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids: this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status: this.decodedToken.user?.user_registration_login_approval_status,
      country: this.decodedToken.user?.country,
      pin_code: this.decodedToken.user?.pin_code,
      state_province: this.decodedToken.user?.state_province,
      city_district_county: this.decodedToken.user?.city_district_county,
      address_line_1: this.decodedToken.user?.address_line_1,
      address_line_2: this.decodedToken.user?.address_line_2,
      customer_type: this.decodedToken.user?.customer_type,
      access: 0
    }

    this._apiService.CreateTokenBasedOnResponse(payload).subscribe({
      next: (res) => {
        // console.log(res,'token');
        if (res.data != null) {
          this.assign_to_students_token_new = res.data;
        }
      }
    });
  }
  public assign_to_students_token: any;
  loadData() {
    this._spinner.open();
    this._apiService.getUsersSubjectsCourseAssignedToYou().subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res, 'relevant_syllabus_of_your_interest');
        if (res.data?.data.length > 0) {
          // console.log(a,'asasasa');
          this.syllabus_of_your_interest = res.data?.data;
          this.select_relevant_syllabus.patchValue(this.syllabus_of_your_interest[0]);
          this.is_assign_new = false;
          this.is_disabled_btn = true;
          // console.log(_data,'select_the_relevant_syllabus');
          this.select_the_relevant_syllabus_value = this.syllabus_of_your_interest[0];
          this.LoadDataTable();
          this.select_the_relevant_syllabus_value = this.syllabus_of_your_interest[0];
          console.log(this.selected_rad_btn_values,'selected_rad_btn_values')

        } else {
          this._snackBar.success('Data Not Found');
        }
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  select_the_relevant_syllabus_value: any;
  is_assign_new: boolean = true;
  select_the_relevant_syllabus(_data: any) {
    this.is_assign_new = false;
    this.is_disabled_btn = true;
    // console.log(_data,'select_the_relevant_syllabus');
    this.select_the_relevant_syllabus_value = _data;
    this.LoadDataTable();
  }

  LoadDataTable() {
    this._spinner.open();
    this._apiService.GetTableDataBasedOnCourseSubjectUserCategoryAllocationId(this.select_the_relevant_syllabus_value.course_subject_user_category_allocation_id).subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res, 'ldnfofeofrweko');
        const flashcardsData = res.data
        flashcardsData.sort((a:any,b:any)=>{
          const dateA:any = new Date(a.wow_class_stream_event_datetime);
          const dateB:any = new Date(b.wow_class_stream_event_datetime);
      
          return dateB - dateA;
        })
        this.dataSource.data = flashcardsData;
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  is_disabled_btn: boolean = true;
  selected_rad_btn_values: any;
  public access_token: any;
  selected_rad_btn_value(_data: any) {
    console.log(_data, 'fjfjfjfjfjfjfjfjffj');
    this.selected_rad_btn_values = _data;
    this.is_disabled_btn = false;

    let payload: any = {
      user_id: this.decodedToken.user?.user_id,
      customer_id: this.decodedToken.user?.customer_id,
      country_code: this.decodedToken.user?.country_code,
      customer_sub_domain_name: this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name: this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string: this.decodedToken.user?.time_zone_iana_string,
      app_name: this.decodedToken.user?.app_name,
      default_currency_shortform: this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id: this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years: this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month: this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id: this.decodedToken.user?.socket_id,
      user_category_type: this.decodedToken.user?.user_category_type,
      educational_institution_category_id: this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids: this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status: this.decodedToken.user?.user_registration_login_approval_status,
      country: this.decodedToken.user?.country,
      pin_code: this.decodedToken.user?.pin_code,
      state_province: this.decodedToken.user?.state_province,
      city_district_county: this.decodedToken.user?.city_district_county,
      address_line_1: this.decodedToken.user?.address_line_1,
      address_line_2: this.decodedToken.user?.address_line_2,
      customer_type: this.decodedToken.user?.customer_type,
      access: 2,
      global_wow_flashcards_id: _data.global_wow_flashcards_id,
      is_institutional_flashcards: 0,
      data: {
        "course_subject_user_category_allocation_id": `${this.select_the_relevant_syllabus_value?.course_subject_user_category_allocation_id}`,
        "user_category_id": `${this.select_the_relevant_syllabus_value?.user_category_id}`,
        "term_semester_id": `${this.select_the_relevant_syllabus_value?.term_semester_id}`,
        "institutional_course_subject_id": `${this.select_the_relevant_syllabus_value?.institutional_course_subject_id}`,
        "global_course_subject_id": `${this.select_the_relevant_syllabus_value?.global_course_subject_id}`,
        "educational_institution_category_id": `${this.select_the_relevant_syllabus_value?.educational_institution_category_id}`,
        "educational_institution_category_country_code": `${this.select_the_relevant_syllabus_value?.educational_institution_category_country_code}`,
        "term_info": {
          "key": `${this.select_the_relevant_syllabus_value?.term_info?.key}`,
          "value": `${this.select_the_relevant_syllabus_value?.term_info?.value}`
        },
        "is_global": `${this.select_the_relevant_syllabus_value?.is_global}`,
        "course_subject_name": `${this.select_the_relevant_syllabus_value?.course_subject_name}`,
        "course_subject_type": `${this.select_the_relevant_syllabus_value?.course_subject_type}`,
        "educational_institution_category_name": `${this.select_the_relevant_syllabus_value?.educational_institution_category_name}`,
        "user_info": [
          {
            "user_category_name": `${this.select_the_relevant_syllabus_value?.user_info[0]?.user_category_name}`,
            "user_category_id": `${this.select_the_relevant_syllabus_value?.user_info[0]?.user_category_id}`
          }
        ],
        "for_academic_year_start": `${this.select_the_relevant_syllabus_value?.for_academic_year_start}`
      }
    }

    this._apiService.CreateTokenBasedOnResponse(payload).subscribe({
      next: (res) => {
        // console.log(res,'token');
        if (res.data != null) {
          this.assign_to_students_token = res.data;
        }
      }
    });

    let flashcards_id_inst: any;
    let flashcards_id_glob: any;
    if (_data.global_wow_flashcards_id != null) {
      flashcards_id_glob = _data.global_wow_flashcards_id;
      flashcards_id_inst = null;
    } else {
      flashcards_id_inst = _data.institutional_wow_flashcards_id;
      flashcards_id_glob = null;
    }
    let payLoad: any = {
      user_id: this.decodedToken.user?.user_id,
      customer_id: this.decodedToken.user?.customer_id,
      country_code: this.decodedToken.user?.country_code,
      customer_sub_domain_name: this.decodedToken.user?.customer_sub_domain_name,
      registered_educational_institution_name: this.decodedToken.user?.registered_educational_institution_name,
      time_zone_iana_string: this.decodedToken.user?.time_zone_iana_string,
      app_name: this.decodedToken.user?.app_name,
      default_currency_shortform: this.decodedToken.user?.default_currency_shortform,
      accounting_standards_id: this.decodedToken.user?.accounting_standards_id,
      is_default_academic_year_format_spanning_two_calendar_years: this.decodedToken.user?.is_default_academic_year_format_spanning_two_calendar_years,
      default_academic_year_start_date_and_month: this.decodedToken.user?.default_academic_year_start_date_and_month,
      socket_id: this.decodedToken.user?.socket_id,
      user_category_type: this.decodedToken.user?.user_category_type,
      educational_institution_category_id: this.decodedToken.user?.educational_institution_category_id,
      user_registered_categories_ids: this.decodedToken.user?.user_registered_categories_ids,
      user_registration_login_approval_status: this.decodedToken.user?.user_registration_login_approval_status,
      country: this.decodedToken.user?.country,
      pin_code: this.decodedToken.user?.pin_code,
      state_province: this.decodedToken.user?.state_province,
      city_district_county: this.decodedToken.user?.city_district_county,
      address_line_1: this.decodedToken.user?.address_line_1,
      address_line_2: this.decodedToken.user?.address_line_2,
      customer_type: this.decodedToken.user?.customer_type,
      global_wow_flashcards_id: flashcards_id_glob,
      institutional_wow_flashcards_id: flashcards_id_inst
    }

    this._apiService.CreateTokenBasedOnResponse(payLoad).subscribe({
      next: (res) => {
        // console.log(res,'token');
        if (res.data != null) {
          this.access_token = res.data;
        }
      }
    });
  }

  remove_data_From_table() {
    let text:any;
    if(this.selected_rad_btn_values?.is_removed == 0){
      text = 'Remove';
    }else if(this.selected_rad_btn_values?.is_removed == 1){
      text = 'Restore';
    }
    let config: MatDialogConfig = {
      disableClose: true,
      maxWidth: '300px',
      minHeight: 'auto',
      data:text
    };

    const dialogRef = this.dialog.open(AssignWowDeletePopupComponent, config);
    dialogRef.afterClosed().subscribe((res) => {
      // console.log(res,'delete');
      if (res == 'true') {
        this._apiService.UpdateSelectedAllocationIdField(this.select_the_relevant_syllabus_value?.course_subject_user_category_allocation_id, this.selected_rad_btn_values.wow_class_stream_reference_id, this.selected_rad_btn_values?.is_removed).subscribe({
          next: (res) => {
            // console.log(res,'UpdateSelectedAllocationIdField');
            if (res.statusCode == 200) {
              this.is_disabled_btn = true;
              this.LoadDataTable();
              this._snackBar.success('Data Saved Successfully');
            } else {
              this._snackBar.error('Error While Saving Data');
            }
          }
        })
      }
    });
  }

  // tables
  displayedColumns: string[] = [
    'assigned_on_date_time',
    'wow_flashcards',
    'is_this_from_global_wow_flashcards',
    'is_removed_from_class_stream'
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
              <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of WOW FlashCards Assigned to the above Student User Categories</span>
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
  // recommend_teaching_faculty popup
  recommend_teaching_faculty() {
    const dialog = this.dialog.open(YourWfPopupRecommendComponent, {
      disableClose: true,
      width: '600px',
      data: this.selected_rad_btn_values
    })

    dialog.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.LoadDataTable();
        this.is_disabled_btn = true;
      }
    })
  }

  assign_to_students_popup(_data: any) {
    // console.log(_data,'dd');
    if (_data == 0) {
      const dialogRef = this.dialog.open(AssignToStudentsPopupComponent, {
      disableClose: true,
        width: '700px',
        data: this.assign_to_students_token_new
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result == "true"){
          this.is_disabled_btn = true;
          this.LoadDataTable();
        }
       })
    } else if (_data == 1) {
      const dialogRef = this.dialog.open(AssignToStudentsPopupComponent, {
      disableClose: true,
        width: '700px',
        data: this.assign_to_students_token
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result == "true"){
          this.is_disabled_btn = true;
          this.LoadDataTable();
        }
       })
    }
  }

  access_popup() {
    const dialogRef = this.dialog.open(AccessPopupComponent, {
      disableClose: true,
      width: '700px',
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
