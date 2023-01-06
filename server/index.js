import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
// import RedisStore from 'connect-redis';


// route component
import postRoutes from './routes/Posts.js';
import userRoutes from './routes/Users.js';
import { passportStrategy } from './middleware/PassportStrategy.js';

const app = express();
passportStrategy(passport);
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
const sessions = session({
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : 'auto',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  name: 'sessionID',
  genid: (req) => {
    return genuuid();
  },
  resave: false,
  secret: 'secretidhere',
  saveUninitialized: false,
});

app.use(sessions);
app.use(passport.initialize());
app.use(passport.session());

// Node.js body parsing middleware.
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser("secret123"));
app.use(cors());
app.use('/uploads', express.static('uploads'));
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// route 
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// user 
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next();
})

app.get('/', (req, res) => {
  if (req.session.user === null) {
    renderSplash(req, res);
  } else {
    renderIndex(req, res);
  }
});

// mongodb database link
const CONNECTION_URL = 'mongodb://localhost:27017/posts';

// start server(port)
const PORT = process.env.PORT || 5000;

// create connection (mongodb database)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
