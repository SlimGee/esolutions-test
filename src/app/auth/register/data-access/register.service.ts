import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private authService = inject(AuthService);

  error$ = new Subject<any>();

  createUser$ = new Subject<Credentials>();

  // state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.Register(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  constructor() {
    // reducers
    this.userCreated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'success' }))
      );

    this.createUser$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'creating' }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'error' }))
      );
  }
}
