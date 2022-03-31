import { ROLE } from '../user/entities/user.role';
import { Request } from 'express';

export interface UserDecoded {
  userId: string;
  role: ROLE;
}

export interface IUserDecoded extends Request {
  user: UserDecoded;
}
