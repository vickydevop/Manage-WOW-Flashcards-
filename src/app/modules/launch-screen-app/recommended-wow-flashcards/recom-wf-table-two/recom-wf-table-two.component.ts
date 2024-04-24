import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { YourWfPopupLinkNewEditComponent } from '../../your-wow-flashcards/your-wf-popup-link-new-edit/your-wf-popup-link-new-edit.component';
import { DeletePopupComponent } from '../../your-wow-flashcards/your-wow-fc-table-two/delete-popup/delete-popup.component';

@Component({
  selector: 'app-recom-wf-table-two',
  templateUrl: './recom-wf-table-two.component.html',
  styleUrls: ['./recom-wf-table-two.component.scss']
})
export class RecomWfTableTwoComponent implements OnInit {
  @Input('receive_radio_button_value') receive_radio_button_value: any;
  constructor(private dialog: MatDialog,
    private _apiService: ApiService,
    private _spinner: CustomSpinnerService,
    private _snackBar: SnackBarService,
    private _cmn: CommonService
  ) { }

  decodedToken: any;
  list_of_course_subject_data: any;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this._cmn.isNotNull(this.receive_radio_button_value))
    // console.log(this.receive_radio_button_value,'this.receive_radio_button_value');
    if (this.receive_radio_button_value?.institutional_wow_flashcards_id != null) {
      this.LoadData();
    } else {
      this.dataSource.data = [];

    }
  }
  LoadData() {
    this._spinner.open();
    this._apiService.GetAllCourseSubjectsBasedOnWowFlashcardsId(this.receive_radio_button_value?.institutional_wow_flashcards_id).subscribe({
      next: (res) => {
        this._spinner.close();
        // console.log(res,'_apiService');
        if (res.data.length > 0) {
          this.dataSource.data = res.data;
          this.list_of_course_subject_data = res.data;
        }else{
          this._snackBar.success('Data Not Found')
        }
      },error:()=>{
        this._spinner.close();
      }
    });
  }

  selected_table_value: any;
  ListOfLinkedSyllabusEditdata: any;
  get_syllabus_id_based_on_subject_ids:any;
  share_data_from_tree_view:any;
  radio_btn_fun(_data: any) {
    // console.log(_data,'receive_radio_button_value');
    this.selected_table_value = _data;
    let data:any ={
      institutional_wow_flashcards_id:this.receive_radio_button_value?.institutional_wow_flashcards_id,
      is_global : _data?.is_global,
      institutional_course_subject_id : _data.institutional_course_subject_id,
      global_course_subject_id : _data.global_course_subject_id,
      educational_institution_category_country_code:_data?.educational_institution_category_country_code,
      educational_institution_category_id:_data?.educational_institution_category_id
    }
    this._spinner.open();
    this._apiService.GetSyllabusIdBasedOnSubjectIdAndFlashcardsId(data).subscribe({
      next:(res)=>{
        // console.log(res,'fdsa')
        if(res.data.length>0){
          this._spinner.close();
          this.get_syllabus_id_based_on_subject_ids = res.data;
        }else{
          this._spinner.close();
          // this.get_syllabus_id_based_on_subject_ids = [];
        }
      },error:()=>{
        this._spinner.close();
      }
    });
    
    setTimeout(() => {
      this.share_data_from_tree_view = [_data].concat({syllabus_id:this.get_syllabus_id_based_on_subject_ids})
    }, 1000);
  }

  // tables
  displayedColumns: string[] = [
    'country_name',
    'inst_category',
    'course_subject_category',
    'is_shared_globally'
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
          <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Users with Access to the
          above WOW ResourceS</span>
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
