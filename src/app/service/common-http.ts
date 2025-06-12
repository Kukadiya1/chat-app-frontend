import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse, LoginFormRequest, RegisterFormRequest, UserList } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class CommonHttp {
  baseUrl: string = 'https://chat-app-backend-nh9c.onrender.com/api/';
  constructor(private http: HttpClient) { }

  register(reqBody: RegisterFormRequest): Observable<CommonResponse<{ token: string }>> {
    return this.http.post<CommonResponse<{ token: string }>>(`${this.baseUrl}register`, reqBody);
  }

  login(reqBody: LoginFormRequest): Observable<CommonResponse<any>> {
    return this.http.post<CommonResponse<any>>(`${this.baseUrl}login`, reqBody);
  }

  get_user(): Observable<CommonResponse<UserList[]>> {
    return this.http.get<CommonResponse<UserList[]>>(`${this.baseUrl}get_user`, {
      headers: {
        authorization: `Berear ${sessionStorage.getItem('token')}`
      }
    });
  }

}
