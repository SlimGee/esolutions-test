import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Credentials } from '../interfaces/credentials';
import { AuthInfo } from '../interfaces/auth-info';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type AuthUser = AuthInfo | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://test.esolutions.co.zw/postify-api/auth/login';
  private registerUrl =
    'https://test.esolutions.co.zw/postify-api/auth/register';

  private stateItem: BehaviorSubject<AuthInfo | null> =
    new BehaviorSubject<AuthInfo | null>(null);

  stateItem$: Observable<AuthInfo | null> = this.stateItem.asObservable();

  private state = signal<AuthState>({
    user: null,
  });

  user = computed(() => this.state().user);

  constructor(private http: HttpClient) {
    this.stateItem$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );
  }

  SetState(item: AuthInfo) {
    this.stateItem.next(item);
  }
  RemoveState() {
    this.stateItem.next(null);
  }

  Login(credentials: Credentials): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http
      .post(this.loginUrl, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          const authInfo: AuthInfo = <AuthInfo>response;

          localStorage.setItem('user', JSON.stringify(authInfo));

          this.stateItem.next(response);

          return authInfo;
        })
      );
  }

  checkAuth(authInfo: AuthInfo) {
    return false;
  }

  Register(credentials: Credentials): Observable<any> {
    return this.http.post(this.registerUrl, credentials).pipe(
      map((response) => {
        //do the thing
        return response;
      })
    );
  }
}
