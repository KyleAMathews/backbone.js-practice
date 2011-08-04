$ = jQuery

$('#quiz').delegate('li', 'click', ->
  $(@).toggleClass('selected')
  is_answered()
)

is_answered = () ->
  if $("#quiz ul.questions li.selected").size() is 1 and $("#quiz ul.answers li.selected").size() is 1
    move_answer()
  else
    console.log "nothing yet... :("

move_answer = () ->
  console.log "We're ready Jack!"
  question = $("#quiz ul.questions li.selected").html()
  answer = $("#quiz ul.questions li.selected").html()
  $("#quiz ul li.selected").fadeOut('slow').remove();
  $('#answers > tbody:last').append('<tr><td>' + question + '</td><td>' + answer + '</td></tr>')
