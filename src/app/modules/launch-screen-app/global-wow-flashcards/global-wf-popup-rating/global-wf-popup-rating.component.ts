import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-global-wf-popup-rating',
  templateUrl: './global-wf-popup-rating.component.html',
  styleUrls: ['./global-wf-popup-rating.component.scss']
})
export class GlobalWfPopupRatingComponent implements OnInit {
  star_rating:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    public _dialogRef: MatDialogRef<GlobalWfPopupRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: SnackBarService,
    private _apiService: ApiService,
    ) { 
    this.star_rating = this.formBuilder.group({
      star_rating_value:['',Validators.required]
    })
  }

  ngOnInit(): void {
    // console.log(this.data,'adaa');
    if(this.data?.avg_global_teaching_faculty_rating != null){
      this.star_rating.controls['star_rating_value'].setValue(this.data?.avg_global_teaching_faculty_rating);
      this.rating_value = this.data?.avg_global_teaching_faculty_rating;
      this.is_submit_rating = false;
    }
  }

  is_submit_rating:boolean = true;
  rating_value:any;
  ngx_star_rating(){
    this.star_rating.get('star_rating_value')?.valueChanges.subscribe((res)=>{
      console.log(res,'star_rating_value');
      if(res>0){
        this.rating_value = res;
        this.is_submit_rating = false;
      }
    })
  }

  submit_rating(){
    this._apiService.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating(this.data?.global_wow_flashcards_id,this.rating_value).subscribe({
      next:(res)=>{
        if(res.statusCode == 201) {
          this._dialogRef.close(1);
          this._snackBar.success('Data Saved Successfully');
        }
      },error:()=>{
        this._snackBar.error('Error While Saving Data')
      }
    })
  }
  // close_popup 
  close_popup() {
    this._dialogRef.close();
  }
}
