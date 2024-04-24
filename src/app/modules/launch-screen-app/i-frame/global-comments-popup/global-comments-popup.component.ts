import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtAuthService} from 'src/app/shared/services/api/jwtauthservice.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { IframeService } from 'src/app/shared/services/iframe/iframe.service';

@Component({
  selector: 'app-global-comments-popup',
  templateUrl: './global-comments-popup.component.html',
  styleUrls: ['./global-comments-popup.component.scss']
})
export class GlobalCommentsPopupComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  iframeSource: string = 'https://p22.getwow.community';
  // iframeSource: string = 'https://p22.getwow.education';
  // iframeSource: string = 'http://192.168.0.107:4202/';
  country_code: any;
  customer_id: any;
  login_id: any;
  wow_assignment_id: any;
  wow_class_stream_reference_id: any;
  user_category_allocation_id: any;
  other_id: any;
  reply_from_entry_creator_or_collaborator_user_id: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _iframeService: IframeService,
    public _dialogRef: MatDialogRef<GlobalCommentsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customSpinnerService: CustomSpinnerService,
    private authService: JwtAuthService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    console.log(this.data,'data')
    // this.customer_id = 1
    let one: any = sessionStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    console.log(token, 'token');
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    // this.login_id = token.user.login_id;
    this.wow_assignment_id = this.data.global_wow_flashcards_id;
    // this.wow_class_stream_reference_id =
    //   token.user.wow_class_stream_reference_id;
    // this.user_category_allocation_id = token.user.user_category_allocation_id;
    // this.reply_from_entry_creator_or_collaborator_user_id =
    //   token.user.reply_from_entry_creator_or_collaborator_user_id;

    this.login_id = token.user.user_id;

    // this.country_id = token.user.country_code;
  }
  ngAfterViewInit(): void {
    this.iframeLoaded();
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appframe
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    // this._customSpinnerService.open();

    // Send a message to the child iframe
    iframe.addEventListener('load', (e) => {
      let body = {
        // access_token: sessionStorage.getItem('access_token'),
        dark: sessionStorage.getItem('dark') ?? false,
        // user_id: this.user_id,
        customer_id: this.customer_id,
        country_code: this.country_code,
        wow_assignment_id: this.wow_assignment_id,
        login_id: this.login_id,
        wow_flashcards_thumb_nail_cloud_storage_file_id:this.data.wow_flashcards_thumb_nail_cloud_storage_file_id,
        wow_flashcards_name:this.data.wow_flashcards_name,
        institutional_wow_flashcards_id:this.data.institutional_wow_flashcards_id,
        global_wow_flashcards_id:this.data?.global_wow_flashcards_id    
        // wow_class_stream_reference_id: this.wow_class_stream_reference_id,
        // user_category_allocation_id: this.user_category_allocation_id,
        // reply_from_entry_creator_or_collaborator_user_id:
        //   this.reply_from_entry_creator_or_collaborator_user_id,
      };
      console.log(body, 'body');

      this.sendMessage(body, String(this.iframeSource).toString());
      // this._customSpinnerService.close();
    });

    // Receive a message child to parent iframe
    window.addEventListener('message', (e) => {
      if (e.origin == this.iframeSource) {
        if (e.data) {
          this._iframeService.getIframeMessages(e.data);
        }
      }
    });
  }
  sendMessage(body: any, targetOrigin: string) {
    // Make sure you are sending a string, and to stringify JSON
    let iframeEl: any = this.appframe.nativeElement as HTMLIFrameElement;

    iframeEl.contentWindow.postMessage(JSON.stringify(body), targetOrigin);

    // iframeEl.contentWindow.postMessage(body, '*');
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}