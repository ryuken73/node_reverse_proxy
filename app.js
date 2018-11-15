var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const config = require('./config.json');

var httpProxy = require('http-proxy');

const sslOptions = {
  key : fs.readFileSync(config.ssl.keyFile),
  cert : fs.readFileSync(config.ssl.certFile)
}

global.proxy = httpProxy.createProxyServer({
  ssl : sslOptions,
  secure : false
});

var indexRouter = require('./routes/index');

// express security guide
var helmet = require('helmet');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// security setting
app.use(helmet());


//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use(indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
