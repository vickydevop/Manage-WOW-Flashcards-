import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
interface global_wow_flashcards {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-global-wf-popup-flag',
  templateUrl: './global-wf-popup-flag.component.html',
  styleUrls: ['./global-wf-popup-flag.component.scss']
})
export class GlobalWfPopupFlagComponent implements OnInit {
  global_wow_flashcards: global_wow_flashcards[] = [
    { value: 0, viewValue: 'Has Sexual / Adult Content' },
    { value: 1, viewValue: 'Has Anti National Content' },
    { value: 2, viewValue: 'Has Abusive Content' },
    { value: 3, viewValue: 'Not Relevant to Syllabus' },
    { value: 4, viewValue: 'Very Less Relevance to Syllabus'},
    { value: 5, viewValue: 'Is Plagiarized' },
    { value: 6, viewValue: 'Has Wrong Answers' },
    { value: 7, viewValue: 'Has Wrong Questions' },
    { value: 8, viewValue: 'Has Error in Typing or Spelling or Grammar' }
  ];
  
  flag:FormGroup;
  ckeConfig: CKEDITOR.config;
  constructor(
    public _dialogRef: MatDialogRef<GlobalWfPopupFlagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: SnackBarService,
    private _apiService: ApiService,
    private _formBuilder:FormBuilder,
    private _cdf:ChangeDetectorRef
  ) {
    this.flag = this._formBuilder.group({
      reasons_for_flagging:['',Validators.required],
      cdk_editor:['',Validators.required]
    })
   }

  ngOnInit(): void {
    // console.log(this.data,'sdf',`${this.data?.based_on_global_flashcards_flagged_details[0]?.flag_reason_code}`);
    if(this.data?.based_on_global_flashcards_flagged_details.length>0){
      const flagReasonCode = this.data?.based_on_global_flashcards_flagged_details[0]?.flag_reason_code;
      this.flag.get('cdk_editor')?.patchValue(this.data.based_on_global_flashcards_flagged_details[0]?.flag_details);
      this.flag.get('reasons_for_flagging')?.patchValue(flagReasonCode);
    }

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        {
          name: 'paragraph',
          groups: [
            'basicstyles',
            'cleanup',
            'list',
            'indent',
            'blocks',
            'align',
            'bidi',
            'paragraph',
            'spellchecker',
            'colors',
            'links',
          ],
        },
      ],
      removeButtons:
      'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Unlink,Anchor,Flash,orizontalRule,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About',
    };
    this._cdf.detectChanges();

  }
  OnClick(){
    this._dialogRef.close();
  }
  flag_save() {
    const name =[this.data.first_name , this.data.last_name];
    let data:any = {
      flag_message_id:this.data?.based_on_global_flashcards_flagged_details[0]?.flag_message_id,
      global_wow_flashcards_id:this.data?.global_wow_flashcards_id,
      flag_reason_code:this.flag.controls['reasons_for_flagging'].value,
      flag_details:this.flag.controls['cdk_editor'].value,
      flagged_by_user_name:name,
      flagged_by_user_category_name:this.data?.category_name
    }

    // console.log(data,'fafsafasfdafd');
    this._apiService.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag(data).subscribe({
      next:(res) =>{
        // console.log(res,'InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag')
        if(res.statusCode == 201){
          this._dialogRef.close(1);
          this._snackBar.success('Data Saved Successfully');
        }else{
          this._snackBar.error('Error While Saving Data');
        }
      }
    })
  }
}
