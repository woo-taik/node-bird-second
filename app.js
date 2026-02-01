const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');

dotenv.config(); 
const indexRouter = require('./routes/index');
const app = express();

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret-key-change-in-production'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET || 'default-secret-key-change-in-production',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});