import {
  APP_INITIALIZER,
  ApplicationConfig,
  InjectionToken,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './shared/data-access/auth.service';
import { AuthInfo } from './shared/interfaces/auth-info';

const checkAuth = (auth: AuthInfo): boolean => {
  //check if token is still valid
  return true;
};

export const authFactory = (authService: AuthService) => () => {
  const _localUser: AuthInfo = JSON.parse(
    localStorage.getItem('user') || '{}'
  ) as AuthInfo;

  if (checkAuth(_localUser)) {
    authService.SetState(_localUser);
  } else {
    authService.RemoveState();
    localStorage.removeItem('user');
  }

  return authService;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: authFactory,
      multi: true,
      deps: [AuthService],
    },
  ],
};
