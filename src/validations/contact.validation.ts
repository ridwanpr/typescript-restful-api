import { z, type ZodType } from 'zod';
import { CreateContactRequest, UpdateContactRequest } from '../models/contact.model';

export class ContactValidation {
  static readonly CREATE: ZodType<CreateContactRequest> = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).nullable().optional(),
    email: z.email().min(1).max(100).nullable().optional(),
    phone: z.string().min(1).max(20).nullable().optional(),
  });
}
