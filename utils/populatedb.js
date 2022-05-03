#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let async = require("async");

const Format = require('../models/format');
const EventType = require('../models/eventtype');
const MetaChange = require('../models/metachange');
const Team = require('../models/team');
const User = require('../models/user');
const Hero = require('../models/hero');
const Match = require('../models/match');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let formats = []
let event_types = []
let meta_changes = []
let teams = []
let users = []
let heroes = []
let matches = []

function formatCreate(descriptor, type, cb) {
    let format = new Format({ descriptor: descriptor, type: type });

    format.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Format: ' + format);
        formats.push(format)
        cb(null, format);
    }   );
}

function eventtypeCreate(descriptor, cb) {
    let event_type = new EventType({ descriptor: descriptor });

    event_type.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Event Type: ' + event_type);
        event_types.push(event_type)
        cb(null, event_type);
    }   );
}

function metachangeCreate(descriptor, date, type, cb) {
    let meta_change = new MetaChange({ descriptor: descriptor, date: date, type: type });

    meta_change.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Meta Change: ' + meta_change);
        meta_changes.push(meta_change)
        cb(null, meta_change);
    }   );
}

function teamCreate(nick, cb){
    let team = new Team({nick: nick});

    team.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Team: ' + team);
        teams.push(team)
        cb(null, team);
    }   );
}

function userCreate(nick, e_mail, team, cb){
    let user = new User({nick: nick, e_mail: e_mail, team: team});

    user.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user);
    }   );
}

function heroCreate(name, formats, img, cb){
    let hero = new Hero({name: name,  formats: formats, img: img});

    hero.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Hero: ' + hero);
        heroes.push(hero)
        cb(null, hero);
    }   );
}

function matchCreate(hero_a, hero_b, winner, date, user_a, user_b, event_type, top_cut, notes, format, cb){
    let match = new Match({
        hero_a: hero_a,
        hero_b: hero_b,
        winner: winner,
        date: date,
        user_a: user_a,
        user_b: user_b,
        event_type: event_type,
        top_cut: top_cut,
        notes: notes,
        format: format,
    });

    match.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Hero: ' + match);
        matches.push(match)
        cb(null, match);
    }   );
}

function createFormats(cb) {
    async.series([
            function(callback) {
                formatCreate("Classic Constructed", "Constructed", callback);
            },
            function(callback) {
                formatCreate("Blitz","Constructed", callback);
            },
            function(callback) {
                formatCreate("Sealed","Limited", callback);
            },
            function(callback) {
                formatCreate("Draft", "Limited", callback);
            },
            function(callback) {
                formatCreate("Commoner","Constructed", callback);
            },
            function(callback) {
                formatCreate("Ultimate Pit Fight","Constructed", callback);
            },
        ],
        // optional callback
        cb);
}

function createEventTypes(cb) {
    async.series([
            function(callback) {
                eventtypeCreate("Test Game",  callback);
            },
            function(callback) {
                eventtypeCreate("On Demand",callback);
            },
            function(callback) {
                eventtypeCreate("Armory", callback);
            },
            function(callback) {
                eventtypeCreate("Skirmish",  callback);
            },
            function(callback) {
                eventtypeCreate("Road to Nationals", callback);
            },
            function(callback) {
                eventtypeCreate("ProQuest", callback);
            },
            function(callback) {
                eventtypeCreate("Battle Hardened", callback);
            },
            function(callback) {
                eventtypeCreate("Calling", callback);
            },
            function(callback) {
                eventtypeCreate("Nationals", callback);
            },
            function(callback) {
                eventtypeCreate("Pro Tour", callback);
            },
            function(callback) {
                eventtypeCreate("Farewell Welcome to Rathe", callback);
            },
            function(callback) {
                eventtypeCreate("Pre-release", callback);
            },
            function(callback) {
                eventtypeCreate("World Championship", callback);
            },
        ],
        // optional callback
        cb);
}

function createMetaChanges(cb) {
    async.series([
            function(callback) {
                metachangeCreate("B \& S Announcement May 2nd 2022", new Date('02-may-2022'), "B \& S Announcement", callback);
            },
        ],
        // optional callback
        cb);
}

function createTeams(cb){
    async.series([
        function(callback) {
            teamCreate('FaB Tryhards', callback)
        },
    ], cb)
}

function createUsers(cb){
    async.series([
        function(callback) {
            userCreate('mjed', 'mje.dieckmann@googlemail.com', teams[0], callback)
        },
        function(callback) {
            userCreate('test', 'test.est@mailmail.com', null, callback)
        },
    ], cb)
}

function createHeroes(cb){
    async.series([
        function(callback) {
            heroCreate('Boltyn', [formats[0], formats[1]], null, callback)
        },
        function(callback) {
            heroCreate('Chane, Bound by Shadow', [formats[0]], null, callback)
        },
    ], cb)
}

function createMatches(cb){
    async.series([
        function(callback) {
            matchCreate(heroes[0],heroes[1], 1, new Date(), users[0], users[1], event_types[0], 'N/A', null, formats[0], callback)
        },
        function(callback) {
            matchCreate(heroes[0],heroes[1], 0, new Date(), users[0], users[1], event_types[0], 'N/A', null, formats[0], callback)
        },
        function(callback) {
            matchCreate(heroes[1],heroes[1], 0, new Date(), users[0], users[1], event_types[0], 'N/A', null, formats[0], callback)
        },
    ], cb)
}

async function cleanDB(cb) {
    await MetaChange.deleteMany({})
    await EventType.deleteMany({})
    await Format.deleteMany({})
    await Hero.deleteMany({})
    await User.deleteMany({})
    await Match.deleteMany({})
}

async.series([
        cleanDB,
        createMetaChanges,
        createEventTypes,
        createFormats,
        createHeroes,
        createTeams,
        // createUsers,
        createMatches,
    ],
// Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        else {
            console.log('Done!');

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });