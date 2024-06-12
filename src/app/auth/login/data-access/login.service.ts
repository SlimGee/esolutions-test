import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authService = inject(AuthService);

  error$ = new Subject<any>();

  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.Login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  public errors = signal<any>({
    errors: {},
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    // reducers
    this.userAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'success' }))
      );

    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'authenticating' }))
      );

    this.error$.pipe(takeUntilDestroyed()).subscribe((response) => {
      this.state.update((state) => ({ ...state, status: 'error' }));
      if (response.error) {
        const sensibleErrors = response.error.detail.reduce(
          (acc: any, current: any) => {
            return { ...acc, [current.loc.slice(-1)]: current.msg };
          },
          {}
        );

        this.errors.update(() => {
          return { errors: { ...sensibleErrors } };
        });
      }
    });
  }
}
