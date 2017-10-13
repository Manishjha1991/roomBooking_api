var express    = require("express");
var user = require('./routes/user');
var rooms = require('./routes/room');
var bodyParser = require('body-parser');
var app = express();
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
router.post('/login',user.login);
router.get('/rooms',rooms.getAllRooms);
router.get('/list',rooms.getList);
router.post('/getRoomAvailability',rooms.getRoomAvailability);
router.post('/getRoomStatusByDate',rooms.getRoomByDate);



app.use('/', router);
app.listen(3000);