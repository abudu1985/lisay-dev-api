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

// @route   POST api/quotes/:id
// @desc    Update quote by id
// @access  Private
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
// @access  Private
router.get('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    Quote.find()
        .sort({ date: -1 })
        .then(quotes => res.json(quotes))
        .catch(err => res.status(404).json({ noquotesfound: 'No quotes found' }));
});

// @route   GET api/quotes/random
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

// @route   GET api/quotes/:id
// @desc    Get quote by id
// @access  Private
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    Quote.findById(req.params.id)
        .then(quote => res.json(quote))
        .catch(err =>
            res.status(404).json({ noquotefound: 'No quote found with that ID' })
        );
});

// @route   DELETE api/quotes/:id
// @desc    Delete quote by id
// @access  Private
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log('req.params.id -> ', req.params.id)
        Quote.remove({ _id: req.params.id })
            .then(quote => res.json(quote))
            .catch(err =>
                res.status(404).json({ noquotefound: 'No quote found to delete with that ID' })
            );
    });

module.exports = router;