$(document).ready(function() {

  // Ajax loader
  $(document).ajaxStart(function () {$('#ajaxLoader').addClass('loaded')})
  $(document).ajaxStop(function () {$('#ajaxLoader').removeClass('loaded')})

  //Page load animation
  $('#inputContainer').addClass('loaded')
  $('body').addClass('loaded')

  $('#destAddr_0').focus(function() {
    $('#submit').addClass('loaded')
  })

  $('#destAddr_0').focusout(function() {
    $('#submit').removeClass('loaded')
  })

  /* Disabled multi-result functionality
  $('#destButton').click(function() {

    var n = $('#destList').children().length
    var destInput = '<li id="destList_' + n + '"><label for="destAddr_' + n + '">Address: </label><input type="text" id="destAddr_' + n + '" name="destAddr_' + n + '" value="Los Angeles, CA"><label for="query_' + n + '">Query: </label><input type="text" id="query_' + n +'" name="query_' + n + '" value="Food"><a href="" id="destRemove_' + n + '">Remove</a></li>'
    $('#destList').append(destInput)
    
    $('#destRemove_' + n).on('click', function() {
      $('#destList_' + n).remove()
    })
    return false
  })
    */

  // Form onsubmit events
  $('#submit').on('click', function() {

    if ($('#destAddr_0').val() == '') {
      
      $('#ajaxNotification').html('<p class="redNote"><i class="fa fa-exclamation-triangle"></i> Enter a location!</p>').addClass('loaded')

      return false
    
    } else {

      $('#ajaxNotification').removeClass('loaded')

      var count = $('#destList').children().length
      var array = {}

      for (i = 0; i < count; i++) {
        array['destAddr_' + i] = $('#destAddr_' + i).val(),
        array['query_' + i] = $('#query_' + i).val()
      }

      var a = $.ajax({
        type: 'POST',
        data: JSON.stringify(array),
        contentType: 'application/json',
        url: 'http://localhost:3000/endpoint',
        success: function(res) {

          $('#outputContainer').addClass('loaded')

          for ( i = 0 ; i < count ; i++) {

            var fqRes = JSON.parse(res)
            var fqGroups = fqRes.response.groups

            $(fqGroups).each(function(i) {
              
              var fqItems = fqRes.response.groups[i].items

              $(fqItems).each(function(i) {

                /* VENUE/SEARCH FIELDS
                var name = fqRes.response.venues[i].name
                var phone = fqRes.response.venues[i].contact.formattedPhone
                var addr = fqRes.response.venues[i].location.address
                var city = fqRes.response.venues[i].location.city
                var postal = fqRes.response.venues[i].location.postalCode
                var state = fqRes.response.venues[i].location.state
                var country = fqRes.response.venues[i].location.cc
                var url = fqRes.response.venues[i].url
                var checkins = fqRes.response.venues[i].stats.checkinsCount
                var tips = fqRes.response.venues[i].stats.tipCount
                */

                try { var name = fqItems[i].venue.name } catch (e) {console.log(e)}
                try { var phone = fqItems[i].venue.contact.formattedPhone } catch (e) {console.log(e)}
                try { var addr = fqItems[i].venue.location.address } catch (e) {console.log(e)}
                try { var city = fqItems[i].venue.location.city } catch (e) {console.log(e)}
                try { var postal = fqItems[i].venue.location.postalCode } catch (e) {console.log(e)}
                try { var state = fqItems[i].venue.location.state } catch (e) {console.log(e)}
                try { var country = fqItems[i].venue.location.cc } catch (e) {console.log(e)}
                try { var url = fqItems[i].venue.url } catch (e) {console.log(e)}
                try { var checkins = fqItems[i].venue.stats.checkinsCount } catch (e) {console.log(e)}
                try { var tips = fqItems[i].venue.stats.tipCount } catch (e) {console.log(e)}
                try { var currency = fqItems[i].venue.price.currency } catch (e) {console.log(e)}
                try { var tier = fqItems[i].venue.price.tier } catch (e) {console.log(e)}
                try { var rating = fqItems[i].venue.rating } catch (e) {console.log(e)}
                try { var id  = fqItems[i].venue.id } catch (e) {console.log(e)}

                var fqurl = 'https://foursquare.com/v/' + id

                if (tier === 1) {
                  var tierStyled = '<i class="fa fa-usd"></i>'
                } else if (tier === 2) {
                  var tierStyled = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i>'
                } else if (tier === 3) {
                  var tierStyled = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i><i class="fa fa-usd"></i>'
                } else if (tier === 4) {
                  var tierStyled = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i><i class="fa fa-usd"></i><i class="fa fa-usd"></i>'
                } else  if (tier === undefined) {
                  var tierStyled = ''
                }

                if (rating >= 9 ) {
                  var ratingStyled = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>'
                } else if (rating >= 8 && rating <= 8.9 ) {
                  var ratingStyled = '</i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>'
                } else if (rating >= 6 && rating <= 8.9 ) {
                  var ratingStyled = '</i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>'
                } else if (rating >= 4 && rating >= 5.9 ) {
                  var ratingStyled = '</i><i class="fa fa-star"></i><i class="fa fa-star"></i>'
                } else if (rating >= 0 && rating >= 3.9 ) {
                  var ratingStyled = '</i><i class="fa fa-star"></i>'
                } else if (rating === undefined) {
                  var ratingStyled = 'No Rating'
                }

                if (addr === undefined) { var addrStyled = ''} else {var addrStyled = addr}
                if (city === undefined) { var cityStyled = ''} else {var cityStyled = city}
                if (postal === undefined) { var postalStyled = ''} else {var postalStyled = postal}
                if (state === undefined) { var stateStyled = ''} else {var stateStyled = state}
                if (phone === undefined) { var phoneStyled = 'Missing'} else {var phoneStyled = phone}
                if (url === undefined) { var urlStyled = fqurl} else {var urlStyled = url}
                if (name === undefined) { var nameStyled = cityStyled} else {var nameStyled = name}

                $(
                    '<li class="fqResult" id="fqResult_' + i + '">'
                    + '<h2 title="' + nameStyled + '"><a class="fa fa-foursquare" href="' + fqurl + '" target="_blank"></a> ' + name + '</h2>'
                    + '<p class="tierrating"><span class="rating">' + ratingStyled + '</span>'
                    + '<span class="tier">' + tierStyled + '</span></p>'
                    // + '<p class="checkinstips"><span title="checkins" class="checkins">' + checkins + '</span>' +
                    // + '<span title="tips" class="tips">' + tips + '</span></p>' +
                    + '<p class="addr">' + addrStyled + '</p>'
                    + '<p class="cityzip">' + city + ' ' + stateStyled + '</p>'
                    + '<p class="postal">' + postalStyled + '</p>'
                    + '<p class="phoneurl"><span class="phone"><i class="fa fa-phone"></i> ' + phoneStyled
                    + '</span><span class="url"><i class="fa fa-globe"></i> <a href="' + urlStyled + '" target="_blank">Visit Website</a></span></li>'
                    //+ '<a href="#" id="fqRemove_' + i + '">Remove</a>'
                  ).prependTo('#fqResponse')

              })
            })
        
            /* Disabled mult-result functionality
            $('#fqRemove_' + i).on('click', function() {
              $('#fqResult_' + i).remove()
              $('#fqRemove_' + i).remove()
              console.log('Removing: #fqResult_' + i)
            })
            return false
            */
          }
        },
        error: function() {
          $('#ajaxNotification').html('<p class="redNote"><i class="fa fa-exclamation-triangle"></i> Nothing found! Did you enter address correctly?</p>').addClass('loaded')
        }
      })
      return false
    }
  })
})