(function() {
  var $;
  $ = jQuery;
  $(function() {
    return $("button").click(function() {
      var answers;
      answers = {};
      $("#answers tr").each(function() {
        var answer, question;
        question = $(this).find('td.question').html();
        answer = $(this).find('td.answer').html();
        return answers[question] = answer;
      });
      return $.post("post.php", {
        answers: answers,
        id: 'something'
      }, function(data) {
        return alert('Answers saved!');
      }, 'json');
    });
  });
}).call(this);
