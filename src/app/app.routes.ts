import { Route } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'posts',
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () =>
      import('./posts/posts.component').then((m) => m.PostsComponent),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
