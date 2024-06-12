import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';
import { PostService } from '../shared/data-access/post.service';
import { PostListComponent } from './ui/post-list/post-list.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, PostListComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }
}
