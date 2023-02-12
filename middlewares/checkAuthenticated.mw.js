const checkAuthenticated = (req, res, next) => {
  // If user is not logged in
  if (!req.user) {
    if (['', '/', '/login', '/signup'].includes(req.originalUrl)) return next();
    // Redirect user to login page
    return res.redirect('/');
  }

  // User is logged in
  if (['', '/', '/login', '/signup'].includes(req.originalUrl))
    return res.redirect('/homepage');
  return next();
};

module.exports = checkAuthenticated;
