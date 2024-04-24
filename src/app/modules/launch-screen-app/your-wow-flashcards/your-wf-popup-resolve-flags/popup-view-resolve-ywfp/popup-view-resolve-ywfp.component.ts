import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { DateTime } from 'luxon';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
@Component({
  selector: 'app-popup-view-resolve-ywfp',
  templateUrl: './popup-view-resolve-ywfp.component.html',
  styleUrls: ['./popup-view-resolve-ywfp.component.scss']
})
export class PopupViewResolveYwfpComponent implements OnInit {

  resolve_comment: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<PopupViewResolveYwfpComponent>,
    private formBuilder: FormBuilder,
    private _apiService:ApiService,
    private snack_bar:SnackBarService,
    private dialog:MatDialog,
  ) {
    this.resolve_comment = this.formBuilder.group({
      resolve_comment_value: ['', Validators.required]
    })
  }

  public remove_unusual_tags:any;
  ngOnInit(): void {
    // console.log(this.data, 'PopupViewResolveYwfpComponent');
    this.resolve_comment?.get('resolve_comment_value')?.setValue(this.data?.selected_value[0]?.resolved_comments);
    this.remove_unusual_tags =  removeHtmlTags(this.data?.selected_value[0]?.flag_details)
  }

  OnClick() {
    this._dialogRef.close()
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
  
  add_comment_and_resolve() {
    // console.log(this.resolve_comment?.get('resolve_comment_value')?.value,this.data?.selected_value[0]?.flag_message_id, 'fssfds');

    const new_date =DateTime.local();
    const change_format = new_date.toFormat('yyyy-MM-dd HH:mm:ss');
    let data:any = {
      global_wow_flashcards_id:this.data?.table_Value[0]?.global_wow_flashcards_id,
      flag_message_id:this.data?.selected_value[0]?.flag_message_id,
      resolve_comment_value:this.resolve_comment?.get('resolve_comment_value')?.value,
      current_datetime:change_format
    }
    this._apiService.InsertOrUpdateResolveFlag(data).subscribe({
      next:() =>{
        this._dialogRef.close(1); 
        this.snack_bar.success('Data Saved successfully');
      }
    })
  }
}
function removeHtmlTags(inputHtml:any) {
  // Create a temporary DOM element
  const tempElement = document.createElement('div');

  // Set the input HTML as innerHTML of the temporary element
  tempElement.innerHTML = inputHtml;

  // Extract the text content (which excludes HTML tags)
  const textContent = tempElement.textContent || tempElement.innerText;

  return textContent;
}
