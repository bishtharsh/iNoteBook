import jwt from "jsonwebtoken";

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  //console.log("Token from cookies:", token); Log token value for debugging
  if (!token) {
    return res.status(201).send({
      status: 'error',
      message: "Access denied. No token provided."
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(201).send({
      status: 'error',
      message: "Invalid or expired token."
    });
  }
};

export const getToken = (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      //console.log("Token from cookies 1:", token);
      return res.status(202).send({ status: 'success', token });
    }console.log(token);
    
    return res.status(201).send({ status: 'error', message: 'No token provided' });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: "Invalid or expired token."
    });
  }
};

