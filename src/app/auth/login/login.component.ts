import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './data-access/login.service';
import { AuthService } from 'src/app/shared/data-access/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public loginService = inject(LoginService);
  public authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    username: [''],
    password: [''],
  });

  loginStatus = this.loginService.status;

  errors = computed(() => this.loginService.errors().errors);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        console.log('loggedin');
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login$.next(this.loginForm.getRawValue());
    }
  }
}
