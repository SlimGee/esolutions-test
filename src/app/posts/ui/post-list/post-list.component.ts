import {
  Component,
  OnInit,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from 'src/app/shared/interfaces/post';
import { PostComponent } from '../post/post.component';
import { PostService } from 'src/app/shared/data-access/post.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  PostService = inject(PostService);

  private fb = inject(FormBuilder);

  createPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  posts = this.PostService.posts;

  onSubmit() {
    if (this.createPostForm.valid) {
      this.PostService.createPost$.next(this.createPostForm.getRawValue());
    }
  }
}
