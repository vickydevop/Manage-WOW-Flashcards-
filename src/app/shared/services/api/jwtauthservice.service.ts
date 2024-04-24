/*
https://docs.nestjs.com/providers#services
*/

// import { Injectable } from '@angular/core';

@Injectable()
export class JwtAuthServiceService {}
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError, delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtAuthService {
  return!: string;

  constructor(private route: ActivatedRoute,private jwtService:JwtHelperService) {
    // sessionStorage.setItem('access_token',
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOiI2IiwiY3VzdG9tZXJfaWQiOjEwNSwiY291bnRyeV9jb2RlIjoiaW4iLCJjdXN0b21lcl9zdWJfZG9tYWluX25hbWUiOiJ2ayIsInJlZ2lzdGVyZWRfZWR1Y2F0aW9uYWxfaW5zdGl0dXRpb25fbmFtZSI6ImN2aWNreSIsInRpbWVfem9uZV9pYW5hX3N0cmluZyI6IkFzaWEvS29sa2F0YSIsImFwcF9uYW1lIjoidmsiLCJkZWZhdWx0X2N1cnJlbmN5X3Nob3J0Zm9ybSI6IklOUiIsImFjY291bnRpbmdfc3RhbmRhcmRzX2lkIjowLCJpc19kZWZhdWx0X2FjYWRlbWljX3llYXJfZm9ybWF0X3NwYW5uaW5nX3R3b19jYWxlbmRhcl95ZWFycyI6MSwiZGVmYXVsdF9hY2FkZW1pY195ZWFyX3N0YXJ0X2RhdGVfYW5kX21vbnRoIjoiOS82Iiwic29ja2V0X2lkIjoiIiwidXNlcl9jYXRlZ29yeV90eXBlIjoiMCIsImVkdWNhdGlvbmFsX2luc3RpdHV0aW9uX2NhdGVnb3J5X2lkIjoiNnJjWmcxTWFFT05WU1BaIiwidXNlcl9yZWdpc3RlcmVkX2NhdGVnb3JpZXNfaWRzIjoiVlN5bXNOT2F0cGpGTVhEIiwidXNlcl9yZWdpc3RyYXRpb25fbG9naW5fYXBwcm92YWxfc3RhdHVzIjozLCJjb3VudHJ5IjoiaW4iLCJwaW5fY29kZSI6IjYzNTEwOSIsInN0YXRlX3Byb3ZpbmNlIjoiVGFtaWwgTmFkdSIsImNpdHlfZGlzdHJpY3RfY291bnR5IjoiSG9zdXIiLCJhZGRyZXNzX2xpbmVfMSI6ImtyaXNobmFnaXJpIiwiYWRkcmVzc19saW5lXzIiOiJrcmlzaG5hZ2lyaSIsImN1c3RvbWVyX3R5cGUiOjB9LCJpYXQiOjE3MDY4NzMxOTYsImV4cCI6MTg2Njg3MzE5Nn0.MyFHS0cIGm205wdsar3e2FO83EVkWYnMha7hGIpI3WE'
    //  );
    this.route.queryParams.subscribe(
      (params) => (this.return = params['return'] || '/')
    );
  }

  getJwtToken() {

    let HTTP_OPTIONS = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer '+sessionStorage.getItem('access_token') as any,
      }),
    };

    return HTTP_OPTIONS;
  }

  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }
  decodeJwtToken(jwt_token: string) {
    return this.jwtService.decodeToken(jwt_token);
  }
}
