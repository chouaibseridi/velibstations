var express = require('express');
var Nominatim = require('node-nominatim2');
var mysql = require('mysql');
const geolib = require('geolib');
var util = require('util');

var router = express.Router();

var options = {
  useragent: 'MyApp',
  referer: 'https://github.com/xbgmsharp/node-nominatim2',
  timeout: 1000
},
nominatim = new Nominatim(options);

var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "xV9TqDJ0Pf",
  password: "HxF1tMqBsv",
  database: "xV9TqDJ0Pf"
});

var isLoggedIn = false;


router.get('/', function(req, res) {
  res.redirect('/login');
});

router.get('/login', function(req, res) {
  if (!isLoggedIn)
    res.render('login');
  else res.redirect('/bornes')
  });

router.post('/login', function(req, res) {

   var sql = "select * from users";
   con.connect(function() {
    con.query(sql, function (err, result) {
      if (err) throw err;

      var isValidUser = false;
      var i = 0;
      do {
        if(result[i].username == req.body.username) {
          isValidUser = true; 
        }
        else {i++;}
      } while (isValidUser == false && i != result.length);

      if (isValidUser)
       if (result[i].password == req.body.password) 
        { isLoggedIn = true;
          res.redirect('/bornes');}
       else {
         console.log('Wrong password !'); 
         res.redirect('/login');}
      else
       { console.log('User not found !')
        res.redirect('/login');}
  
    });
  });
});

router.get('/logout', function(req, res) {
    isLoggedIn = false;
    res.redirect('/login');
  });
  
router.get('/bornes',isIn, function(req, res, next){

  res.render('map', { location: [{lon: 2.341383, lat: 48.859456,}], zoom: 13});

});

router.post('/bornes', function (req, res) {

  var sql = "SELECT station, geo FROM `velib-pos`";
  nominatim.search({q: req.body.adresse , format:"json"},  function (err, data) {
    if (err) throw err;
        con.connect(function() {
        con.query(sql, function (err, result, fields) {
          if (err) throw err;


          var dataToString = JSON.stringify(data.body);
          var dataParsed = JSON.parse(dataToString);

          var geos = [];
          result.forEach(element => geos.push({station: element.station, latitude: element.geo.split(',')[0], longitude:element.geo.split(',')[1] }));

          var geopoints = [];
          geos.forEach(element => geopoints.push({ latitude: parseFloat(element.latitude), longitude: parseFloat(element.longitude) }) );          
          var order = geolib.orderByDistance({ latitude: dataParsed[0].lat, longitude : dataParsed[0].lon }, geopoints);

          var stations = [];
          order.forEach ( i => geos.forEach( j => {   
              if (i.latitude == j.latitude && i.longitude == j.longitude) 
              stations.push({station: j.station, latitude: i.latitude, longitude: i.longitude,
                        distance: geolib.getPreciseDistance({ latitude: dataParsed[0].lat, longitude : dataParsed[0].lon },
                                                            { latitude: i.latitude,  longitude:  i.longitude })});
            })
          );
          
          stations2 = JSON.stringify(stations);
      res.render('map', { location: dataParsed, stations1: stations, stations2: stations2, zoom: 17});
      });
    });  
  }); 
});



function isIn (req, res, next){
  if (isLoggedIn) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}


module.exports = router;
