import jwt from "jsonwebtoken";

export const generateAccessToken = async (foundUser, res) => {
//   console.log("[generate access token] FOUND (logged in) USER?", foundUser);
  
  const secureCookieOptions = {
    httpOnly: true, //accessible only by web server
    secure: process.env.NODE_ENV !== "development", // secure: true, //https
    // sameSite: 'strict', // Prevent CSRF attacks
    sameSite: "none", // Cross site cookie
    maxAge: Date.now() + process.env.JWT_MAX_AGE * 24 * 60 * 60 * 1000,
  };
// console.log("[generate access token] secureCookieOptions.secure", secureCookieOptions.secure)
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
        "roles": foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: '15s' }
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    // { expiresIn: '5m' }
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  
  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, secureCookieOptions);

  // Send accessToken containing username and roles
  return accessToken;
};
