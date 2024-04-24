import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-popup-mone-earning-history',
  templateUrl: './popup-mone-earning-history.component.html',
  styleUrls: ['./popup-mone-earning-history.component.scss']
})
export class PopupMoneEarningHistoryComponent implements OnInit {
  
  date:FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<PopupMoneEarningHistoryComponent>,
    private _apiService: ApiService,
    private formBuilder:FormBuilder,
    private _snackBar:SnackBarService
  ) { 
    this.date = this.formBuilder.group({
      from_date:['',Validators.required],
      to_date:['',Validators.required]
    })
  }
  decodedToken: any;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    this.date.get('to_date').disable();
    this.min_to_date = new Date();
    const today_date = new Date();
    const oneWeekAgo = new Date(today_date.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.date.controls['from_date']?.patchValue(oneWeekAgo);
    this.date.controls['to_date']?.patchValue(today_date);
    this.loadData();
  }
  
  min_to_date:any;
  public total_upto_date_earnings_currency:any;
  public total_upto_date_earnings:any;
  loadData(){
    this.date.get('to_date').enable();
    let from_date = this.date.get('from_date').value;
    let to_date = this.date.get('to_date').value;
    // console.log(this.value_1,this.value_2 ,this.value_1 == 1 && this.value_2 ==2)
    this._apiService.GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails(this.data.institutional_wow_flashcards_id,from_date,to_date).subscribe({
        next:(res)=>{
            // console.log(res,'institutional_wow_flashcards_id');
            if(res.statusCode == 200){
              if(res.data.length>0){
                this.dataSource.data = res.data;
                this.total_upto_date_earnings_currency = this.dataSource.data[0]?.earning_currency;
                const totalSharedSplitEarningAmount = this.dataSource.data.reduce(
                  (total:any, flashcard:any) =>
                    total +
                    parseFloat(
                      flashcard.total_earning_amount
                        ? flashcard.total_earning_amount
                        : 0
                    ),
                  0
                );
                // console.log(totalSharedSplitEarningAmount,'totalSharedSplitEarningAmount');
                this.total_upto_date_earnings = totalSharedSplitEarningAmount;
              }else{
                this.total_upto_date_earnings = null;
                this.total_upto_date_earnings_currency = null;
                this.dataSource.data = [];
                this._snackBar.success('Data Not Found');
              }
            }
          }
        })

  }
  // tables
  displayedColumns: string[] = [
    'earning_date',
    'consolidated_daily_earnings'
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
    // this.loadData();
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
  @ViewChild('pdfTable2', { static: false }) pdfTable2!: ElementRef;

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
    var printContents = document.getElementById('pdfTable2')!.innerHTML;
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
              <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">Daily Earnings of WOW FlashCards</span>
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
  OnClick(){
    this._dialogRef.close();
  }
}
