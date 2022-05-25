const express = require('express');
const router = express.Router();

// Require controller modules.
const format_controller = require('../controllers/formatController');
const event_controller = require('../controllers/eventController');
const meta_controller = require('../controllers/metaController');
const to_controller = require('../controllers/toController');
const hero_controller = require('../controllers/heroController');
const match_controller = require('../controllers/matchController');
const book_controller = require("../controllers/bookController");
const {isAuth} = require("../utils/password_utils");
const {isMatchCreator} = require("../controllers/userController");

/// HEROES ROUTES ///
router.get('/heroes', hero_controller.hero_list);
router.get('/hero/:id', hero_controller.hero_detail);

/// MATCHES ROUTES ///
router.get('/matches', match_controller.match_list);
router.get('/match/:id', match_controller.match_detail);
router.post('/match/create', isAuth, match_controller.event_create_match);
router.post('/match/edit', isAuth, isMatchCreator, match_controller.event_edit_match);
router.post('/match/delete', isAuth, isMatchCreator, match_controller.event_delete_match);

/// FORMAT ROUTE ///
router.get('/formats', format_controller.format_list);
router.get('/format/:id', format_controller.format_detail);

/// EVENT TYPE ROUTE ///
router.get('/events', event_controller.event_list);
router.post('/event/create', to_controller.event_create_to, event_controller.event_create_post);

/// META CHANGES ROUTE ///
router.get('/metas', meta_controller.meta_list);
router.get('/tos', to_controller.to_list);

module.exports = router;
