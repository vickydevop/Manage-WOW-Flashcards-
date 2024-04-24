import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hide-popup',
  templateUrl: './hide-popup.component.html',
  styleUrls: ['./hide-popup.component.scss']
})
export class HidePopupComponent implements OnInit {
 //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public _dialogRef: MatDialogRef<HidePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    // console.log(this.data,'data')
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this._dialogRef.close();
  }
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
