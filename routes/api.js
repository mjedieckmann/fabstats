const express = require('express');
const router = express.Router();

// Require controller modules.
const format_controller = require('../controllers/formatController');
const event_controller = require('../controllers/eventController');
const meta_controller = require('../controllers/metaController');
const to_controller = require('../controllers/toController');
const hero_controller = require('../controllers/heroController');
const match_controller = require('../controllers/matchController');
const Image = require('../models/image');

const multer = require("multer");
// const multerStorage = multer.memoryStorage();
// const upload = multer({ storage: multerStorage, });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
    }
})
var upload = multer({ storage: storage }).single('file')
router.post('/upload',function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        let user = req.user;
        user.img = req.file.path;
        user.save().then(user => {
            return res.status(200).send(req.file)
        });
    })
});
/*
router.post('/upload', upload.single('file'), async (req, res, next) => {
    const image = new Image({ image: { data: new Buffer.from(req.file.buffer, 'base64'), contentType: req.file.mimetype }});
    // const savedImage = await Image.create(image);
    image.save(function (err) {
        if (err) { return next(err); }
        res.send(image);
    });

});

router.get('/getImage/:id', async (req, res, next) => {
    const { id: _id } = req.params;
    // If you dont use lean(), you wont decode image as base64
    const image = await Image.findOne({ _id }).lean().exec();
    res.send(image);
});*/

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
