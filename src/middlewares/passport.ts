import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import settings from '@configs/settings';
import AdminModel from '@models/admins';
import UserModel from '@models/users';
import CollaboratorModel from '@models/collaborators';

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
const sellerOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('accessToken'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.sellerSecret,
  passReqToCallback: true,
};
const adminPassport = new Passport();
const userPassport = new Passport();
const sellerPassport = new Passport();

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

const sellerStrategy = new Strategy(sellerOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    const seller = await CollaboratorModel.scope([
      { method: ['byStatus', CollaboratorModel.STATUS_ENUM.ACTIVE] },
      'withDefaultRank',
      'withCurrentRank',
    ]).findByPk(payload.id);
    if (seller) {
      req.currentSeller = seller;
      next(null, seller);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

adminPassport.use(adminStrategy);
userPassport.use(userStrategy);
sellerPassport.use(sellerStrategy);

export {
  adminPassport,
  userPassport,
  sellerPassport,
};
