(function() {
  var $, is_answered, move_answer;
  $ = jQuery;
  $('#quiz ul li').click(function() {
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
    answer = $("#quiz ul.questions li.selected").html();
    return $('#answers > tbody:last').append('<tr><td>' + question + '</td><td>' + answer + '</td></tr>');
  };
}).call(this);
