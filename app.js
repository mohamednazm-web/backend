const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
//const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('connect-flash');

const app = express();
const moment = require('moment');
const multer = require('multer');

const STORE_DIR = '../client/public/uploads/store';
const CATEGORY_DIR = '../client/public/uploads/category';
const PRODUCT_DIR = '../client/public/uploads/product';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'store_logo') {
      cb(null, STORE_DIR);
    }
    if (file.fieldname === 'category_image') {
      cb(null, CATEGORY_DIR);
    }
    if (file.fieldname === 'product_image') {
      cb(null, PRODUCT_DIR);
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'store_logo') {
      cb(
        null,
        `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`
      );
    }
    if (file.fieldname === 'category_image') {
      cb(
        null,
        `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`
      );
    }
    if (file.fieldname === 'product_image') {
      cb(
        null,
        `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`
      );
    } else {
      cb(
        null,
        `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`
      );
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    path.extension(file.originalname === '.zip')
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const AppError = require('./utils/appError');
const accountRouter = require('./routes/accountRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage }).fields([
    {
      name: 'store_logo',
      maxCount: 1
    },
    {
      name: 'category_image',
      maxCount: 1
    },
    {
      name: 'product_image',
      maxCount: 1
    }
  ])
);

// reference for image uploading....

// Serving static files
app.use(express.static(path.join(__dirname, '../client/public/uploads')));

app.enable('trust proxy');

app.set('view engine', 'ejs');

///////////////////////////// translation ///////////////////////////////

var i18n = require('i18n');

i18n.configure({
  //define how many languages we would support in our application
  locales: ['ku', 'en', 'ar'],

  //define the path to language json files, default is /locales
  directory: __dirname + '/locales',

  //define the default language
  defaultLocale: 'ku',

  // define a custom cookie name to parse locale settings from
  cookie: 'i18n'
});

app.use(cookieParser('i18n_demo'));
app.use(
  session({
    secret: 'i18n_demo',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
//init i18n after cookie-parser
app.use(i18n.init);

app.get('/ku', function(req, res) {
  res.cookie('i18n', 'ku');
  res.redirect('back');
});

app.get('/en', function(req, res) {
  res.cookie('i18n', 'en');
  res.redirect('back');
});

app.get('/ar', function(req, res) {
  res.cookie('i18n', 'ar');
  res.redirect('back');
});
//////////////////////////////////////////////////END TRANSLATION/////////////////////////////////////////////
// 1) Global Middleware
// Implement CORS
app.use(cors());

app.options('*', cors());

// Development body
if (process.env.NODE_ENV === 'development') {
  // its availabel in every single file becasue already have in process.
  app.use(morgan('dev')); // requst send kaw tamashay consle bka
}

// limit request from same API
const limiter = rateLimit({
  // 100 request datwanre bnerdre la maway 1 houri
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

// Data sanitization against NoSql query injection
app.use(mongoSanitize()); // "email": {"$gt": ""}

app.use(xss()); // html form attacks

app.use(compression());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '30000kb'
  })
); // its need when you use post api
app.use(
  express.urlencoded({
    extended: true,
    limit: '30000kb'
  })
);

app.use(function(req, res, next) {
  var locale = 'ku';
  req.setLocale(locale);
  res.locals.language = locale;
  next();
});

app.use((req, res, next) => {
  req.requsetTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api/v1/account', accountRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

//app.use(globalErrorHandler);

// START THE SERVER

module.exports = app;
