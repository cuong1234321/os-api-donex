
interface PhoneNumberVerifyOtpsInterface {
  id: number,
  otp: string,
  phoneNumber: string,
  otpExpiresAt: Date,
  verifyToken: string,
  createdAt?: Date,
  updatedAt?: Date,
};

export default PhoneNumberVerifyOtpsInterface;
