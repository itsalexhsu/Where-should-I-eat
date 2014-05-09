$(document).ready(function() {

  // Ajax loader
  $(document).ajaxStart(function () {$('#ajaxLoader').addClass('loaded')})
  $(document).ajaxStop(function () {$('#ajaxLoader').removeClass('loaded')})

  //Page load animation
  $('#inputContainer').addClass('loaded')
  $('body').addClass('loaded')

  $('#destAddr').focus(function() {
    $('#submit').addClass('loaded')
  })

  $('#destAddr').focusout(function() {
    $('#submit').removeClass('loaded')
  })

  // Filters

  $('#tier1filter').on('click', function() {
    $('.fqResult').not('.tier_1').addClass('hide');
  })

  // Form onsubmit events
  $('#submit').on('click', function() {

    if ($('#destAddr').val() == '') {
      
      $('#ajaxNotification').html('<p class="redNote"><i class="fa fa-exclamation-triangle"></i> Enter a location!</p>').addClass('loaded')

      return false
    
    } else {

      $('#ajaxNotification').removeClass('loaded')
      $('#inputContainer').addClass('submitted')

      var loc = $('#destAddr').val()
      var obj = {location: loc}

      console.log('post:' + JSON.stringify(obj))

      var a = $.ajax({
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        url: '/endpoint',
        success: function(res) {

          $('#outputContainer').addClass('loaded')


          var fqRes = JSON.parse(res)
          var fqGroups = fqRes.response.groups

          $(fqGroups).each(function(i) {
            
            var fqItems = fqRes.response.groups[i].items

            $(fqItems).each(function(i) {

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
                  '<li class="fqResult rating_' + Math.round(rating) + ' tier_' + tier + '" id="fqResult_' + i + '">'
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
        },
        error: function() {
          $('#ajaxNotification').html('<p class="redNote"><i class="fa fa-exclamation-triangle"></i> Nothing found! Did you enter address correctly?</p>').addClass('loaded')
        }
      })
      return false
    }
  })
})