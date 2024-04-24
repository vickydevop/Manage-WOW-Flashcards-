import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public _dialogRef: MatDialogRef<DeletePopupComponent>,
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
