import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, retry } from 'rxjs';
import { Post } from '../interfaces/post';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface PostState {
  posts: Post[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'https://test.esolutions.co.zw/postify-api/posts';

  private authService = inject(AuthService);

  private stateItem: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  stateItem$: Observable<Post[]> = this.stateItem.asObservable();

  posts$ = this.getPosts().pipe(retry({}));

  private state = signal<PostState>({
    posts: [],
    error: null,
  });

  posts = computed(() => this.state().posts);

  error = computed(() => this.state().error);

  constructor(private http: HttpClient) {
    this.posts$.pipe(takeUntilDestroyed()).subscribe((posts) =>
      this.state.update((state) => ({
        ...state,
        posts,
      }))
    );
  }

  getPosts() {
    const headers = new HttpHeaders({
      Authorization: `Bearer  ${this.authService.user()?.access_token}`,
    });

    return this.http.get(this.baseUrl, { headers }).pipe(
      map((response) => {
        this.stateItem.next(<Post[]>response);
        return <Post[]>response;
      })
    ) as Observable<Post[]>;
  }

  upVote(id: number) {
    console.log(this.authService.user());
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user()?.access_token}`,
    });

    return this.http
      .put(`${this.baseUrl}/${id}/upvote`, {}, { headers })
      .pipe(map((response) => response))
      .subscribe(() => {
        //this will need to be refactored to update the upvote count of the post
        //but for now we will just refresh the posts
        this.posts$.subscribe((posts) =>
          this.state.update((state) => ({
            ...state,
            posts,
          }))
        );
      });
  }
}
