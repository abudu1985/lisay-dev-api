const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load Input Validation
const validateQuoteInput = require('../../validation/quote');

// Load Quote model
const Quote = require('../../models/Quote');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Quotes Works' }));

// @route   POST api/quotes
// @desc    Create quote
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateQuoteInput(req.body);

        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }

        const newQuote = new Quote({
            text: req.body.text,
        });

        newQuote.save().then(quote => res.json(quote));
    }
);

// @route   POST api/quote/:id
// @desc    Update quote by id
// @access  Public
router.post('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateQuoteInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
    Quote.findOneAndUpdate(
        { _id: req.params.id },
        { $set: {text: req.body.text}},
        { new: true }
    ).then(quote => res.json(quote))
        .catch(err =>
            res.status(404).json({ noquotefound: 'No quote found with that ID for update' })
        );
});

// @route   GET api/quotes
// @desc    Get quotes
// @access  Public
router.get('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    Quote.find()
        .sort({ date: -1 })
        .then(quotes => res.json(quotes))
        .catch(err => res.status(404).json({ noquotesfound: 'No quotes found' }));
});

// @route   GET api/quote/random
// @desc    Get random quote
// @access  Public
router.get('/random', (req, res) => {
    Quote.count().exec(function (err, count) {
        const random = Math.floor(Math.random() * count);
        Quote.findOne().skip(random)
            .then(quote => res.json(quote))
            .catch(err =>
                res.status(404).json({ noquotefound: 'No quote was found randomly' })
            );
    })
});

// @route   GET api/quote/:id
// @desc    Get quote by id
// @access  Public
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    Quote.findById(req.params.id)
        .then(quote => res.json(quote))
        .catch(err =>
            res.status(404).json({ noquotefound: 'No quote found with that ID' })
        );
});

module.exports = router;