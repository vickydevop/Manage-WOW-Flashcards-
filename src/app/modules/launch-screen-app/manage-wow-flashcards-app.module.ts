import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageWowFlashcardsAppComponent } from './manage-wow-flashcards-app/manage-wow-flashcards-app.component';
import { ManageWowFlashcardsAppRoutingModule } from './manage-wow-flashcards-app-routing.module';
import { YourWowFlashcardsComponent } from './your-wow-flashcards/your-wow-flashcards.component';
import { GlobalWowFlashcardsComponent } from './global-wow-flashcards/global-wow-flashcards.component';
import { AssignWowFlashcardsComponent } from './assign-wow-flashcards/assign-wow-flashcards.component';
import { MonetizationOfYourWowFlashcardsComponent } from './monetization-of-your-wow-flashcards/monetization-of-your-wow-flashcards.component';
import { RecommendedWowFlashcardsComponent } from './recommended-wow-flashcards/recommended-wow-flashcards.component';
import { PaidGlobalWowFlashcardsComponent } from './paid-global-wow-flashcards/paid-global-wow-flashcards.component';
import { YourWowFcTreeViewComponent } from './your-wow-flashcards/your-wow-fc-tree-view/your-wow-fc-tree-view.component';
import { YourWowFcTableTwoComponent } from './your-wow-flashcards/your-wow-fc-table-two/your-wow-fc-table-two.component';
import { GlobalWfTreeViewComponent } from './global-wow-flashcards/global-wf-tree-view/global-wf-tree-view.component';
import { MoneOfUrWfMonetizationPricesComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-monetization-prices/mone-of-ur-wf-monetization-prices.component';
import { MoneOfUrWfEarningDetailsComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-earning-details/mone-of-ur-wf-earning-details.component';
import { MoneEarningDetailsTableTwoComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-earning-details/mone-earning-details-table-two/mone-earning-details-table-two.component';
import { RecommendedWfTreeViewComponent } from './recommended-wow-flashcards/recommended-wf-tree-view/recommended-wf-tree-view.component';
import { YourWfPopupResolveFlagsComponent } from './your-wow-flashcards/your-wf-popup-resolve-flags/your-wf-popup-resolve-flags.component';
import { YourWfPopupRecommendComponent } from './your-wow-flashcards/your-wf-popup-recommend/your-wf-popup-recommend.component';
import { YourWfPopupLinkNewEditComponent } from './your-wow-flashcards/your-wf-popup-link-new-edit/your-wf-popup-link-new-edit.component';
import { PopupViewResolveYwfpComponent } from './your-wow-flashcards/your-wf-popup-resolve-flags/popup-view-resolve-ywfp/popup-view-resolve-ywfp.component';
import { GlobalWfPopupRatingComponent } from './global-wow-flashcards/global-wf-popup-rating/global-wf-popup-rating.component';
import { GlobalWfPopupFlagComponent } from './global-wow-flashcards/global-wf-popup-flag/global-wf-popup-flag.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { CKEditorModule } from 'ng2-ckeditor';
import { PopupMoneMonetizationComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-monetization-prices/popup-mone-monetization/popup-mone-monetization.component';
import { PopupMoneEarningDetailsComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-monetization-prices/popup-mone-earning-details/popup-mone-earning-details.component';
import { PopupMoneEarningHistoryComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-earning-details/popup-mone-earning-history/popup-mone-earning-history.component';
import { EditGlobalCourseComponent } from './i-frame/edit-global-course/edit-global-course.component';
import { DeletePopupComponent } from './your-wow-flashcards/your-wow-fc-table-two/delete-popup/delete-popup.component';
import { MonetizationPricesTreeViewComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-monetization-prices/monetization-prices-tree-view/monetization-prices-tree-view.component';
import { RecomWfTableTwoComponent } from './recommended-wow-flashcards/recom-wf-table-two/recom-wf-table-two.component';
import { UserProfileCardComponent } from 'src/app/shared/dialogs/user-profile-card/user-profile-card.component';
import { AssignToStudentsPopupComponent } from './i-frame/assign-to-students-popup/assign-to-students-popup.component';
import { AccessPopupComponent } from './i-frame/access-popup/access-popup.component';
import { AddEditFlashcardsDataComponent } from './i-frame/add-edit-flashcards-data/add-edit-flashcards-data.component';
import { AuditTrailDialogComponent } from 'src/app/shared/dialogs/audit-trail-dialog/audit-trail-dialog.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { HidePopupComponent } from './your-wow-flashcards/hide-popup/hide-popup.component';
import { GlobalCommentsPopupComponent } from './i-frame/global-comments-popup/global-comments-popup.component';
import { SuspendMonetizationPopupComponent } from './monetization-of-your-wow-flashcards/mone-of-ur-wf-monetization-prices/suspend-monetization-popup/suspend-monetization-popup.component';
import { AssignWowDeletePopupComponent } from './assign-wow-flashcards/assign-wow-delete-popup/assign-wow-delete-popup.component';


@NgModule({
  declarations: [
    ManageWowFlashcardsAppComponent,
    YourWowFlashcardsComponent,
    GlobalWowFlashcardsComponent,
    AssignWowFlashcardsComponent,
    MonetizationOfYourWowFlashcardsComponent,
    RecommendedWowFlashcardsComponent,
    PaidGlobalWowFlashcardsComponent,
    YourWowFcTreeViewComponent,
    YourWowFcTableTwoComponent,
    GlobalWfTreeViewComponent,
    MoneOfUrWfMonetizationPricesComponent,
    MoneOfUrWfEarningDetailsComponent,
    MoneEarningDetailsTableTwoComponent,
    RecommendedWfTreeViewComponent,
    YourWfPopupResolveFlagsComponent,
    YourWfPopupRecommendComponent,
    YourWfPopupLinkNewEditComponent,
    PopupViewResolveYwfpComponent,
    GlobalWfPopupRatingComponent,
    GlobalWfPopupFlagComponent,
    PopupMoneMonetizationComponent,
    PopupMoneEarningDetailsComponent,
    PopupMoneEarningHistoryComponent,
    EditGlobalCourseComponent,
    DeletePopupComponent,
    MonetizationPricesTreeViewComponent,
    RecomWfTableTwoComponent,
    UserProfileCardComponent,
    AssignToStudentsPopupComponent,
    AccessPopupComponent,
    AddEditFlashcardsDataComponent,
    AuditTrailDialogComponent,
    AuditTrailComponent,
    HidePopupComponent,
    GlobalCommentsPopupComponent,
    SuspendMonetizationPopupComponent,
    AssignWowDeletePopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManageWowFlashcardsAppRoutingModule,
    NgxStarRatingModule,
    CKEditorModule
  ]
})
export class ManageWowFlashcardsAppModule { }
