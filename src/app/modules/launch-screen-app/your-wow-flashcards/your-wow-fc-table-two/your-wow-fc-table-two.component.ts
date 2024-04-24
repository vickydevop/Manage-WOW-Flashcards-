import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { YourWfPopupLinkNewEditComponent } from '../your-wf-popup-link-new-edit/your-wf-popup-link-new-edit.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { HidePopupComponent } from '../hide-popup/hide-popup.component';

@Component({
  selector: 'app-your-wow-fc-table-two',
  templateUrl: './your-wow-fc-table-two.component.html',
  styleUrls: ['./your-wow-fc-table-two.component.scss']
})
export class YourWowFcTableTwoComponent implements OnInit {
  @Input('receive_radio_button_value') receive_radio_button_value:any;
  @Output() get_output_data_from_table_two = new EventEmitter<any>();
  constructor(private dialog:MatDialog,
    private _apiService:ApiService,
    private _spinner:CustomSpinnerService,
    private _snackBar:SnackBarService,
    private _cmn:CommonService
    ) { }

  decodedToken:any;
  list_of_course_subject_data:any;
  ngOnInit(): void {
    const getToken: any = sessionStorage.getItem('access_token');
    const tokenPayload = getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this._cmn.isNotNull(this.receive_radio_button_value))
    console.log(this.receive_radio_button_value,'this.receive_radio_button_value');
    if(this.receive_radio_button_value.length>0){
      this.is_share_and_unshare = true;
      this.is_disabled_remove_btn = true;
      this.is_disabled_btn = true;
    this.LoadData();
    }else{
      this.dataSource.data = [];
      this.is_share_and_unshare = true;
      this.is_disabled_remove_btn = true;
      this.is_disabled_btn = true;      
    }
  }
