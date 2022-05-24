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
const TO = require('../models/to');
const Event = require('../models/event');
const Meta = require('../models/meta');
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
let tos = []
let events = []
let metas = []
let teams = []
let users = []
let heroes = []
let matches = []
const rounds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A']

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
    });
}

function toCreate(descriptor, cb) {
    let to = new TO({descriptor: descriptor});

    to.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New TO: ' + to);
        tos.push(to)
        cb(null, to);
    });
}

function eventCreate(descriptor, to, event_type, cb) {
    let event = new Event({
        descriptor: descriptor,
        to: to,
        event_type: event_type,
        });

    event.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Event: ' + event);
        events.push(event)
        cb(null, event);
    }   );
}

function metaCreate(descriptor, date, type, cb) {
    let meta = new Meta({ descriptor: descriptor, date: date, type: type });

    meta.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Meta: ' + meta);
        metas.push(meta)
        cb(null, meta);
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

function userCreate(nick, e_mail, team, salt, hash, cb){
    let user = new User({nick: nick, e_mail: e_mail, team: team, salt: salt, hash: hash});

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

function matchCreate(hero_winner, hero_loser, user_winner, user_loser, event, round, notes, format, meta, date, cb){
    let match = new Match({
        hero_winner: hero_winner,
        hero_loser: hero_loser,
        user_winner: user_winner,
        user_loser: user_loser,
        event: event,
        round: round,
        notes: notes,
        format: format,
        meta: meta,
        date: date
    });

    match.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New match: ' + match);
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

function createTOs(cb) {
    async.series([
            function(callback) {
                toCreate("Júpiter",callback);
            },
            function(callback) {
                toCreate("Azkaban", callback);
            },
            function(callback) {
                toCreate("Channel Fireball", callback);
            },
            function(callback) {
                toCreate("LSS", callback);
            },
            function(callback) {
                toCreate("N/A", callback);
            },
            function(callback) {
                toCreate("Tournamentcenter", callback);
            },
        ],
        // optional callback
        cb);
}

function createEvents(cb) {
    async.series([
            function(callback) {
                eventCreate("Armory sábado", tos[between(0, 5)], "Armory", callback);
            },
            function(callback) {
                eventCreate("Draft sábado", tos[between(0, 5)], "Armory", callback);
            },
            function(callback) {
                eventCreate("Jupiter armory 24.05.", tos[between(0, 5)],"Armory",callback);
            },
            function(callback) {
                eventCreate("some skirmish", tos[between(0, 5)],"Skirmish",  callback);
            },
            function(callback) {
                eventCreate("RTN madrid", tos[between(0, 5)],"Road to Nationals", callback);
            },
            function(callback) {
                eventCreate("a ProQuest", tos[between(0, 5)], "ProQuest", callback);
            },
            function(callback) {
                eventCreate("a Battle Hardened", tos[between(0, 5)],"Battle Hardened", callback);
            },
            function(callback) {
                eventCreate("a Calling", tos[between(0, 5)],"Calling", callback);
            },
            function(callback) {
                eventCreate("a Nationals", tos[between(0, 5)],"Nationals", callback);
            },
            function(callback) {
                eventCreate("a Pro Tour", tos[between(0, 5)],"Pro Tour",callback);
            },
            function(callback) {
                eventCreate("a Farewell Welcome to Rathe", tos[between(0, 5)],"Farewell Welcome to Rathe", callback);
            },
            function(callback) {
                eventCreate("a Pre-release", tos[between(0, 5)],"Pre-release", callback);
            },
            function(callback) {
                eventCreate("a World Championship", tos[between(0, 5)],"World Championship", callback);
            },
        ],
        // optional callback
        cb);
}

function createMetas(cb) {
    async.series([
            function(callback) {
                metaCreate("B \& S Announcement May 2nd 2022", new Date('02-may-2022'), "B \& S Announcement", callback);
            },
            function(callback) {
                metaCreate("Welcome to Rathe", new Date('11-oct-2019'), "Set Release", callback);
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
            userCreate('mjed', 'mje.dieckmann@googlemail.com', teams[0], 'salty', 'hashy', callback)
        },
        function(callback) {
            userCreate('test', 'test.est@mailmail.com', null,'salty#', '#hashy', callback)
        },
    ], cb)
}

function createHeroes(cb){
    async.series([
        function(callback) {
            heroCreate('Boltyn, Breaker of Dawn', [formats[0]], '/public/images/heroes/boltyn_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Chane, Bound by Shadow', [formats[0]], '/public/images/heroes/chane_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Viserai, Rune Blood', [formats[0]], '/public/images/heroes/viserai_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Bravo, Star of the Show', [formats[0]], '/public/images/heroes/bravo_star_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Lexi, Livewire', [formats[0]], '/public/images/heroes/lexi_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Kano, Dracai of Aether', [formats[0]], '/public/images/heroes/kano_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Dorinthea Ironsong', [formats[0]], '/public/images/heroes/dorinthea_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Bravo, Showstopper', [formats[0]], '/public/images/heroes/bravo_showstopper_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Oldhim, Grandfather of Time', [formats[0]], '/public/images/heroes/oldhim_old_sm.jpg', callback)
        },
        function(callback) {
            heroCreate('Prism, Sculptor of Arc Light', [formats[0]], '/public/images/heroes/prism_old_sm.jpg', callback)
        },
    ], cb)
}
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function createMatches(cb){
    let tasks = [];
    for (let i=0; i <= 200; i++){
        tasks.push( (callback) => matchCreate(heroes[between(0, 9)],heroes[between(0, 9)], users[0], users[1], events[between(0, 12)], rounds[between(0, 13)], null, formats[between(0, 5)], metas[between(0, 1)], new Date(),callback))
    }
    async.series(tasks, cb)
}

async function cleanDB(cb) {
    await Meta.deleteMany({});
    await Event.deleteMany({});
    await Format.deleteMany({});
    await TO.deleteMany({});
    await Hero.deleteMany({});
    await Team.deleteMany({});
    await User.deleteMany({});
    await Match.deleteMany({});
}

async.series([
        cleanDB,
        createMetas,
        createTOs,
        createEvents,
        createFormats,
        createHeroes,
        createTeams,
        createUsers,
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