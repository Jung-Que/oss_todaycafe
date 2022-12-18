const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.urlencoded({extended: true}))
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
var db;

const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');

MongoClient.connect("mongodb+srv://jungque:hallym@cluster0.cbiznns.mongodb.net/?retryWrites=true&w=majority", function(err, client){
  if (err) return console.log(err)
  db = client.db('nodejs');
  // db.collection('login').insertOne({email: 'apple@hallym.ac.kr', password: "apple"}, function(err, result){
  //   console.log("save complete...");
  // });
  app.listen(8080, function() {
    console.log('listening on 8080')
  })
})
app.get('/reset', function(req, res) { 
    db.collection('login').find().toArray(function(err, result){
    console.log(result);
    fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(result));     
  })
  db.collection('sit').find().toArray(function(err, result){
    fs.writeFileSync(path.resolve(__dirname, 'sit.json'), JSON.stringify(result));    
  })
  res.sendFile(__dirname +'/sit.json')
  })

app.get('/', function(req, res) { 
  res.sendFile(__dirname +'/index.html')
  })

app.get('/write', function(req, res) { 
    res.sendFile(__dirname +'/write.html')
  })

  app.get('/data', function(req, res) { 
    res.sendFile(__dirname +'/data.json')
  })

  app.get('/date', function(req, res) { 
    db.collection('date').find().toArray(function(err, result){
    fs.writeFileSync(path.resolve(__dirname, 'date.json'), JSON.stringify(result));
    res.sendFile(__dirname +'/date.json')
    })
  })

  app.get('/datelist', function(req, res) {
    db.collection('date').find().toArray(function(err, result){
      console.log(result);
      res.render('datelist.ejs', {loginfo : result})
    })
  })

  app.get('/list', function(req, res) {
    db.collection('login').find().toArray(function(err, result){
      console.log(result);
      fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(result));
      res.render('list.ejs', {loginfo : result})
    })
  })

  app.post('/add', function(req, res){
    db.collection('config').findOne({name : 'totalcount'}, function(err, result){
      var mycount = result.count;
      db.collection('login').insertOne( { _id : (mycount + 1), email : req.body.email, password : req.body.password } , function(){
        db.collection('config').updateOne({name:'totalcount'},{ $inc: {count:1} },function(err, result){
          if (err) return console.log(err)
          console.log('save complete')
          res.send('send complete....');
        });  
      });
    });
  });