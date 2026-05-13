import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  const userPayload = user.toObject ? user.toObject() : { ...user };
  delete userPayload.password;
  delete userPayload.resetPasswordToken;
  delete userPayload.resetPasswordExpire;

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge:
        Number(process.env.JWT_COOKIE_EXPIRES_IN || 1) * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      token,
      user: userPayload,
    });
};
