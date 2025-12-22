import jwt from 'jsonwebtoken';
export default function (req, res, next) {
  //header se token obtain karo
  const token = req.header('x-auth-token');
  //agar token nai hai error message begho
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  //token verify karo
  try {
    const decoded = jwt.verify(token, 'hamariSuperSecretKey123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
