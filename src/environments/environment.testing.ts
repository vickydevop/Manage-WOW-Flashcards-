let baseURL:any = 'https://u34api.getwow.community/api/';
export const environment = {
  production: true,
// * ----------------------- ceph -----------------------* //
ceph_URL: 'https://cephapi.getwow.biz/api/storage/',
// *------------------- CheckAndCreateAllTables ----------------------------*//
CheckAndCreateAllTables:baseURL+'your-wow-flashcards/check-and-create-all-flashcards-table',
// *------------------- Your WOW FlashCards ----------------------------*//
relevant_syllabus_of_your_interest:baseURL+'your-wow-flashcards/get-all-relevant-syllabus-of-your-interest-from',
get_tree_view_based_on_above_selected_id:baseURL+'your-wow-flashcards/get-tree-view-based-on-above-selected-id',
GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId:baseURL+'your-wow-flashcards/get-table-data-based-on-above-selected-relevant-syllabus-and-syllabus-id',
GetHiddenWOWFlashcardsOrUpdateHide:baseURL+'your-wow-flashcards/get-hidden-wow-flashcards-or-update-hide',
// *------------------- Resolved flags ----------------------------*//
GetDataBasedOnGlobalWowFlashcardsResolvedFlags:baseURL+'your-wow-flashcards/get-data-based-on-global-wow-flashcards-resolve-flags',
InsertOrUpdateResolveFlag:baseURL+'your-wow-flashcards/insert-or-update-resolve-flag',
// *------------------- Recommend ----------------------------*//
GetRecommendTeachingFacultyUsers:baseURL+'your-wow-flashcards/get-recommend-popup-teaching-faculty-user',
GetRecommendTeachingRegisteredUsers:baseURL+'your-wow-flashcards/get-recommend-popup-registered-users',
InsertOrUpdateRecommendTeachingFacultyUsers:baseURL+'your-wow-flashcards/insert-or-update-recommend-teaching-faculty-users',
// *------------------- List of Courses / Subjects linked to WOW FlashCards ----------------------------*//
List_of_Linked_Syllabus_BasedOn_Wow_flashcards:baseURL+'your-wow-flashcards/list-of-linked-syllabus-based-on-wow-flashcards',
ListOfLinedSyllabusSharedAndUnShared:baseURL+'your-wow-flashcards/list-of-linked-syllabus-shared-and-unshared',
ListOfLinedSyllabusLinkNewRelevantSyllabus:baseURL+'your-wow-flashcards/list-of-linked-syllabus-link-new-relevant-syllabus',
ListOfLinedSyllabusEditLinkRelevantSyllabus:baseURL+'your-wow-flashcards/list-of-linked-syllabus-edit-link-popup-relevant-syllabus',
ListOfLinkedSyllabusAddAndUpdate:baseURL+'your-wow-flashcards/list-of-linked-syllabus-add-and-edit-link-popup',
ListOfLinkedSyllabusRemove:baseURL+'your-wow-flashcards/list-of-linked-syllabus-remove',
//*--------------------------------------- Global WOW FlashCards -----------------------------------------------------------*//
GetTableDataBasedOnRelevantSyllabusAndSyllabusId:baseURL+'global-wow-flashcards/get-table-data-based-on-relevant-syllabus-and-syllabus-id',
// *------------------- Rating ----------------------------*//
InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating:baseURL+'global-wow-flashcards/insert-or-update-based-on-global-wow-flashcard-id-rating',
InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag:baseURL+'global-wow-flashcards/insert-or-update-based-on-global-wow-flashcard-id-flag',
/*------------------------------------Assign WOW FlashCards to Your Students------------------------------------------------ */
getUsersSubjectsCourseAssignedToYou:baseURL+'assign-wow-flashcards-to-students/get-users-subjects-course-assigned-to-you',
GetTableDataBasedOnCourseSubjectUserCategoryAllocationId:baseURL+'assign-wow-flashcards-to-students/get-table-data-based-on-course-subject-user-category-allocation-id',
UpdateSelectedAllocationIdField:baseURL+'assign-wow-flashcards-to-students/update-selected-allocation-id-field',
/*------------------------------------Monetization of Your WOW FlashCards--------------------------------------------------- */
Get_Monetization_Of_Your_Wow_flashcards_List_Based_On_Subject_Ids:baseURL+'monetization-of-your-wow-flashcards/get-monetization-of-your-wow-flashcards-list-based-on-subject-ids',
InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices:baseURL+'monetization-of-your-wow-flashcards/insert-or-update-monetization-of-your-wow-flashcards-monetization-prices',
/*------------------------------------Earnings Details--------------------------------------------------- */
ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices:baseURL+'monetization-of-your-wow-flashcards/view-monetization-history-of-your-wow-flashcards-monetization-prices',
Get_All_Earning_Details_List_Based_On_Subject_Ids:baseURL+'monetization-of-your-wow-flashcards/get-all-earning-details-list-based-on-subject-ids-from-earning-details',
GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails:baseURL+'monetization-of-your-wow-flashcards/get-all-earning-details-list-based-on-between-date-from-earning-details',
/*---------------------------------------Recommended WOW FlashCards from other Teaching Faculty--------------------------------*/
GetAllRecommendedWowResourcesListBasedOnLoginId:baseURL+'recommended-wow-flashcards-from-other-teaching-faculty/get-all-recommended-wow-resources-list-based-on-login-user-id',
GetAllCourseSubjectsBasedOnWowFlashcardsId:baseURL+'recommended-wow-flashcards-from-other-teaching-faculty/get-all-course-subjects-based-on-institutional-wow-flashcards-id',
GetSyllabusIdBasedOnSubjectIdAndFlashcardsId:baseURL+'recommended-wow-flashcards-from-other-teaching-faculty/get-syllabus-id-based-on-subject-ids-and-flashcards-id',
/*---------------------------------------Your Paid Global WOW FlashCards--------------------------------*/
GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId:baseURL+'your-paid-global-wow-flashcards/get-all-recommended-wow-global-flashcards-list-based-on-login-user-id',
/*-------------------------------------Get All wow Flashcards -----------------------------------------------*/
GetAllWowFlashcards:baseURL+'your-wow-flashcards/get-all-wow-flashcards',
/*-------------------------------------GEt All Monetization Prices-----------------------------------------------*/
GetAllMonetizationOfYourWowFlashcards:baseURL+'monetization-of-your-wow-flashcards/get-all-monetization-of-your-wow-flashcards',
/*-------------------------------------GEt All Earning Details-----------------------------------------------*/
GetAllEarningDetailsOfGlobalWowFlashcards:baseURL+'monetization-of-your-wow-flashcards/get-all-earning-details-of-global-wow-flashcards',
/*----------------------------CreateTokenBasedOnResponse ---------------------------------------------------------*/
CreateTokenBasedOnResponse:baseURL+'authentication/create-token-based-on-response',
/*----------------------------Audit Trail-------------------------------------------------------------------------- */
 GetAuditTrail:baseURL+'your-wow-flashcards/get-all-audit-trail-values-based-on-responses'
};
