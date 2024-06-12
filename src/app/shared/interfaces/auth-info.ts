import { User } from './user';

export interface AuthInfo {
  access_token?: string;
  tokenType?: string;
  payload?: User;
}
