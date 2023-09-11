const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const mailtrap = require('mailtrap')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3073afaccc0e7d",
        pass: "a80e0b3fa861df"
    }
});

exports.getLogin = (req, res, next) => {

    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', { pageTitle: 'Login', path: '/login', errorMessage: message, oldInput: { email: '', password: '' }, validationErrors: [] })

}
exports.getSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', { pageTitle: 'Signup', path: '/signup', errorMessage: message, oldInput: { email: '', password: '', confirmPassword: '' }, validationErrors: [] })

}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', { pageTitle: 'Login', path: '/login', errorMessage: errors.array()[0].msg, oldInput: { email: email, password: password }, validationErrors: errors.array() })
    }
    return res.redirect('/')

}
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors.array(), "Errors");
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', { pageTitle: 'Signup', path: '/signup', errorMessage: errors.array()[0].msg, oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword }, validationErrors: errors.array() })
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save()
        })
        .then(result => {
            res.redirect('/login')
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })

}
exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', { pageTitle: 'Reset', path: '/reset', errorMessage: message })

}
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No account whit that email found.')
                return res.redirect('reset')
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        }).then(result => {
            res.redirect('/')
            transporter.sendMail({
                to: req.body.email,
                from: 'mitredru@gmail.com',
                subject: 'Password reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>
                `
            })
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    })
}
exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
        let message = req.flash('error')
        if (message.length > 0) {
            message = message[0]
        } else {
            message = null
        }
        res.render('auth/new-password', { pageTitle: 'New password', path: '/new-password', errorMessage: message, userId: user._id.toString(), passwordToken: token })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })


}
exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}
