/**
 * Routes that handle requests from the frontend client.
 * They all represent interactions with the database.
 */

const express = require('express');
const router = express.Router();

const format_controller = require('../controllers/formatController');
const event_controller = require('../controllers/eventController');
const meta_controller = require('../controllers/metaController');
const to_controller = require('../controllers/toController');
const hero_controller = require('../controllers/heroController');
const match_controller = require('../controllers/matchController');
const {isAuth} = require("../utils/password_utils");

/// HEROES ROUTES ///
router.get('/heroes', hero_controller.list_heroes);

/// MATCHES ROUTES ///
router.get('/matches', match_controller.list_matches);
router.get('/match/:id', match_controller.get_match);
router.post('/match/create', isAuth, match_controller.create_match);
router.post('/match/edit', isAuth, match_controller.isMatchCreator, match_controller.edit_match);
router.post('/match/delete', isAuth, match_controller.isMatchCreator, match_controller.delete_match);

/// FORMAT ROUTES ///
router.get('/formats', format_controller.list_formats);

/// EVENT ROUTES ///
router.get('/events', event_controller.list_events);
router.post('/event/create', isAuth, event_controller.create_event);
router.post('/event/edit', isAuth, event_controller.isEventCreator, event_controller.edit_event);
router.post('/event/delete', isAuth, event_controller.isEventCreator, event_controller.delete_event);

/// TO ROUTES ///
router.get('/tos', to_controller.list_tos);
router.post('/to/create', isAuth, to_controller.create_to);
router.post('/to/edit', isAuth, to_controller.isToCreator, to_controller.edit_to);
router.post('/to/delete', isAuth, to_controller.isToCreator, to_controller.delete_to);

/// META CHANGES ROUTE ///
router.get('/metas', meta_controller.list_metas);

module.exports = router;
