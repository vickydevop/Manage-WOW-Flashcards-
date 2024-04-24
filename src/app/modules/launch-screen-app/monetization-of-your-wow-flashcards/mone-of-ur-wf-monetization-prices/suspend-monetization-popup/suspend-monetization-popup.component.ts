import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-suspend-monetization-popup',
  templateUrl: './suspend-monetization-popup.component.html',
  styleUrls: ['./suspend-monetization-popup.component.scss']
})
export class SuspendMonetizationPopupComponent implements OnInit {
 //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public _dialogRef: MatDialogRef<SuspendMonetizationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {}

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this._dialogRef.close();
  }
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}