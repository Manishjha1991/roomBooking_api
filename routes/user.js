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
exports.register = function(req,res){
    const data = req.body;
    var User = {
      'user_id':uuid.v1(),
      'first_name': data.first_name,
      'last_name': data.last_name,
      'email_id':data.email_id,
      'contact_number': data.contact_number,
      'image_url': data.image_url,
      'user_creation_date':dateFormat(now, "UTC:h:MM:ss TT Z"),
      'user_flag': false,
      'password': bcrypt.hashSync(data.password,salt),
  };
  MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
  assert.equal(null, err);
      try{
           db.collection('users').findOne({email_id:data.email_id},{email_id:1,_id:0},(err,result)=>{
          if (err) {
              res.json({ statusCode: 500, body: JSON.stringify(err)})
          }
          else if(result === null){
              db.collection('users').update({user_id:User.user_id},User,{upsert:true},(error,user) => {
                  if (err) callback(null, { statusCode: 500, body: JSON.stringify(error) })
                  let data ={'id':User.user_id,'User':User,'tokenId':''}
                  res.json({ statusCode: 201, body: JSON.stringify(data)});
                  db.close();
          });
        }
          else if(result !== null){
              res.json({ statusCode: 400, body: 'email id is already register please try to login' })
              db.close();
          }
      });
          }
            catch(err){
                throw err;
                
            }
  });
  }
  exports.login = function(req,res){
    let data = req.body;
    if(data.email_id){
        if(data.password){
            MongoClient.connect(dbUrl, {native_parser:true},(err, db) => {
                assert.equal(null,err);
                 db.collection('users').findOne({email_id:data.email_id},{password:1,_id:0,first_name:1,last_name:1,user_id:1,contact_number:1,image_url:1},{upsert:false},(err, result) => {
                  if (err) res.json({ statusCode: 500, body: err});
                  if(result !== null){
                      var results = bcrypt.compareSync(data.password,result.password);
                      if(results){
                            console.log(result.password="***********");
                          res.json({ statusCode: 200, body: result});
                          db.close();
                      }
                      else{
                        res.json({ statusCode: 500, body: 'Wrong Password' })
                        db.close();
                      }  
                 }
                else{
                  res.json({ statusCode: 404, body: 'No user Found'})
                  db.close();
                }
              });
              });

        }
        else{
            res.json({ statusCode: 404, body: 'enter password'})
        }        
    }
    else
    {
        res.json({ statusCode: 404, body: 'enter emailId'})
        
    }
  }
exports.getUserList=  function(req,res,next){
    MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
      assert.equal(null, err);
        try{
            db.collection('users').find({},{user_id:1,first_name:1,last_name:1,email_id:1,contact_number:1}).toArray((err, result) => {
              res.json({"status":200,"userList":result});
              }   )  
        
  }catch(err){
          throw err;
        }
  })
  }

