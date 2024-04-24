import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { PopupMoneEarningHistoryComponent } from './popup-mone-earning-history/popup-mone-earning-history.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
import { FormControl } from '@angular/forms';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-mone-of-ur-wf-earning-details',
  templateUrl: './mone-of-ur-wf-earning-details.component.html',
  styleUrls: ['./mone-of-ur-wf-earning-details.component.scss']
})
export class MoneOfUrWfEarningDetailsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _apiService: ApiService,
    private _spinner: CustomSpinnerService,
    private _snackBar: SnackBarService,
    private _dataShareService: DataSharingService
  ) { }

  decodedToken: any;
  syllabus_of_your_interest: any = [];
  public select_relevant_syllabus: FormControl = new FormControl();
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this.loadData();
    this._dataShareService.updateAuditTrailData(4);
  }

  loadData() {
    this._spinner.open();
    this._apiService.relevant_syllabus_of_your_interest().subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res,'relevant_syllabus_of_your_interest');
        if (res.data?.length > 0) {
          this.syllabus_of_your_interest = res.data;
          this.syllabus_of_your_interest = [{ type: 1 }].concat(res.data.map((item: any) => ({ ...item, type: 0 })))
          this.select_relevant_syllabus.patchValue(this.syllabus_of_your_interest[0]);
          this.is_tree_view_component = true;
          this.loadTable();
          this.is_tree_view_component_value = 1;
        } else {
          this._snackBar.success('Data Not Found')
        }
      }, error: () => {
        this._spinner.close();
      }
    })
  }

  share_data_to_tree_view: any;
  is_tree_view_component: boolean = true;
  is_tree_view_component_value: number = 0;
  select_the_relevant_syllabus(_data: any) {
    this.is_view_details = true;
    this.dataSource.data = [];
    this.is_list_of_course_subject = true;
    if (_data.type == 1) {
      this.is_tree_view_component = true;
      this.loadTable();
      this.is_tree_view_component_value = 1;
    } else {
      this.is_tree_view_component = false;
      this.share_data_to_tree_view = _data;
      this.is_tree_view_component_value = 0;
      // console.log(this.share_data_to_tree_view,'share_data_to_tree_view')
    }
  }
  public tds_percentage:any;
  loadTable() {
    this._spinner.open();
    this._apiService.GetAllEarningDetailsOfGlobalWowFlashcards().subscribe({
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
          this.total_upto_date_earnings_currency = this.dataSource.data[0]?.monetization_earning_info?.earning_currency;
          const totalSharedSplitEarningAmount = this.dataSource.data.reduce(
            (total:any, flashcard:any) =>
              total +
              parseFloat(
                flashcard.monetization_earning_info
                  ? flashcard.monetization_earning_info.total_shared_split_earning_amount
                  : 0
              ),
            0
          );
          // console.log(totalSharedSplitEarningAmount,'totalSharedSplitEarningAmount');
          this.total_upto_date_earnings = totalSharedSplitEarningAmount;
          this.tds_percentage = res.data[0]?.tds_percentage;
        } else {
          this._spinner.close();
          this.dataSource.data = [];
          this._snackBar.success('Data Not Found');
        }
      }, error: () => {
        this.total_upto_date_earnings = null;
        this.total_upto_date_earnings_currency = null;
        this._spinner.close();
      }
    })
  }

  get_tree_view_data_values: any;
  selected_syllabus_id: any;
  get_tree_view_data(_data: any) {
    // console.log(_data, 'get_tree_view_data');
    this.get_tree_view_data_values = _data;
    // console.log(this.get_tree_view_data_values,'this.get_tree_view_data_values')
    if (this.get_tree_view_data_values?.subject_ids.length > 0) {
      this.loadTableData();
      this.selected_syllabus_id = this.get_tree_view_data_values?.selected_syllabus_id;
    } else {
      this.dataSource.data = [];
    }
  }
  public total_upto_date_earnings_currency:any;
  public total_upto_date_earnings:any;
  loadTableData() {
    this._spinner.open();
    let data: any = {
      subject_course_info: this.get_tree_view_data_values?.subject_course_info,
      subject_ids: this.get_tree_view_data_values?.subject_ids
    }
    this._apiService.Get_All_Earning_Details_List_Based_On_Subject_Ids(data).subscribe({
      next: (res) => {
        console.log(res, 'res');
        if (res.statusCode == 200) {
          this._spinner.close();
          const flashcardsData = res.data.data;
          flashcardsData.sort((a:any,b:any)=>{
            const dateA:any = new Date(a.flashcards_edited_datetime);
            const dateB:any = new Date(b.flashcards_edited_datetime);
        
            return dateB - dateA;
          })
          this.dataSource.data = flashcardsData;
          console.log(this.dataSource.data,'log')
          this.total_upto_date_earnings_currency = this.dataSource.data[0]?.monetization_earning_info?.earning_currency;
          const totalSharedSplitEarningAmount = this.dataSource.data.reduce(
            (total:any, flashcard:any) =>
              total +
              parseFloat(
                flashcard.monetization_earning_info
                  ? flashcard.monetization_earning_info.total_shared_split_earning_amount
                  : 0
              ),
            0
          );
          // console.log(totalSharedSplitEarningAmount,'totalSharedSplitEarningAmount');
          this.total_upto_date_earnings = totalSharedSplitEarningAmount;
        } else {
          this._spinner.close();
        }
        // console.log(flattenedData,'flattenedData');
      }, error: () => {
        this.total_upto_date_earnings = null;
        this.total_upto_date_earnings_currency = null;
        this._spinner.close();
      }
    })
  }

  _selected_rad_btn_values: any;
  is_view_details: boolean = true;
  is_list_of_course_subject: boolean = true;
  share_data_to_table_two: any;
  earning_rad_btn(_data: any) {
    // console.log(_data,'earning_rad_btn');
    if (this.is_tree_view_component_value == 1) {
      this.share_data_to_table_two = [_data].concat({ syllabus_id: 'is_select_all' });
    } else {
      this.share_data_to_table_two = [_data].concat({ syllabus_id: this.selected_syllabus_id });
    }
    this.is_list_of_course_subject = false;
    this._selected_rad_btn_values = _data;
    this.is_view_details = false;
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
  // tables
  displayedColumns: string[] = [
    'earning_start_date_time',
    'wow_flashcards',
    'upto_date_earnings',
    'earning_transferred_to_cc'
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
              <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Earning Details of your WOW FlashCards</span>
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
  // daily_earnings
  daily_earnings() {
    const dialog = this.dialog.open(PopupMoneEarningHistoryComponent, {
      disableClose: true,
      width: '550px',
      data: this._selected_rad_btn_values
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
