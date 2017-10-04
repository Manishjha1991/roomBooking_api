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
    res.json({ statusCode: 404, body: 'no room available' });
//     MongoClient.connect(dbUrl, {native_parser:true},(err, db) =>{
//   assert.equal(null, err);
//       try{
//            db.collection('users').findOne({email_id:data.email_id},{email_id:1,_id:0},(err,result)=>{
//           if (err) {
//               res.json({ statusCode: 500, body: JSON.stringify(err)})
//           }
//           else if(result === null){
//               db.collection('users').update({user_id:User.user_id},User,{upsert:true},(error,user) => {
//                   if (err) callback(null, { statusCode: 500, body: JSON.stringify(error) })
//                   let data ={'id':User.user_id,'User':User,'tokenId':''}
//                   res.json({ statusCode: 201, body: JSON.stringify(data)});
//                   db.close();
//           });
//         }
//           else if(result !== null){
//               res.json({ statusCode: 400, body: 'email id is already register please try to login' })
//               db.close();
//           }
//       });
//           }
//             catch(err){
//                 throw err;
                
//             }
//   });
  }