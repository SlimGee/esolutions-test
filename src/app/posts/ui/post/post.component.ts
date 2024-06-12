import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from 'src/app/shared/interfaces/post';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  post = input.required<Post>();
  @Output() upvote = new EventEmitter<any>();
}
