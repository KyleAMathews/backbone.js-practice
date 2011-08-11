$ = jQuery

$ ->
  $("button").click ->
    answers = {}
    $("#answers tr").each ->
      question = $(@).find('td.question').html()
      answer = $(@).find('td.answer').html()
      answers[question] = answer

    # Post answers
    $.post(
      "post.php"
      answers: answers
      id: 'something'
      (data) -> alert 'Answers saved!'
      'json'
    )
