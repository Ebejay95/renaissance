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
require('dotenv').config();

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

//const adminRoutes = require('./routes/admin');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');

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

//app.use('/admin', adminRoutes);
app.use(gameRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
	const server = app.listen(3000, () => {
		console.log('Express app listening on port 3000');
	  });
//// Create a WebSocket server
//const wss = new WebSocket.Server({ server });
//
//// Handle WebSocket connections
//wss.on('connection', function connection(ws) {
//  ws.on('message', function incoming(message) {
//    console.log('received: %s', message);
//  });
//  ws.on('clicked_socket', function incoming(message) {
//    console.log('shit the socket was clicked!');
//  });
//
//  ws.send('Hello, WebSocket client!');
//});
  })
  .catch(err => {
    console.log(err);
  });
