var express = require('express');
var router = express.Router();
var request = require('request');
var contextual = require('contextual');
var fs = require("fs");

var timestamp = new Date().getTime();
var rand = (Math.random() + 1).toString(36).substring(7)

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Where should I eat?' });
})

router.post('/endpoint', function(req, res) {

  console.log('Request: ' + JSON.stringify(req.body))

  var obj = JSON.parse(JSON.stringify(req.body))
  console.log(obj)

  if (obj.location === undefined) {
    var loc = 'll=' + contextual.geo(obj.latlong.latitude) + ',' + contextual.geo(obj.latlong.longitude)
  } else {
    var loc = 'near=' + contextual.geo(obj.location)
  }
  var qry = contextual.want(obj.query)
  var fqurl = 'https://api.foursquare.com/v2/venues/explore?client_secret=WSK1HU2DCIHM5CCP4VJSMBBYBNJRGQTH4HNMQALMSA1JB403&client_id=L0XD1HB0Q14EAOIBABH5QQKWIW0ZWCRHTJDCTAKPSLLRPPAH&' + loc + /* '&query=' + query + */ '&q=' + qry +  '&openNow=1&&venuePhotos=1&v=20140401'

  console.log('Making API call: ' + fqurl)

  request(fqurl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var fqres = JSON.parse(body)
      console.log('Sending: ' + JSON.stringify(fqres))
      res.send(JSON.stringify(fqres)) // ISSUE: send terminates after first loop, any subsequent objects are not posted
      fs.writeFile('./data/queries/fqres_' + loc + '_' + qry + '_' + timestamp + '_' + rand + '.txt', JSON.stringify(fqres), function(err) {
        if (err) throw err
        console.log('Query stored')
      })
    } else if (response.statusCode === 400) {
      res.send(400, 'No Results Found')
    }
  })
})

module.exports = router;