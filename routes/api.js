const express = require('express');
const router = express.Router();

// Require controller modules.
const format_controller = require('../controllers/formatController');
const event_type_controller = require('../controllers/eventtypeController');
const meta_change_controller = require('../controllers/metachangeController');
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
router.get('/event_types', event_type_controller.event_type_list);

/// META CHANGES ROUTE ///
router.get('/meta_changes', meta_change_controller.meta_change_list);

module.exports = router;
