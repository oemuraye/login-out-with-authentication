const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose  = require('mongoose')
const morgan = require('morgan')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')


const app = express()
dotenv.config()

// Passport config
require('./config/passport')(passport)
require('./config/googlePassport')(passport)

// DB Config
const db = process.env.MongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB is Connected... '))
.catch((error) => console.log(error.message))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Logging
app.use(morgan('dev'))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log('Server is up on port ' + PORT + '.')
})