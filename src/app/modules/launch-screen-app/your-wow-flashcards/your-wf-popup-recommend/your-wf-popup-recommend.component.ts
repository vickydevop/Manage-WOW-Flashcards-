import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-your-wf-popup-recommend',
  templateUrl: './your-wf-popup-recommend.component.html',
  styleUrls: ['./your-wf-popup-recommend.component.scss']
})
export class YourWfPopupRecommendComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<YourWfPopupRecommendComponent>,
    private _apiService: ApiService,
    private _snackbarService: SnackBarService,
    private _spinner: CustomSpinnerService,
    private dialog: MatDialog
  ) { }

  decodedToken: any;
  teaching_faculty_users: any = [];
  is_recommend: boolean = true;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    console.log(this.data, 'recommend popup',this.data?.is_global);
    this.loadData();
  }
  protected loadData() {
    this._spinner.open();
    this._apiService.GetRecommendTeachingFacultyUsers().subscribe({
      next: (res) => {
        this._spinner.close();
        if (res.data.length > 0) {
          this.teaching_faculty_users = res.data;
        } else {
          this._snackbarService.success('Data not found');
        }
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  is_checkbox: boolean = true;
  select_teaching_faculty(_data: any) {
    this.is_checkbox = false;
    console.log(_data,this.data,'select_teaching_faculty');
    let is_global_wow_flashcards: any;
    let global_wow_flashcards_id: any;
    let institutional_wow_flashcards_id: any;
    if (this.data?.is_global == 1) {
      is_global_wow_flashcards = 1;
      institutional_wow_flashcards_id = null;
      global_wow_flashcards_id = this.data?.global_wow_flashcards_id;
    } else if (this.data?.is_global == 0) {
      is_global_wow_flashcards = 0;
      global_wow_flashcards_id = null;
      institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
    }else{
      if(this.data?.global_wow_flashcards_id != null){
        is_global_wow_flashcards = 1;
        global_wow_flashcards_id = this.data?.global_wow_flashcards_id;
        institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
      }else{
        is_global_wow_flashcards = 0;
        global_wow_flashcards_id = null;
        institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
      }
    }
    this._spinner.open();
    this._apiService.GetRecommendTeachingRegisteredUsers(_data?.user_category_id,is_global_wow_flashcards,global_wow_flashcards_id,institutional_wow_flashcards_id).subscribe({
      next: (res) => {
        this._spinner.close();
        let data: any = [];
        res.data?.getData.map((item: any) => {
          // console.log(this.decodedToken.user.user_id != item.user_id,'user_category_id');
          if (this.decodedToken.user.user_id != item.user_id) {
            data.push(item)
          }
        });
        // console.log(data,'data')
        this.dataSource.data = data;
        if (res.data?.get_table_data.length > 0) {
          const get_table_data = res.data?.get_table_data;
          // recommended_to_user_id;
          for (let i = 0; i < this.dataSource.data.length; i++) {
            if (get_table_data.filter((item: any) => item.recommended_to_user_id == this.dataSource.data[i].user_id).length > 0) {
              this.selection.select(this.dataSource.data[i])
            }

          }
        }
      }, error: () => {
        this._spinner.close();
      }
    })
  }
  OnClick() {
    this._dialogRef.close()
  }

  recommend_btn() {
    const selected_data = this.selection.selected;
    const selected_values: any = [];
    for (let i = 0; i < selected_data.length; i++) {
      selected_values.push(selected_data[i]?.user_id);
    }
    console.log(selected_values,'selected',this.data,this.data?.is_global == (undefined || "undefined"));
    let is_global_wow_flashcards: any;
    let global_wow_flashcards_id: any;
    let institutional_wow_flashcards_id: any;
    if (this.data?.is_global == 1) {
      is_global_wow_flashcards = 1;
      institutional_wow_flashcards_id = null;
      global_wow_flashcards_id = this.data?.global_wow_flashcards_id;
    } else if (this.data?.is_global == 0) {
      is_global_wow_flashcards = 0;
      global_wow_flashcards_id = null;
      institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
    }else{
      if(this.data?.global_wow_flashcards_id != null){
        is_global_wow_flashcards = 1;
        global_wow_flashcards_id = this.data?.global_wow_flashcards_id;
        institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
      }else{
        is_global_wow_flashcards = 0;
        global_wow_flashcards_id = null;
        institutional_wow_flashcards_id = this.data?.institutional_wow_flashcards_id;
      }
    }
    const new_date = DateTime.local();
    const change_format = new_date.toFormat('yyyy-MM-dd HH:mm:ss');
    let data: any = {
      recommended_to_user_id: selected_values,
      shared_datetime: change_format,
      is_global_wow_flashcards: is_global_wow_flashcards,
      institutional_wow_flashcards_id: institutional_wow_flashcards_id,
      global_wow_flashcards_id: global_wow_flashcards_id,
    }
    console.log(data,'InsertOrUpdateRecommendTeachingFacultyUsers');
    this._apiService.InsertOrUpdateRecommendTeachingFacultyUsers(data).subscribe({
      next: () => {
        this._dialogRef.close(1);
        this._snackbarService.success('Data Saved Successfully!!!');
      }
    })
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
    'select_from_the_users_registered'
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
    const check = this.selection.selected;
    // console.log(check,'cjec');
    if (check.length > 0) {
      this.is_recommend = false;
    } else {
      this.is_recommend = true;
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
  @ViewChild('pdfTable6', { static: false }) pdfTable6!: ElementRef;

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
    var printContents = document.getElementById('pdfTable6')!.innerHTML;
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
          <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of the Users Registered
          in the above category</span>
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
}
