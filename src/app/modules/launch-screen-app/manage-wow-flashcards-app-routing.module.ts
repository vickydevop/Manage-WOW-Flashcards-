import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageWowFlashcardsAppComponent } from './manage-wow-flashcards-app/manage-wow-flashcards-app.component';
import { YourWowFlashcardsComponent } from './your-wow-flashcards/your-wow-flashcards.component';
import { GlobalWowFlashcardsComponent } from './global-wow-flashcards/global-wow-flashcards.component';
import { MonetizationOfYourWowFlashcardsComponent } from './monetization-of-your-wow-flashcards/monetization-of-your-wow-flashcards.component';
import { AssignWowFlashcardsComponent } from './assign-wow-flashcards/assign-wow-flashcards.component';
import { RecommendedWowFlashcardsComponent } from './recommended-wow-flashcards/recommended-wow-flashcards.component';
import { PaidGlobalWowFlashcardsComponent } from './paid-global-wow-flashcards/paid-global-wow-flashcards.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-wow-flashcards-app',
    pathMatch: 'full',
  },
  {
    path: 'manage-wow-flashcards-app',
    component: ManageWowFlashcardsAppComponent,
    children: [
      { path: '', redirectTo: 'your-wow-flashcards', pathMatch: 'full' },
      { path: 'your-wow-flashcards', component: YourWowFlashcardsComponent },
      { path: 'global-wow-flashcards', component: GlobalWowFlashcardsComponent },
      { path: 'assign-wow-flashcards', component: AssignWowFlashcardsComponent },
      { path: 'monetization-of-your-wow-flashcards', component: MonetizationOfYourWowFlashcardsComponent },
      { path: 'recommended-wow-flashcards', component: RecommendedWowFlashcardsComponent },
      { path: 'paid-global-wow-flashcards', component: PaidGlobalWowFlashcardsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageWowFlashcardsAppRoutingModule {}
