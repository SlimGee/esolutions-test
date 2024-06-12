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

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  PostService = inject(PostService);
}
