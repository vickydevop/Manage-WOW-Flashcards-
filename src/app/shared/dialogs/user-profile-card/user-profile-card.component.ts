import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomSpinnerService } from '../../services/custom-spinner/custom-spinner.service';
import { IframeService } from '../../services/iframe/iframe.service';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss']
})
export class UserProfileCardComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe: ElementRef;
  //* -----------------------  Variable Declaration  -----------------------*//
  // iframeSource: string = 'https://p29.getwow.community';
  iframeSource: string = 'https://p29.getwow.education';
  // iframeSource: string = 'http://192.168.29.173:4200';
  user_id: number;
  customer_id: number;
  country_id: string;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _iframeService: IframeService,
    public _dialogRef: MatDialogRef<UserProfileCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customSpinnerService: CustomSpinnerService
  ) { }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    // console.log(this.data,'da')
    this.user_id = this.data.user_id;
    this.customer_id = this.data.customer_id;
    this.country_id = this.data.country_id;
  }
  ngAfterViewInit(): void {
    this.iframeLoaded();
  }
  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appframe
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    this._customSpinnerService.open();
    iframe.addEventListener('load', (e) => {
      let body = {
        dark: sessionStorage.getItem('dark') ?? true,
        user_id: this.user_id,
        customer_id: this.customer_id,
        country_id: this.country_id,
      };
      this.sendMessage(body, String(this.iframeSource).toString());
      this._customSpinnerService.close();
    });
  }
  sendMessage(body: any, targetOrigin: string) {
    let iframeEl = this.appframe.nativeElement as HTMLIFrameElement;
    iframeEl.contentWindow.postMessage(JSON.stringify(body), targetOrigin);
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
