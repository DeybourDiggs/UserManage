require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const app = express();
const port = 5000;
const connectDB = require("./db-config/db")

// connect DB
connectDB()

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

// STATIC FILES
app.use(express.static('public'))

// EXPRESS SESSION
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }
  })
)

// FLASH MESSAGES 
app.use(flash());

//TEMPLATING ENGINE
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./routes/customer.js'))

// Handle 404
app.get('*', (req,res) => {
  res.status(404).render("404")
})

app.listen(port, () =>{
  console.log(`app listening on port ${port}`)
})