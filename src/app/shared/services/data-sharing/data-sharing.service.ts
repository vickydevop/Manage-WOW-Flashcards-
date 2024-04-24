import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  constructor() {}

  private Audit_trail = new BehaviorSubject<string|any>(undefined);
  audit_trail_data = this.Audit_trail.asObservable();

  updateAuditTrailData(data: number) {
    this.Audit_trail.next(data);
  }

  private Assigned_category = new BehaviorSubject<any>(undefined);
  assigned_category_data = this.Assigned_category.asObservable();

  updateAssignedCategoryData(data: any) {
    this.Assigned_category.next(data);
  }
}
