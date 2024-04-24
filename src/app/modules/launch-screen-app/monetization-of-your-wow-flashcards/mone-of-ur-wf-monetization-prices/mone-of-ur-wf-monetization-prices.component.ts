import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { PopupMoneMonetizationComponent } from './popup-mone-monetization/popup-mone-monetization.component';
import { PopupMoneEarningDetailsComponent } from './popup-mone-earning-details/popup-mone-earning-details.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
import { FormControl } from '@angular/forms';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { SuspendMonetizationPopupComponent } from './suspend-monetization-popup/suspend-monetization-popup.component';

@Component({
  selector: 'app-mone-of-ur-wf-monetization-prices',
  templateUrl: './mone-of-ur-wf-monetization-prices.component.html',
  styleUrls: ['./mone-of-ur-wf-monetization-prices.component.scss']
})
export class MoneOfUrWfMonetizationPricesComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _apiService: ApiService,
    private _spinner: CustomSpinnerService,
    private _snackBar: SnackBarService,
    private _dataShareService: DataSharingService
  ) { }
  syllabus_of_your_interest: any = [];
  decodedToken: any;
  select_relevant_syllabus: FormControl = new FormControl();
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this._dataShareService.updateAuditTrailData(4);
    this._spinner.open();
    this._apiService.relevant_syllabus_of_your_interest().subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res,'relevant_syllabus_of_your_interest');
        if (res.data?.length > 0) {
          this.syllabus_of_your_interest = res.data;
          this.syllabus_of_your_interest = [{ type: 1 }].concat(res.data.map((item: any) => ({ ...item, type: 0 })));
          this.select_relevant_syllabus.patchValue(this.syllabus_of_your_interest[0]);
          this.is_tree_view_component = true;
          this.is_tree_view_component_value = 1;
          this.loadTable();
        } else {
          this._spinner.close();
          this._snackBar.success('Data Not Found');
        }
      }
    })
  }
  share_data_to_tree_view: any;
  is_tree_view_component: boolean = true;
  is_tree_view_component_value: number = 0;
  select_the_relevant_syllabus(_data: any) {
    this.is_disabled_btn = true;
    this.is_disabled_btn_check = true;
    this.is_disabled_btn_history = true;
    this.dataSource.data = [];
    this.is_list_of_course_subject = true;
    if (_data.type == 1) {
      this.is_tree_view_component = true;
      this.is_tree_view_component_value = 1;
      this.loadTable();
    } else {
      this.is_tree_view_component_value = 0;
      this.is_tree_view_component = false;
      this.share_data_to_tree_view = _data;
      // console.log(this.share_data_to_tree_view,'share_data_to_tree_view')
    }
  }
  loadTable() {
    this._spinner.open();
    this._apiService.GetAllMonetizationOfYourWowFlashcards().subscribe({
      next: (res) => {
        // console.log(res,'dsdsd');
        if (res.data.length > 0) {
          this._spinner.close();
          const flashcardsData = res.data
          flashcardsData.sort((a:any,b:any)=>{
            const dateA:any = new Date(a.flashcards_edited_datetime);
            const dateB:any = new Date(b.flashcards_edited_datetime);
        
            return dateB - dateA;
          })
          this.dataSource.data = flashcardsData;
        } else {
          this._spinner.close();
          this.dataSource.data = [];
          this._snackBar.success('Data Not Found');
        }
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  // get_tree_view_data 
  is_disabled_btn: boolean = true;
  selected_syllabus_id: any;
  is_list_of_course_subject: boolean = true;
  get_tree_view_data_values: any;
  get_tree_view_data(_data: any) {
    // console.log(_data, 'get_tree_view_data');
    this.get_tree_view_data_values = _data;
    // console.log(this.get_tree_view_data_values,'this.get_tree_view_data_values')
    if (this.get_tree_view_data_values?.subject_ids.length > 0) {
      this.loadTableData();
      this.selected_syllabus_id = this.get_tree_view_data_values?.selected_syllabus_id;
    } else {
      this.is_disabled_btn_history = true;
      this.dataSource.data = [];
      this.is_disabled_btn = true;
      this.is_disabled_btn_check = true;
      this.is_list_of_course_subject = true;
    }
  }

  loadTableData() {
    this._spinner.open();
    let data: any = {
      subject_course_info: this.get_tree_view_data_values?.subject_course_info,
      subject_ids: this.get_tree_view_data_values?.subject_ids
    }
    this._apiService.Get_Monetization_Of_Your_Wow_flashcards_List_Based_On_Subject_Ids(data).subscribe({
      next: (res) => {
        // console.log(res,'res');
        if (res.data?.data.length>0) {
          this._spinner.close();
          const flashcardsData = res.data.data;
          flashcardsData.sort((a:any,b:any)=>{
            const dateA:any = new Date(a.flashcards_edited_datetime);
            const dateB:any = new Date(b.flashcards_edited_datetime);
        
            return dateB - dateA;
          })
          this.dataSource.data = flashcardsData;
        } else {
          this._spinner.close();
          this._snackBar.success('Data Not Found')
        }
        // console.log(flattenedData,'flattenedData');
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  share_data_to_table_two: any;
  selected_rad_btn_value: any;
  is_disabled_btn_check: boolean = true;
  public is_disabled_btn_history: boolean = true;
  selected_rad_btn(_data: any) {
    this.is_disabled_btn_history = false;
    if (this.is_tree_view_component_value == 1) {
      this.share_data_to_table_two = [_data].concat({ syllabus_id: 'is_select_all' });
    } else {
      this.share_data_to_table_two = [_data].concat({ syllabus_id: this.selected_syllabus_id });
    }
    console.log(_data,'selected_rad_btn');
    if (
      _data?.monetization_info?.one_time_subscription_cost_per_user_for_global_users === null &&
      _data?.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users === null) {
      this.is_disabled_btn = false;
    } else if(_data?.monetization_info == null) {
      this.is_disabled_btn = false;
    }else if(_data?.monetization_info?.one_time_subscription_cost_per_user_for_global_users === null ||
      _data?.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users === null){
      this.is_disabled_btn = true;
      }else if(_data?.monetization_info?.one_time_subscription_cost_per_user_for_global_users != null &&
        _data?.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users != null){
        this.is_disabled_btn = true;
        }
    this.selected_rad_btn_value = _data;
    this.is_list_of_course_subject = false;
    if (![undefined, null, 'undefined', 'null'].includes(_data.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users) || ![undefined, null, 'undefined', 'null'].includes(_data.monetization_info?.one_time_subscription_cost_per_user_for_global_users)) {
      this.is_disabled_btn_check = false;
    } else {
      this.is_disabled_btn_check = true;
    }
  }

  suspend_monetization() {
    let config: MatDialogConfig = {
      disableClose: true,
      maxWidth: '300px',
      minHeight: 'auto',
    };

    const dialogRef = this.dialog.open(SuspendMonetizationPopupComponent, config);
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'true') {
        let values: any = {
          is_type: 2,
          institutional_wow_flashcards_id: this.selected_rad_btn_value?.institutional_wow_flashcards_id,
          global_wow_flashcards_id: this.selected_rad_btn_value?.global_wow_flashcards_id,
          wow_flashcards_name: this.selected_rad_btn_value?.wow_flashcards_name,
          effective_from_datetime: this.selected_rad_btn_value?.monetization_info?.effective_from_datetime
        }
        // console.log(values,'values');
        this._apiService.InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(values).subscribe({
          next: (res) => {
            // console.log(res,'InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices');
            if (res.statusCode == 201) {
              this.dataSource.data = [];
              this.is_list_of_course_subject = true;
              this.is_disabled_btn = true;
              this.is_disabled_btn_check = true;
              this.is_disabled_btn_history = true;
              if (this.is_tree_view_component_value == 1) {
                this.loadTable();
              } else {
                this.loadTableData();
              }
              this._snackBar.success('Data Suspend Successfully');
            } else {
              this._snackBar.error('Error While Suspending Data');
            }
          }, error: () => {
            this._spinner.close();
          }
        })
      }
    })
  }
  // tables
  displayedColumns: string[] = [
    'effective_from_date_time',
    'wow_flashcards',
    'monetization_from_your_edu',
    'Monetization_from_global_users',
    'shared_with_collaborators'
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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Monetization Prices of your WOW FlashCards</span>
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
  monetize_and_edit_monetize(_data: any) {
    console.log(_data, 'btn')
    const dialog = this.dialog.open(PopupMoneMonetizationComponent, {
      disableClose: true,
      width: '700px',
      data: { rad_btn_value: this.selected_rad_btn_value, type: _data }
    })
    dialog.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.is_list_of_course_subject = true;
        this.is_disabled_btn = true;
        this.is_disabled_btn_check = true;
        this.is_disabled_btn_history = true;
        if (this.is_tree_view_component_value == 1) {
          this.loadTable();
        } else {
          this.loadTableData();
        }
      }
    })
  }

  earning_details() {
    const dialog = this.dialog.open(PopupMoneEarningDetailsComponent, {
      disableClose: true,
      width: '550px',
      data: this.selected_rad_btn_value
    })
    dialog.afterClosed().subscribe((result) => {

    })
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
