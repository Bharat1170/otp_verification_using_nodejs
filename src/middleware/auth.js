// // src/middleware/auth.js
// const User = require('../models/user');
// const { verifyToken } = require('../services/jwt');

// /**
//  * Protect routes — expects header: Authorization: Bearer <token>
//  * Attaches req.user = user document (or null if not found)
//  */
// module.exports = async function auth(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization || '';
//     const parts = authHeader.split(' ');
//     if (parts.length !== 2 || parts[0] !== 'Bearer') {
//       return res.status(401).json({ error: 'Missing or malformed token' });
//     }

//     const token = parts[1];
//     const decoded = verifyToken(token);
//     if (!decoded || !decoded.userId) {
//       return res.status(401).json({ error: 'Invalid or expired token' });
//     }

//     // optional: load full user from DB
//     const user = await User.findById(decoded.userId).lean();
//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Auth middleware error:', err && err.message ? err.message : err);
//     return res.status(500).json({ error: 'Auth failed' });
//   }
// };
