const express = require('express');
const router = express.Router();

// Require controller modules.
const format_controller = require('../controllers/formatController');
const event_controller = require('../controllers/eventController');
const meta_controller = require('../controllers/metaController');
const to_controller = require('../controllers/toController');
const hero_controller = require('../controllers/heroController');
const match_controller = require('../controllers/matchController');

/// HEROES ROUTES ///
router.get('/heroes', hero_controller.hero_list);
router.get('/hero/:id', hero_controller.hero_detail);

/// MATCHES ROUTES ///
router.get('/matches', match_controller.match_list);

/// FORMAT ROUTE ///
router.get('/formats', format_controller.format_list);
router.get('/format/:id', format_controller.format_detail);

/// EVENT TYPE ROUTE ///
router.get('/events', event_controller.event_list);

/// META CHANGES ROUTE ///
router.get('/meta', meta_controller.meta_list);
router.get('/to', to_controller.to_list);

module.exports = router;
