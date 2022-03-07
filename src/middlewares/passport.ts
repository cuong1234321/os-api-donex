import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import settings from '@configs/settings';
import AdminModel from '@models/admins';
import UserModel from '@models/users';

const adminOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('accessToken'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.adminSecret,
  passReqToCallback: true,
};
const userOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('accessToken'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.userSecret,
  passReqToCallback: true,
};
const adminPassport = new Passport();
const userPassport = new Passport();

const adminStrategy = new Strategy(adminOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    const admin = await AdminModel.scope([
      { method: ['byStatus', AdminModel.STATUS_ENUM.ACTIVE] },
    ]).findByPk(payload.id);
    if (admin) {
      req.currentAdmin = admin;
      next(null, admin);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

const userStrategy = new Strategy(userOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    const user = await UserModel.scope([
      { method: ['byStatus', UserModel.STATUS_ENUM.ACTIVE] },
    ]).findByPk(payload.id);
    if (user) {
      req.currentUser = user;
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

adminPassport.use(adminStrategy);
userPassport.use(userStrategy);

export {
  adminPassport,
  userPassport,
};
