import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtAuthService } from './jwtauthservice.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  customer_id: any;
  country_no: any;

  private httpClient: HttpClient;

  constructor(private http: HttpClient,private _jwtAuthService: JwtAuthService, private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }
  // CheckAndCreateAllTables 
  CheckAndCreateAllTables(): Observable<any> {
    return this.http.get<any>(
      `${environment.CheckAndCreateAllTables}`,this._jwtAuthService.getJwtToken()
    )
  }
  // Your WOW FlashCards 
  relevant_syllabus_of_your_interest(): Observable<any> {
    return this.http.get<any>(
      `${environment.relevant_syllabus_of_your_interest}`,this._jwtAuthService.getJwtToken()
    )
  }

  get_tree_view_based_on_above_selected_id(get_tree_view_data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.get_tree_view_based_on_above_selected_id}`,get_tree_view_data,this._jwtAuthService.getJwtToken()
    )
  }

  GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  GetHiddenWOWFlashcardsOrUpdateHide(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.GetHiddenWOWFlashcardsOrUpdateHide}`,data,this._jwtAuthService.getJwtToken()
    )
  }
  // Resolved flags 
  GetDataBasedOnGlobalWowFlashcardsResolvedFlags(global_wow_flashcards_id:number): Observable<any> {
    return this.http.get<any>(
      `${environment.GetDataBasedOnGlobalWowFlashcardsResolvedFlags}?global_wow_flashcards_id=${global_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  InsertOrUpdateResolveFlag(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.InsertOrUpdateResolveFlag}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  // Recommend 
  GetRecommendTeachingFacultyUsers(): Observable<any> {
    return this.http.get<any>(
      `${environment.GetRecommendTeachingFacultyUsers}`,this._jwtAuthService.getJwtToken()
    )
  }
  GetRecommendTeachingRegisteredUsers(user_category_id:string,is_global_wow_flashcards:number,global_wow_flashcards_id:number,institutional_wow_flashcards_id:number): Observable<any> {
    return this.http.get<any>(
      `${environment.GetRecommendTeachingRegisteredUsers}?user_category_id=${user_category_id}&is_global_wow_flashcards=${is_global_wow_flashcards}&global_wow_flashcards_id=${global_wow_flashcards_id}&institutional_wow_flashcards_id=${institutional_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  InsertOrUpdateRecommendTeachingFacultyUsers(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.InsertOrUpdateRecommendTeachingFacultyUsers}`,data,this._jwtAuthService.getJwtToken()
    )
  }
  // List of Courses / Subjects linked to WOW FlashCards 
  List_of_Linked_Syllabus_BasedOn_Wow_flashcards(institutional_wow_flashcards_id:Number): Observable<any> {
    return this.http.get<any>(
      `${environment.List_of_Linked_Syllabus_BasedOn_Wow_flashcards}?institutional_wow_flashcards_id=${institutional_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  ListOfLinedSyllabusSharedAndUnShared(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.ListOfLinedSyllabusSharedAndUnShared}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  ListOfLinedSyllabusLinkNewRelevantSyllabus(institutional_wow_flashcards_id:Number): Observable<any> {
    return this.http.get<any>(
      `${environment.ListOfLinedSyllabusLinkNewRelevantSyllabus}?institutional_wow_flashcards_id=${institutional_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  ListOfLinedSyllabusEditLinkRelevantSyllabus(course_subject_id:string,institutional_wow_flashcards_id:string,is_global:boolean): Observable<any> {
    return this.http.get<any>(
      `${environment.ListOfLinedSyllabusEditLinkRelevantSyllabus}?course_subject_id=${course_subject_id}&institutional_wow_flashcards_id=${institutional_wow_flashcards_id}&is_global=${is_global}`,this._jwtAuthService.getJwtToken()
    )
  }

  ListOfLinkedSyllabusAddAndUpdate(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.ListOfLinkedSyllabusAddAndUpdate}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  ListOfLinkedSyllabusRemove(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.ListOfLinkedSyllabusRemove}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  //*--------------------------------------- Global WOW FlashCards -----------------------------------------------------------*//
  GetTableDataBasedOnRelevantSyllabusAndSyllabusId(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.GetTableDataBasedOnRelevantSyllabusAndSyllabusId}`,data,this._jwtAuthService.getJwtToken()
    )
  }
  // rating popup 
  InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating(global_wow_flashcards_id:any,rating_value:any): Observable<any> {
    return this.http.post<any>(
      `${environment.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating}?global_wow_flashcards_id=${global_wow_flashcards_id}&rating_value=${rating_value}`,'',this._jwtAuthService.getJwtToken()
    )
  }

  InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  /*------------------------------------Assign WOW FlashCards to Your Students------------------------------------------------ */
  getUsersSubjectsCourseAssignedToYou(): Observable<any> {
    return this.http.get<any>(
      `${environment.getUsersSubjectsCourseAssignedToYou}`,this._jwtAuthService.getJwtToken()
    )
  }

  GetTableDataBasedOnCourseSubjectUserCategoryAllocationId(course_subject_user_category_allocation_id:number): Observable<any> {
    return this.http.get<any>(
      `${environment.GetTableDataBasedOnCourseSubjectUserCategoryAllocationId}?course_subject_user_category_allocation_id=${course_subject_user_category_allocation_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  UpdateSelectedAllocationIdField(course_subject_user_category_allocation_id:number,wow_class_stream_reference_id:number,is_removed:number): Observable<any> {
    return this.http.post<any>(
      `${environment.UpdateSelectedAllocationIdField}?course_subject_user_category_allocation_id=${course_subject_user_category_allocation_id}&wow_class_stream_reference_id=${wow_class_stream_reference_id}&is_removed=${is_removed}`,'',this._jwtAuthService.getJwtToken()
    )
  }

  /*--------------------------------Monetization of Your WOW FlashCards ---------------------------------------------------------*/
  Get_Monetization_Of_Your_Wow_flashcards_List_Based_On_Subject_Ids(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.Get_Monetization_Of_Your_Wow_flashcards_List_Based_On_Subject_Ids}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices(institutional_wow_flashcards_id:number): Observable<any> {
    return this.http.get<any>(
      `${environment.ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices}?institutional_wow_flashcards_id=${institutional_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  /*-------------------------------- Earnings Details ---------------------------------------------------------*/
  Get_All_Earning_Details_List_Based_On_Subject_Ids(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.Get_All_Earning_Details_List_Based_On_Subject_Ids}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails(institutional_wow_flashcards_id:number,from_date:string,to_date:string): Observable<any> {
    return this.http.get<any>(
      `${environment.GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails}?institutional_wow_flashcards_id=${institutional_wow_flashcards_id}&from_date=${from_date}&to_date${to_date}`,this._jwtAuthService.getJwtToken()
    )
  }

  /*---------------------------------------Recommended WOW FlashCards from other Teaching Faculty--------------------------------*/
  GetAllRecommendedWowResourcesListBasedOnLoginId(): Observable<any> {
    return this.http.get<any>(
      `${environment.GetAllRecommendedWowResourcesListBasedOnLoginId}`,this._jwtAuthService.getJwtToken()
    )
  }

  GetAllCourseSubjectsBasedOnWowFlashcardsId(institutional_wow_flashcards_id:number): Observable<any> {
    return this.http.get<any>(
      `${environment.GetAllCourseSubjectsBasedOnWowFlashcardsId}?institutional_wow_flashcards_id=${institutional_wow_flashcards_id}`,this._jwtAuthService.getJwtToken()
    )
  }

  GetSyllabusIdBasedOnSubjectIdAndFlashcardsId(data:any): Observable<any> {
    return this.http.post<any>(
      `${environment.GetSyllabusIdBasedOnSubjectIdAndFlashcardsId}`,data,this._jwtAuthService.getJwtToken()
    )
  }

  /*---------------------------------------Your Paid Global WOW FlashCards--------------------------------*/
  GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId(): Observable<any> {
    return this.http.get<any>(
      `${environment.GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId}`,this._jwtAuthService.getJwtToken()
    )
  }

  /*-------------------------------------GEt All wow Flashcards -----------------------------------------------*/
  GetAllWowFlashcards(): Observable<any> {
    return this.http.get<any>(
      `${environment.GetAllWowFlashcards}`,this._jwtAuthService.getJwtToken()
    )
  }
    /*-------------------------------------GEt All Monetization Prices-----------------------------------------------*/
    GetAllMonetizationOfYourWowFlashcards(): Observable<any> {
      return this.http.get<any>(
        `${environment.GetAllMonetizationOfYourWowFlashcards}`,this._jwtAuthService.getJwtToken()
      )
    }
    /*-------------------------------------GEt All Earning Details-----------------------------------------------*/
    GetAllEarningDetailsOfGlobalWowFlashcards(): Observable<any> {
      return this.http.get<any>(
        `${environment.GetAllEarningDetailsOfGlobalWowFlashcards}`,this._jwtAuthService.getJwtToken()
      )
    }

    /*----------------------------CreateTokenBasedOnResponse ---------------------------------------------------------*/
    CreateTokenBasedOnResponse(data:any): Observable<any> {
      return this.http.post<any>(
        `${environment.CreateTokenBasedOnResponse}`,data,this._jwtAuthService.getJwtToken()
      )
    }
    /*-----------------------------Audit Trail -----------------------------------------------------------------------*/
    GetAuditTrail(data:any): Observable<any> {
      return this.http.post<any>(
        `${environment.GetAuditTrail}`,data,this._jwtAuthService.getJwtToken()
      )
    }
}
