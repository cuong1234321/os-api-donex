import { Passport } from 'passport';

const userPassport = new Passport();
const adminPassport = new Passport();

export {
  adminPassport,
  userPassport,
};
