const express = require('express')
const router = new express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

// JWT secret
const secret = process.env.secret

// User model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 character' })
    }

    // Check password match
    if (password.toLowerCase().includes('password')) {
        errors.push({ msg: 'Password should not contain "password"' });
    }

    // Check password match
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                // user exist
                errors.push({ msg: 'Email is already registered'})
                 res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                 })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        // Set password to hashed
                        newUser.password = hash
                        // save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                }))
            }
        })
    }
})

// Login handle
router.post('/login', (req, res, next) => {
    const { email } = req.body

    
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
    jwt.sign({ email }, secret, { expiresIn: "60s" })

        // res.status(200).json({ email, token })
})

// Logout Handle 
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router