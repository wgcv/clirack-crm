const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
// Mongose Connect to database

mongoose.connect(config.database, { useMongoClient: true });
mongoose.Promise = global.Promise;

// On connection
mongoose.connection.on('connected', ()=> {
	console.log('Connected to database: '+config.database);
})
// On Error
mongoose.connection.on('error', (err)=> {
	console.log('Database error '+err);
})


// init epxress server
const app = express();

var swig = require('swig');
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const users = require('./routes/users');
const facebook = require('./routes/facebook');
const twitter = require('./routes/twitter');

const communication = require('./routes/communication');

// Port number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json())

// socket IO
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
	socket.on('subscribe', function(room) {
		socket.join(room);
	});

	socket.on('update', function(data) {
		console.log('sending ', data);
		socket.to(data.room).emit(data.name, {
			message: data.message
		});
	});

	socket.on('disconnect', function(){
	});
});
app.use(function(req,res,next){
    req.io = io;
    next();
});
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.use('/api/users', users);
app.use('/oauth/facebook', facebook);
app.use('/oauth/twitter', twitter);
app.use('/oauth/gmail', gmail);

app.use('/api/communication',communication);

// GCloud verification
app.get('/googlee2b9ac7a9722b937.html', (req, res)=> {
	res.send('google-site-verification: googlee2b9ac7a9722b937.html');
})

// Angular webs

app.get('*', (req, res) =>{
	res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Start Server
http.listen(port, ()=>{
	console.log('Server started on port ' + port);
});