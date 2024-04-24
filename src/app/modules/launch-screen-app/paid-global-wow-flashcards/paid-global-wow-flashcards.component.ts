import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { YourWfPopupRecommendComponent } from '../your-wow-flashcards/your-wf-popup-recommend/your-wf-popup-recommend.component';
import { AccessPopupComponent } from '../i-frame/access-popup/access-popup.component';
import { AssignToStudentsPopupComponent } from '../i-frame/assign-to-students-popup/assign-to-students-popup.component';
@Component({
  selector: 'app-paid-global-wow-flashcards',
  templateUrl: './paid-global-wow-flashcards.component.html',
  styleUrls: ['./paid-global-wow-flashcards.component.scss']
})
export class PaidGlobalWowFlashcardsComponent implements OnInit {

  constructor(private dialog:MatDialog,private _apiService:ApiService, private snackBar:SnackBarService) { }

  decodedToken: any;
  is_disabled:boolean = true;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this.LoadData();
  }

  public access_token:any;
  public assign_to_students_token:any;
  LoadData() {
    this._apiService.GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId().subscribe({
      next:(res)=>{
        // console.log(res,'GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId');
        if(res.data.length>0){
          this.dataSource.data = res.data;
        }else{
          this.snackBar.success('Data Not Found')
        }
      }
    })
  }

  is_list_of_course_subject:boolean = true;
  selected_rad_btn_value:any;
  selected_rad_btn(_data:any) {
    console.log(_data,'data');
    this.is_disabled = false;
    this.is_list_of_course_subject = false;
    this.selected_rad_btn_value = _data;

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
      global_wow_flashcards_id:_data?.global_wow_flashcards_id,
      is_institutional_flashcards:_data?.is_global,
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

    if(_data.is_global == 1){
      flashcards_id_glob = _data.global_wow_flashcards_id;
      flashcards_id_inst = null;
    }else{
      flashcards_id_inst = _data?.institutional_wow_flashcards_id;
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
  // tables
  displayedColumns: string[] = [
    'shared_date_time',
    'wow_flashcards'
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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Your Paid Global WOW FlashCards</span>
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
  recommend_teaching_faculty() {
    const dialog = this.dialog.open(YourWfPopupRecommendComponent,{
      disableClose: true,
      width:'600px',
      data:this.selected_rad_btn_value
    })

    dialog.afterClosed().subscribe((result)=>{
      if(result == 1){
        this.is_disabled = true;
        this.is_list_of_course_subject = true;
        this.LoadData();
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

  shw_ceph_img = (ev: any) => {
    return `${environment.ceph_URL}${this.decodedToken.user?.country_code}-${this.decodedToken.user?.customer_id}/${ev}`;
  }
}