LoadData(){
  this._spinner.open();
    this._apiService.List_of_Linked_Syllabus_BasedOn_Wow_flashcards(this.receive_radio_button_value[0]?.institutional_wow_flashcards_id).subscribe({
      next:(res) =>{
        this._spinner.close();
        // console.log(res,'_apiService');
        if(res.data.data.length>0){
          this.dataSource.data = res.data?.data;
          this.list_of_course_subject_data = res.data?.data;
        }
      },error:()=>{
        this._spinner.close();
      }
    });
}
  is_disabled_btn:boolean = true; 
  is_disabled_remove_btn:boolean = true;
  selected_table_value:any;
  is_share_and_unshare:boolean = true;
  ListOfLinkedSyllabusEditdata:any;
  radio_btn_fun(_data:any){
    console.log(_data,'receive_radio_button_value');
    if(this.dataSource.data.length == 1 || _data.is_shared_globally == 1){
      this.is_disabled_remove_btn = true;
    }else{
      this.is_disabled_remove_btn =  false;
    }
    this.selected_table_value = _data;
    this.is_disabled_btn = false;
    if(_data?.is_global == 1){
      this.is_share_and_unshare = false;
    }else{
      this.is_share_and_unshare = true;
    }

    let course_subject_id:any;
    if(_data.is_global == 0){
      course_subject_id = _data.institutional_course_subject_id
    }else if(_data.is_global == 1) {
      course_subject_id = _data.global_course_subject_id
    }
      this._apiService.ListOfLinedSyllabusEditLinkRelevantSyllabus(course_subject_id,this.receive_radio_button_value[0]?.institutional_wow_flashcards_id,_data?.is_global).subscribe({
        next:(res)=>{
          // console.log('course_subject_id',res.data);
          // this.ListOfLinkedSyllabusEditdata = res.data;
          const filteredData = res.data?.joinedTwoArrays.filter((item:any)=>{
            if(item?.is_global == 0){
              return item.institutional_course_subject_id == course_subject_id;
            }else if(item?.is_global == 1){
              return item.global_course_subject_id == course_subject_id
            }
            return 0;
          })
          // console.log(filteredData,'filteredData');
          const get_syllabus_ids = res.data?.get_syllabus_ids.map((item:any)=>{
            return item.syllabus_id;
          })

          // console.log(get_syllabus_ids);
          let data:any = {
            relevant_syllabus:filteredData,
            syllabus_ids:get_syllabus_ids
          }
          this.ListOfLinkedSyllabusEditdata = data;

        }
      })
  }
  
  share_and_unshare() {
    let popup_text:any; 
    if(this.selected_table_value?.is_shared_globally == 1){
      popup_text = "UnShare Globally";
    }else if(this.selected_table_value?.is_shared_globally == 0){
      popup_text = "Share Globally";
    }
    let config: MatDialogConfig = {
      disableClose: true,
      maxWidth: '300px',
      minHeight: 'auto',
      data: popup_text
    };

    const dialogRef = this.dialog.open(HidePopupComponent, config);
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'true') {
        let data:any;
        if(this.receive_radio_button_value[1]?.syllabus_id == "is_select_all"){
          data = [this.selected_table_value].concat({syllabus_id:this.selected_table_value?.subject_ids,institutional_wow_flashcards_id:this.receive_radio_button_value[0]?.institutional_wow_flashcards_id,wow_flashcards_name:this.receive_radio_button_value[0]?.wow_flashcards_name});
        }else{
          data = [this.selected_table_value].concat({syllabus_id:this.receive_radio_button_value[1]?.syllabus_id,institutional_wow_flashcards_id:this.receive_radio_button_value[0]?.institutional_wow_flashcards_id,wow_flashcards_name:this.receive_radio_button_value[0]?.wow_flashcards_name});
        }
        // console.log(data);
        this._apiService.ListOfLinedSyllabusSharedAndUnShared(data).subscribe({
          next:(res)=>{
            // console.log(res,'dadsa');
            if(res?.statusCode == 200){
              // this.LoadData();
              this.is_disabled_btn = true;
              this.is_disabled_remove_btn = true;
              this.is_share_and_unshare = true;
              this.get_output_data_from_table_two.emit(true);
              this._snackBar.success('Data Saved Successfully');
            }else{
              this._snackBar.error('Error while saving data');
            }
          }
        })
      }
    })
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
  
    onRowClicked(row: any) {}
    @ViewChild('pdfTable5', { static: false }) pdfTable5!: ElementRef;
  
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
      var printContents = document.getElementById('pdfTable5')!.innerHTML;
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
          <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">List of Courses / Subjects linked to WOW FlashCards Name</span>
          <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
            this.paginator.length
          } ) ${
            this.filterValue.length >= 1
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
    link_new_and_edit(_data:any) {
      // console.log(_data,'$event');
      if(_data == 0){
        const dialog = this.dialog.open(YourWfPopupLinkNewEditComponent,{
          width:'600px',
          data:[{data:this.receive_radio_button_value,is_btn:_data}]
        })
        dialog.afterClosed().subscribe((result) =>{
          // console.log(result);
          if(result?.data == 1){
            this.is_disabled_btn = true;
            this.is_disabled_remove_btn = true;
            this.is_share_and_unshare = true;
            this.LoadData();
          }
        })
      }else if(_data == 1){
        const dialog = this.dialog.open(YourWfPopupLinkNewEditComponent,{
          width:'600px',
          data:[
            {
              data:this.receive_radio_button_value,
              is_btn:_data,
              ListOfLinkedSyllabusEditdata:this.ListOfLinkedSyllabusEditdata,
              selected_table_value:this.selected_table_value
            }
          ]
        })
        dialog.afterClosed().subscribe((result) =>{
          if(result?.data == 1){
            this.is_disabled_btn = true;
            this.is_disabled_remove_btn = true;
            this.is_share_and_unshare = true;
            this.LoadData();
          }
        })
      }
    }

    // delete confrom dialog 
    delete_conform_dialog() {
      let config: MatDialogConfig = {
        disableClose: true,
        maxWidth: '300px',
        minHeight: 'auto',
      };

      const dialogRef = this.dialog.open(DeletePopupComponent, config);
      dialogRef.afterClosed().subscribe((res) => {
        // console.log(res);
        let data:any = {
          selected_table_value:this.selected_table_value,
          receive_radio_button_value:this.receive_radio_button_value
        }
        if (res == 'true') {
          this._apiService
            .ListOfLinkedSyllabusRemove(data) .subscribe ({
              next:() => {
              this.LoadData();
              this.is_share_and_unshare = true;
              this.is_disabled_btn = true;
              this.is_disabled_remove_btn = true;
              this._snackBar.success('Data Removed Successfully');
              },
              error:() => {
              this._snackBar.error('Error while Data Removing');
              }
            })
        }
      });
  }
}
