import { Injectable } from "@angular/core";

Injectable({providedIn:'root'})
export class CommonService {
    isNotNull(value:any){
        if(![undefined,null,'undefined','null'].includes(value)){
            return true
        }
        return false;
    }
}