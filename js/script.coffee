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
  answer = $("#quiz ul.answers li.selected").html()
  $("#quiz ul li.selected").fadeOut('slow').remove();
  $('#answers > tbody:last').append('<tr><td class="question">' + question + '</td><td class="answer">' + answer + '</td></tr>')

$("button").click ->
  answers = []
  $("#answers tr").each ->
    question = $(@).find('td.question').html()
    answer = $(@).find('td.answer').html()
    answers[question] = answer

  # Post answers
  $.post "post.php", answers
