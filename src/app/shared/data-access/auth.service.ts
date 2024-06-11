import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Credentials } from '../interfaces/credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://test.esolutions.co.zw/postify-api/auth/login';
  private registerUrl =
    'https://test.esolutions.co.zw/postify-api/auth/register';
  constructor(private http: HttpClient) {}

  Login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      map((response) => {
        //do the thing
        return response;
      })
    );
  }

  Register(credentials: Credentials) {
    return this.http.post(this.registerUrl, credentials).pipe(
      map((response) => {
        //do the thing
        return response;
      })
    );
  }
}
