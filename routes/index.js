var express = require('express');
var router = express.Router();
var request = require('request');

var fqcategories = '4d4b7105d754a06374d81259'
var fqsection = 'food'

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Where should I eat?' });
})

router.post('/endpoint', function(req, res) {

  var obj = req.body
  var str = JSON.stringify(obj)

  console.log('Parsing: ' + str)

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  var size = Object.size(obj) / 2;

  for (i = 0; i < size; i++) {

    JSON.parse(str, function(k, v) {if (k === 'destAddr_' + i) address = v})
    JSON.parse(str, function(k, v) {if (k === 'query_' + i) query = v})

    console.log(fqcategories)

    var url = 'https://api.foursquare.com/v2/venues/explore?client_secret=WSK1HU2DCIHM5CCP4VJSMBBYBNJRGQTH4HNMQALMSA1JB403&client_id=L0XD1HB0Q14EAOIBABH5QQKWIW0ZWCRHTJDCTAKPSLLRPPAH&near=' + address + /* '&query=' + query + */ '&section=' + fqsection +  '&v=20140401'

    console.log('Making API call: ' + url)
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var fqres = JSON.parse(body)
        console.log('Sending: ' + JSON.stringify(fqres))
        res.send(JSON.stringify(fqres)) // ISSUE: send terminates after first loop, any subsequent objects are not posted
      } else if (response.statusCode === 400) {
        res.send(400, 'No Results Found')
      }
    })
  }
})

module.exports = router;