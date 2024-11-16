// IMPORTS
const path = require('path');
const express = require('express');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const User = require('./models/user');
const WebSocket = require('ws')
const initializeWebSockets = require('./app-socket');
require('dotenv').config();

// INITIALIZE
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/message');

// USAGE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(gameRoutes);
app.use(authRoutes);
app.use(profileRoutes);
app.use(messageRoutes);

app.use(errorController.get404);

// RUN
mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
	const server = app.listen(3000, () => {
		console.log('Express app listening on port 3000');
	  });

    const wss = initializeWebSockets(server);
  })
  .catch(err => {
    console.log(err);
  });
