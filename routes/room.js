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
        db.collection("rooms").find({}).toArray((err, result) =>{
          if (err) {
            res.json({ statusCode: 500, body: JSON.stringify(err) })
          }
          else if(result.length ===0){
                  res.json({ statusCode: 201, body: "no room found"});
                  db.close();
        }
        else if(result){
              res.json({ statusCode: 400, body: JSON.stringify(result) })
              db.close();
          }
      });
      }catch(err){
        throw err;
      }
  });
  }