import { Error, ValidationErrorItem } from 'sequelize';

class CustomError extends Error {
  public path: string
  constructor (message: string, path?: string) {
    super(message);
    this.path = path;
  }
}

export const FailValidation = (errors: ValidationErrorItem[]) => {
  const messages: any = {};
  errors.forEach((error) => {
    const path = (error.original as CustomError)?.path || error.path;
    const message = (error.original as CustomError)?.message || error.message;
    messages[path] ||= [];
    messages[path].push(message);
  });
  return {
    code: 120,
    messages,
  };
};

export const NoData = {
  code: 8,
  message: 'No data available',
};

export const InternalError = {
  code: 131,
  message: 'Internal error',
};

export const BadAuthentication = {
  code: 215,
  message: 'Bad authentication data',
};

export const MemberNotFound = {
  code: 301,
  message: 'Entered member code is invalid',
};

export const FileIsNotSupport = {
  code: 305,
  message: 'The file is not in the required format',
};

export const AccountNotActive = {
  code: 410,
  message: 'Account not active',
};

export const InvalidOtp = {
  code: 420,
  message: 'Invalid OTP',
};

export const InvalidPassword = {
  code: 425,
  message: 'invalid password',
};

export const invalidParameter = {
  code: 415,
  message: 'invalid parameter',
};

export const alreadyFavoriteProduct = {
  code: 435,
  message: 'you already favorite this product',
};

export const RequestDiscountInvalid = {
  code: 440,
  message: 'Your request discount order is invalid',
};
