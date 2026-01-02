import { prisma } from '../application/database';
import { ResponseError } from '../error/response.error';
import { toUserResponse, type CreateUserRequest, type UserResponse } from '../models/user.model';
import { UserValidation } from '../validations/user.validation';
import { Validation } from '../validations/validation';
import bcrypt from 'bcrypt';

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await prisma.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new ResponseError(400, 'Username already exists');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }
}
