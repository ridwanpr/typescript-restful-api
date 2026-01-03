import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserRequest } from '../types/user-request';

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(200).json({
        success: true,
        message: 'Register user success',
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const response = await UserService.login(request);

      res.status(200).json({
        success: true,
        message: 'Login success',
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user!);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(req.user!, request);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.logout(req.user!);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
