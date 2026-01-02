import { z, type ZodType } from 'zod';
import type { CreateUserRequest } from '../models/user.model.js';

export class UserValidation {
  static readonly REGISTER: ZodType<CreateUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });
}
