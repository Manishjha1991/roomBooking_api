const MongoClient = require('mongodb').MongoClient;
const bluebird = require('bluebird');
const uuid = require('uuid');
const validator = require('validator');
const dateFormat = require('dateformat');
const assert = require('assert');
const now = new Date();
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(6);
var dbUrl = require('../db.js').url;


exports.getAllRooms = function(req,res){
  MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
assert.equal(null, err);
    try{
         db.collection('rooms').find({}).toArray((err,result)=>{
        if (err) {
            res.json({ statusCode: 500, body: err})
        }
        else if(result === null){
                res.json({ statusCode: 201, body: "no room found"});
                db.close();
      }
      else if(result !== null){
            res.json({ statusCode: 400, body: result})
            db.close();
        }
    });
    }
          catch(err){
              throw err;
          }
});
}

  exports.getRoomAvailability = function(req,res){
    var newStartTime = parseFloat(req.body.start_time);
    var newEndTime = parseFloat(req.body.end_time);
    var booking_date=req.body.booking_date;
    MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
      assert.equal(null, err);
        try{
      db.collection("rooms").find({booking_date:booking_date,reserved: 
        { 
          $not: 
            { 
              $elemMatch:
                {
                  $or: [
                    {
                      $and:
                       [
                      {
                        $or: 
                          [
                  {$and: [{start_time: {$lt: newStartTime}}, {end_time: {$gt: newStartTime}}]}, 
                  {$and: [{start_time: {$lt: newEndTime}}, {end_time: {$gt: newEndTime}}]},
                  {$and: [{start_time: {$gte: newStartTime}}, {end_time: {$lte: newEndTime}}]},
  
      ]},
                  {$or: [{start_time: {$ne: newStartTime}}, {end_time: {$ne: newEndTime}}]},
    ]
              },
                  {$and: [{start_time: {$eq: newStartTime}}, {end_time: {$eq: newEndTime}}]}
      ]},
      }}},{room_name:1,room_id:1}).toArray((err, result) =>{
          console.log(result);
            if (err) {
              res.json({ statusCode: 500, body: err})
            }
            else if(result.length ===0){
                    res.json({ statusCode: 404, body: {"result":result ,"status":"Room is already  booked"}});
                    db.close();
          }
          else if(result){
            console.log(result)
                res.json({ statusCode: 200, body: {"result":result ,"status":"Room is available for booking"}})
                db.close();
            }
        });
        }catch(err){
          throw err;
        }
    });
    }

  exports.getRoomByDate=  function(req,res,next){
    const booking_date = req.body.booking_date;
    const room_id= req.body.room_id;
    var inputDate = new Date(booking_date);
    var todaysDate = new Date();
    MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
      assert.equal(null, err);
        try{
          db.collection('rooms').aggregate({$unwind: "$reserved"},{$match: { "reserved.booking_date": {$gte: new Date(booking_date)}} },function(err, result) {
          res.json({"status":200,"result":result});
          }   )   
  }catch(err){
          throw err;
        }
})
}

exports.cancelBooking = function (req,res,next){

}


exports.addBooking =  function(req,res,next){
  const room_id = req.body.room_id;
  const booking_date =  new Date(req.body.booking_date);
  const booking_id = uuid.v1();
  const booking_title = req.body.booking_title;
  const start_time =req.body.start_time;
  const end_time = req.body.end_time;
  const host_name = req.body.host_name;
  const host_userId=req.body.host_userId;
  let guest_list = req.body.guest_list;
  guest_list=JSON.parse(guest_list);
  const booking_status = true;

  
 const data = {
    booking_id,
    booking_date,
    booking_title,
    start_time,
    end_time,
    host_name,
    host_userId,
    guest_list,
    booking_status
  }
  MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
    assert.equal(null, err);
      try{
        db.collection('rooms').findOneAndUpdate(
    { room_id: room_id }, 
    {$addToSet: {reserved:data}},{ new: true },(err,response)=>{
             if (err) {
              res.json({ statusCode: 500, body: JSON.stringify(err)})
          }
          else if(response){
                  res.json({ statusCode: 201, body: response});
        }
    }
)
}catch(err){
        throw err;
      }
})
}

exports.getRoomList=  function(req,res,next){
  
  console.log(req);
  MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
    assert.equal(null, err);
      try{
        if(req.query.type==1){
          db.collection('rooms').find({},{room_id:1,room_name:1,company_location:1,company_name:1}).toArray((err, result) => {
            res.json({"status":200,"companyList":result});
            }   )  
        };
        if(req.query.type==2){
          {
            
            result= [
                {
                    "_id" : "59defa39d205237da05bbc34",
                    "contact_number":9901377433,
                    "room_id": "3c5e25b6-acc1-11e7-abc4-cec278b6b50T",
                    "room_name": "Conference Name B"
                }
            ]
        }
        res.json({"status":200,"callList":result});
          // db.collection('calls').find({},{contact_number:1,room_name:1,company_location:1,company_name:1}).toArray((err, result) => {
          //   res.json({"status":200,"callList":result});
          //   }   ) 
        }
  
}catch(err){
        throw err;
      }
})
}
    