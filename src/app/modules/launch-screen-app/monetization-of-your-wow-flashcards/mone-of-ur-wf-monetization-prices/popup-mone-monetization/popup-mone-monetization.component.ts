import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-popup-mone-monetization',
  templateUrl: './popup-mone-monetization.component.html',
  styleUrls: ['./popup-mone-monetization.component.scss']
})
export class PopupMoneMonetizationComponent implements OnInit {
  monetization:FormGroup;
  constructor(
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<PopupMoneMonetizationComponent>,
    private _apiService:ApiService,
    private formBuilder:FormBuilder,
    private _snackBar:SnackBarService
  ) { 
    this.monetization = this.formBuilder.group({
      monetization_globally:['',Validators.required],
      monetization_from_app_users:['',Validators.required]
    })
  }
  monetization_checked:boolean = false;
  institution_checked:boolean = false;
  public is_saved_btn:boolean = true;
  ngOnInit(): void {
    // console.log('PopupMoneMonetizationComponent',this.data);
    if(this.data.type == 1){
      if(this.data?.rad_btn_value?.monetization_info?.one_time_subscription_cost_per_user_for_global_users != null){
        this.monetization_checked = true;
        this.one_time_subscription_global_users_currency = this.data.rad_btn_value?.currency_code;
      }else{
        this.monetization_checked = false;
        this.one_time_subscription_global_users_currency = null;
      }
      this.monetization.get('monetization_globally')?.patchValue(this.data?.rad_btn_value?.monetization_info?.one_time_subscription_cost_per_user_for_global_users);
      this.monetization.get('monetization_from_app_users')?.patchValue(this.data?.rad_btn_value?.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users);
      if(this.data?.rad_btn_value?.monetization_info?.one_time_subscription_cost_per_user_for_institutional_users != null){
        this.institution_checked = true;
        this.one_time_subscription_institutional_users_currency = this.data.rad_btn_value?.currency_code;
      }else{
        this.institution_checked = false;
        this.one_time_subscription_institutional_users_currency = null;
      }
    }else{
      this.monetization.get('monetization_globally')?.disable();
      this.monetization.get('monetization_from_app_users')?.disable();
    }
  }
  is_save:boolean = true;
  is_monetized_globally:number = 0;
  is_monetized_for_the_institution:number = 0;
  one_time_subscription_global_users_currency:any;
  one_time_subscription_institutional_users_currency:any;
  checkbox_monetize_globally(_data:any){
    // console.log(_data,'checkbox_monetize_globally');
    if(_data?.checked == true){
      this.is_save = false;
      this.is_monetized_globally = 1;
      this.one_time_subscription_global_users_currency = this.data.rad_btn_value?.currency_code;
      this.monetization.get('monetization_globally')?.enable();
    }else{
      this.is_save = true;
      this.is_monetized_globally = 0;
      this.one_time_subscription_global_users_currency = null;
      this.monetization.get('monetization_globally')?.disable();
      this.monetization.get('monetization_globally')?.patchValue('');
    }
  }

  checkbox_monetize_from_app_users(_data:any){
    // console.log('checkbox_monetize_from_app_users',_data);
    if(_data?.checked == true){
      this.is_save = false;
      this.is_monetized_for_the_institution = 1;
      this.one_time_subscription_institutional_users_currency = this.data.rad_btn_value?.currency_code;
      this.monetization.get('monetization_from_app_users')?.enable();
    }else{
      this.is_save = true;
      this.is_monetized_for_the_institution = 0;
      this.one_time_subscription_institutional_users_currency = null;
      this.monetization.get('monetization_from_app_users')?.patchValue('');
    }
  }

  save_btn() {
    let one_time_subscription_cost_per_user_for_institutional_users_value:any;
    let one_time_subscription_cost_per_user_for_global_users_value:any;
    if(this.monetization.get('monetization_from_app_users').value == ""){
      one_time_subscription_cost_per_user_for_institutional_users_value = null;
    }else{
      one_time_subscription_cost_per_user_for_institutional_users_value = this.monetization.get('monetization_from_app_users').value;
    }
    if(this.monetization.get('monetization_globally').value == ""){
      one_time_subscription_cost_per_user_for_global_users_value = null;
    }else{
      one_time_subscription_cost_per_user_for_global_users_value = this.monetization.get('monetization_globally').value;
    }
    let values:any ={
      is_type:this.data.type,
      institutional_wow_flashcards_id:this.data.rad_btn_value?.institutional_wow_flashcards_id,
      global_wow_flashcards_id:this.data.rad_btn_value?.global_wow_flashcards_id,
      is_monetized_globally:this.is_monetized_globally,
      is_monetized_for_the_institution:this.is_monetized_for_the_institution,
      one_time_subscription_cost_per_user_for_institutional_users:one_time_subscription_cost_per_user_for_institutional_users_value,
      one_time_subscription_institutional_users_currency:this.one_time_subscription_institutional_users_currency,
      one_time_subscription_cost_per_user_for_global_users:one_time_subscription_cost_per_user_for_global_users_value,
      one_time_subscription_global_users_currency:this.one_time_subscription_global_users_currency,
      wow_flashcards_name:this.data.rad_btn_value?.wow_flashcards_name
    }
    // console.log(values,'values');
    this._apiService.InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(values).subscribe({
      next:(res)=>{
        // console.log(res,'InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices');
        if(res.statusCode == 201){
          this._dialogRef.close(1);
          this._snackBar.success('Data Saved Successfully');
        }else{
          this._snackBar.error('Error While Saving Data');
        }
      }
    })
  }

  OnClick(){
    this._dialogRef.close();
  }

}
