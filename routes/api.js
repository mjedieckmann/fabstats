const express = require('express');
const router = express.Router();

// Require controller modules.
const format_controller = require('../controllers/formatController');
const event_controller = require('../controllers/eventController');
const meta_controller = require('../controllers/metaController');
const to_controller = require('../controllers/toController');
const hero_controller = require('../controllers/heroController');
const match_controller = require('../controllers/matchController');
const {isAuth} = require("../utils/password_utils");
const {isMatchCreator, isEventCreator, isToCreator} = require("../controllers/userController");

/// HEROES ROUTES ///
router.get('/heroes', hero_controller.hero_list);
router.get('/hero/:id', hero_controller.hero_detail);

/// MATCHES ROUTES ///
router.get('/matches', match_controller.match_list);
router.get('/match/:id', match_controller.match_detail);
router.post('/match/create', isAuth, match_controller.create_match);
router.post('/match/edit', isAuth, isMatchCreator, match_controller.edit_match);
router.post('/match/delete', isAuth, isMatchCreator, match_controller.delete_match);

/// FORMAT ROUTES ///
router.get('/formats', format_controller.format_list);
router.get('/format/:id', format_controller.format_detail);

/// EVENT ROUTES ///
router.get('/events', event_controller.event_list);
router.post('/event/create', isAuth, event_controller.create_event);
router.post('/event/edit', isAuth, isEventCreator, event_controller.edit_event);
router.post('/event/delete', isAuth, isEventCreator, event_controller.delete_event);

/// TO ROUTES ///
router.get('/tos', to_controller.to_list);
router.post('/to/create', isAuth, to_controller.create_to);
router.post('/to/edit', isAuth, isToCreator, to_controller.edit_to);
router.post('/to/delete', isAuth, isToCreator, to_controller.delete_to);


/// META CHANGES ROUTE ///
router.get('/metas', meta_controller.meta_list);

module.exports = router;
