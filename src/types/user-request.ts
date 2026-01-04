import { Request } from 'express';
import { User } from '../generated/prisma/client';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface UserRequest<
  Body = any,
  Params = ParamsDictionary,
  Query = ParsedQs
> extends Request<Params, any, Body, Query> {
  user?: User;
}
