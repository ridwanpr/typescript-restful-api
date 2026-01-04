import { Response, NextFunction } from 'express';
import { UserRequest } from '../types/user-request';
import { CreateContactRequest } from '../models/contact.model';
import { ContactService } from '../services/contact.service';
import { ResponseError } from '../error/response.error';

export class ContactController {
  static async create(
    req: UserRequest<CreateContactRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ContactService.create(req.user!, req.body);

      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(
    req: UserRequest<any, { contactId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const contactId = Number(req.params.contactId);
      
      if (isNaN(contactId)) {
        throw new ResponseError(400, 'Invalid contact ID format');
      }

      const response = await ContactService.get(req.user!, contactId);

      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
