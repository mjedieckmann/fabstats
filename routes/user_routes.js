const express = require("express");
const user_controller = require("../controllers/userController");
const passport = require("passport");
const router = express.Router();
const isAuth = require("../utils/password_utils").isAuth;
const isLoggedIn = require("../utils/password_utils").isLoggedIn

/// USERS ROUTES ///
router.get('/', user_controller.user_list);
// router.get('/:id', user_controller.user_detail);

/// TEAM ROUTES ///
router.get('/teams', function(req, res, next) {
  res.send('respond with all teams');
});
router.get('/teams/:id', function(req, res, next) {
  res.send('respond with a specific team');
});

router.post('/register', user_controller.user_register);

router.post('/login', isLoggedIn,  passport.authenticate('local', { failureRedirect: '/users/login-failure', successRedirect: '/users/login-success' }));

router.get('/protected-route', isAuth, (req, res, next) => {
  res.json({message: 'You made it to the route.'});
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.json({message: 'logout successful'});
  // res.redirect('/users/protected-route');
});

router.get('/login-success', (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/users/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
  res.status(401).json({ message: 'Incorrect username or password.' });
});

router.get('/login', (req, res, next) => {

  const form = '<h1>Login Page</h1><form method="POST" action="/users/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);

});

module.exports = router;
