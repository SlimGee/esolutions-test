import { User } from './user';

export interface Post {
  title: string;
  content: string;
  published?: boolean;
  createdAt?: Date;
  ownerId?: number;
  owner?: User;
  votes?: number;
  id: number;
}
