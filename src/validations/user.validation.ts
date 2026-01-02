import { z, type ZodType } from 'zod';
import type { CreateUserRequest } from '../models/user.model.js';

export class UserValidation {
  static readonly REGISTER: ZodType<CreateUserRequest> = z.object({
    username: z
      .string({ message: 'Username is required' })
      .min(1, { message: 'Username cannot be empty' })
      .max(100, { message: 'Username must be less than 100 characters' }),
    password: z
      .string({ message: 'Password is required' })
      .min(1, { message: 'Password cannot be empty' })
      .max(100, { message: 'Password must be less than 100 characters' }),
    name: z
      .string({ message: 'Name is required' })
      .min(1, { message: 'Name cannot be empty' })
      .max(100, { message: 'Name must be less than 100 characters' }),
  });
}
