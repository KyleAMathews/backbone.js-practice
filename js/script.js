(function() {
  var $, is_answered, move_answer;
  $ = jQuery;
  $('#quiz').delegate('li', 'click', function() {
    $(this).toggleClass('selected');
    return is_answered();
  });
  is_answered = function() {
    if ($("#quiz ul.questions li.selected").size() === 1 && $("#quiz ul.answers li.selected").size() === 1) {
      return move_answer();
    } else {
      return console.log("nothing yet... :(");
    }
  };
  move_answer = function() {
    var answer, question;
    console.log("We're ready Jack!");
    question = $("#quiz ul.questions li.selected").html();
    answer = $("#quiz ul.answers li.selected").html();
    $("#quiz ul li.selected").fadeOut('slow').remove();
    return $('#answers > tbody:last').append('<tr><td class="question">' + question + '</td><td class="answer">' + answer + '</td></tr>');
  };
  $("button").click(function() {
    var answers;
    answers = [];
    $("#answers tr").each(function() {
      var answer, question;
      question = $(this).find('td.question').html();
      answer = $(this).find('td.answer').html();
      return answers[question] = answer;
    });
    return $.post("post.php", answers);
  });
}).call(this);
