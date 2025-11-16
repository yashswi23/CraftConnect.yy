import User from '../models/User.js';
export default async function (req, res, next) {
  try {
    // Ensure user info is available from auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin resource. Access denied.' });
    }
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    res.status(500).send('Server Error');
  }
}
