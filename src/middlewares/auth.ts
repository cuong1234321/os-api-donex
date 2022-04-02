import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import UserModel from '@models/users';

export const authGuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const payload: any = jwt.verify(token, settings.jwt.userSecret);
    if (payload) {
      const user = await UserModel.findByPk(payload.id);
      req.currentUser = user;
      next(null);
    }
  } catch (error) {
    next();
  }
};
