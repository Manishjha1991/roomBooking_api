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


exports.getRoomAvailability = function(req,res){
  var newStartTime = parseFloat(req.body.start_time);
  var newEndTime = parseFloat(req.body.end_time);
  var booking_date=req.body.booking_date;
  MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
    assert.equal(null, err);
      try{
    db.collection("rooms").find({booking_date:booking_date,reserved: { $not: { $elemMatch:
      {
      $or: [
        {
          $and: [
            {
              $or: [
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
                  res.json({ statusCode: 200, body: {"result":result ,"status":"Room is already  booked"}});
                  db.close();
        }
        else if(result){
          console.log(result)
              res.json({ statusCode: 400, body: {"result":result ,"status":"this Room is available for booking"}})
              db.close();
          }
      });
      }catch(err){
        throw err;
      }
  });
  }
