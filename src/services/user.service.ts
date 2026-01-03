import { prisma } from '../application/database';
import { ResponseError } from '../error/response.error';
import { User } from '../generated/prisma/client';
import {
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  type CreateUserRequest,
  type UserResponse,
} from '../models/user.model';
import { UserValidation } from '../validations/user.validation';
import { Validation } from '../validations/validation';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

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

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prisma.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, 'Username or Password is wrong');
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
      throw new ResponseError(401, 'Username or Password is wrong');
    }

    user = await prisma.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: crypto.randomBytes(32).toString('hex'),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prisma.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }

  static async logout(user: User): Promise<UserResponse> {
    const result = await prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return toUserResponse(result);
  }
}
