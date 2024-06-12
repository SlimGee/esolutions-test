import { User } from './user';

export interface AuthInfo {
  token?: string;
  tokenType?: string;
  payload?: User;
}
