var express    = require("express");
var user = require('./routes/user');
var http = require('http');
var rooms = require('./routes/room');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our room booking apis' });
});
 
//route to handle user,room and more
router.post('/users',user.register);
router.get('/users/list',user.getUserList);
router.post('/login',user.login);
router.get('/rooms',rooms.getAllRooms);
router.post('/rooms',rooms.addBooking);
router.get('/list',rooms.getRoomList);
router.post('/getRoomAvailability',rooms.getRoomAvailability);
router.post('/getRoomStatusByDate',rooms.getRoomByDate);
router.delete('/rooms',rooms.cancelBooking);




app.use('/', router);
server.listen(port, () => {
    console.log(`Room Booking  App is up on ${port}`);
  });
