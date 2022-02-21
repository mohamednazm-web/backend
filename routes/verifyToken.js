// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   //const token = req.header("auth-token");
//   const token = req.cookies.jwt;
//   if (!token) return res.redirect('/login');

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     //res.status(400).send('Invalid Token');
//     res.redirect('/login');
//   }
// };
