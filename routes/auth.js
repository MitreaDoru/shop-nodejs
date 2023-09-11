
const express = require('express');
const { check, body } = require('express-validator')
const bcrypt = require('bcryptjs')
const authController = require('../controllers/auth')
const router = express.Router();
const User = require('../models/user');
router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', [body('email').isEmail().withMessage('Please enter a valid email!').normalizeEmail().custom(async (value, { req }) => {
    const user = await User.findOne({ email: value })
    if (!user) {
        throw new Error('Invalid email');

    }

}), body('password', 'Wrong password').isLength({ min: 5 }).isAlphanumeric().trim().custom(async (value, { req }) => {
    const user = await User.findOne({ email: req.body.email })
    return bcrypt.compare(value, user.password).then(doMatch => {
        if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) => {
                console.log(err);
            })
        } else {
            throw new Error('Wrong password')

        }
    })

})], authController.postLogin)
router.post('/signup', [body('email').isEmail().withMessage('Please enter a valid email!').custom(async (value, { req }) => {
    const user = await User.findOne({ email: value })
    if (user) {
        throw new Error('This e - mail already exists!!!');

    }

}).normalizeEmail(),
body('password', 'Please enter a password with only numbers and text and at least 5 characters').isLength({ min: 5 }).isAlphanumeric().trim(),
body('confirmPassword').trim().custom(async (value, { req }) => {
    if (value !== req.body.password) {
        console.log(value, "confirm");
        throw new Error('Password have to match')
    }
})

],
    authController.postSignup)
router.post('/logout', authController.postLogout)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.get('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)
module.exports = router