import { prisma } from '../application/database';
import { ResponseError } from '../error/response.error';
import { User } from '../generated/prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from '../models/contact.model';
import { ContactValidation } from '../validations/contact.validation';
import { Validation } from '../validations/validation';

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const newContact = {
      first_name: createRequest.first_name,
      last_name: createRequest.last_name ?? null,
      email: createRequest.email ?? null,
      phone: createRequest.phone ?? null,
      username: user.username,
    };

    const contact = await prisma.contact.create({
      data: newContact,
    });

    return toContactResponse(contact);
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await prisma.contact.findUnique({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!contact) throw new ResponseError(404, 'Contact not found');

    return toContactResponse(contact);
  }
}
