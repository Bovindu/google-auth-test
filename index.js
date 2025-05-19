const express = require('express');
const session = require('express-session'); 
const passport = require('passport');
require('dotenv').config(); // Add this line

require('./auth'); // This loads your auth configuration

const app = express();

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({ 
    secret: process.env.SESSION_SECRET || "cat", // Better to use env variable
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
);

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong..');
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.send('Goodbye!');
        });
    });
});

app.listen(5000, () => console.log('Listening on: 5000'));