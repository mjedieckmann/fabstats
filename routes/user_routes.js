const express = require("express");
const user_controller = require("../controllers/userController");
const passport = require("passport");
const team_controller = require("../controllers/teamController");
const router = express.Router();
const isAuth = require("../utils/password_utils").isAuth;
const isLoggedIn = require("../utils/password_utils").isLoggedIn

/// USERS ROUTES ///
router.get('/', user_controller.list_users);
router.get('/current', team_controller.current_team, user_controller.current_user);
router.post('/edit', isAuth, user_controller.edit_user);
router.post('/delete', isAuth, user_controller.delete_user);
router.post('/upload', user_controller.upload_user_avatar);

// AUTHENTICATION ///
router.post('/register', user_controller.register_user);
router.post('/login', isLoggedIn, passport.authenticate('local', { failureRedirect: '/users/login-failure', successRedirect: '/users/current' }));
router.get('/login-failure', user_controller.login_failure);
router.get('/logout', user_controller.logout);
router.post('/forgot', user_controller.forgot_password);
router.post('/reset', user_controller.reset_password);

/// TEAM ROUTES ///
router.get('/teams', team_controller.list_teams);
router.post('/team/create', team_controller.create_team);
router.post('/team/edit', team_controller.edit_team);
router.post('/team/delete', team_controller.delete_team);

module.exports = router;
