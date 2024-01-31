import jwt from 'jsonwebtoken';

  export const generateAccessToken = async (foundUser, res) => {
    console.log("FOUND???" , foundUser)
    const secureCookieOptions = {
      httpOnly: true, //accessible only by web server 
      secure: process.env.NODE_ENV !== 'development', // secure: true, //https
      // sameSite: 'strict', // Prevent CSRF attacks
      sameSite: 'none', // Cross site cookie
      maxAge: Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000    
  }

  const accessToken = jwt.sign(
    {
        "UserInfo": {
            "username": foundUser.username,
            "role": foundUser.role
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: '15s' }
    { expiresIn: '50m' }
)

const refreshToken = jwt.sign(
    { "username": foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    // { expiresIn: '5m' }
    { expiresIn: '7d' }
)

// Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, secureCookieOptions)

    // Send accessToken containing username and roles 
    return accessToken 
};
