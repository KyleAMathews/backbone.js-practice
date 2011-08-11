(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Answer_data, ListView, MatchedView, MatchesView, Question_data, UnansweredView, answerModels, questionModels;
    window.Item = (function() {
      __extends(Item, Backbone.Model);
      function Item() {
        Item.__super__.constructor.apply(this, arguments);
      }
      Item.prototype.defaults = {
        content: "cat picture",
        matched: false,
        selected: false
      };
      Item.prototype.toggleMatched = function() {
        this.set({
          matched: !this.get("matched")
        });
        if (this.get("matched")) {
          return this.set({
            selected: false,
            silent: true
          });
        }
      };
      Item.prototype.toggleSelected = function() {
        return this.set({
          selected: !this.get("selected")
        });
      };
      return Item;
    })();
    window.Match = (function() {
      __extends(Match, Backbone.Model);
      function Match() {
        Match.__super__.constructor.apply(this, arguments);
      }
      return Match;
    })();
    window.SetItems = (function() {
      __extends(SetItems, Backbone.Collection);
      function SetItems() {
        this.getSelected = __bind(this.getSelected, this);
        SetItems.__super__.constructor.apply(this, arguments);
      }
      SetItems.prototype.model = Item;
      SetItems.prototype.initialize = function() {
        return this.bind("change:selected", this.unselectSiblings);
      };
      SetItems.prototype.getUnmatched = function() {
        return this.filter(function(item) {
          return !item.get("matched");
        });
      };
      SetItems.prototype.getSelected = function() {
        return this.filter(function(item) {
          return item.get("selected");
        });
      };
      SetItems.prototype.unselectSiblings = function(item) {
        var model, sibling, siblings, _i, _len, _results;
        siblings = (function() {
          var _i, _len, _ref, _results;
          _ref = this.models;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            model = _ref[_i];
            if (model.cid !== item.cid) {
              _results.push(model);
            }
          }
          return _results;
        }).call(this);
        _results = [];
        for (_i = 0, _len = siblings.length; _i < _len; _i++) {
          sibling = siblings[_i];
          _results.push(sibling.get("selected") ? (sibling.set({
            selected: false
          }, {
            silent: true
          }), sibling.trigger('change')) : void 0);
        }
        return _results;
      };
      SetItems.prototype.selectedCount = function() {
        return this.getSelected().length;
      };
      return SetItems;
    })();
    window.Matches = (function() {
      __extends(Matches, Backbone.Collection);
      function Matches() {
        Matches.__super__.constructor.apply(this, arguments);
      }
      Matches.prototype.model = Match;
      return Matches;
    })();
    window.ItemView = (function() {
      __extends(ItemView, Backbone.View);
      function ItemView() {
        this.render = __bind(this.render, this);
        ItemView.__super__.constructor.apply(this, arguments);
      }
      ItemView.prototype.tagName = "li";
      ItemView.prototype.events = {
        "click": "toggleSelect"
      };
      ItemView.prototype.initialize = function() {
        this.model.bind('change', this.render);
        return this.model.view = this;
      };
      ItemView.prototype.render = function() {
        if (this.model.get("matched")) {
          this.remove();
        } else {
          $(this.el).html(this.model.get("content"));
          if (this.model.get("selected")) {
            $(this.el).addClass("selected");
          } else {
            $(this.el).removeClass("selected");
          }
        }
        return this;
      };
      ItemView.prototype.toggleSelect = function() {
        this.model.toggleSelected();
        return this.render();
      };
      return ItemView;
    })();
    ListView = (function() {
      __extends(ListView, Backbone.View);
      function ListView() {
        this.addItem = __bind(this.addItem, this);
        this.render = __bind(this.render, this);
        ListView.__super__.constructor.apply(this, arguments);
      }
      ListView.prototype.tagName = "ul";
      ListView.prototype.initialize = function() {
        return this.collection.bind('add', this.addItem);
      };
      ListView.prototype.render = function() {
        var renderedItems;
        renderedItems = this.collection.getUnmatched().map(function(item) {
          var itemView;
          itemView = new ItemView({
            'model': item
          });
          return itemView.render().el;
        });
        $(this.el).html(renderedItems);
        return this;
      };
      ListView.prototype.addItem = function(item) {
        var itemView;
        itemView = new ItemView({
          model: item
        });
        return $('ul', this.el).append(itemView.render().el);
      };
      return ListView;
    })();
    UnansweredView = (function() {
      __extends(UnansweredView, Backbone.View);
      function UnansweredView() {
        this.matchIsMade = __bind(this.matchIsMade, this);
        this.isMatch = __bind(this.isMatch, this);
        this.render = __bind(this.render, this);
        UnansweredView.__super__.constructor.apply(this, arguments);
      }
      UnansweredView.prototype.el = $("#quiz");
      UnansweredView.prototype.initialize = function() {
        this.questions = this.options.questions;
        this.answers = this.options.answers;
        this.questions.bind("change:selected", this.isMatch);
        this.answers.bind("change:selected", this.isMatch);
        this.questionsView = new ListView({
          className: 'questions',
          collection: this.questions
        });
        this.answersView = new ListView({
          className: 'answers',
          collection: this.answers
        });
        this.matches = new Matches();
        this.matchesView = new MatchesView({
          collection: this.matches
        });
        return this.render();
      };
      UnansweredView.prototype.render = function() {
        $(this.el).append(this.questionsView.render().el);
        $(this.el).append(this.answersView.render().el);
        return this;
      };
      UnansweredView.prototype.isMatch = function() {
        if (this.questions.selectedCount() === 1 && this.answers.selectedCount() === 1) {
          return this.matchIsMade();
        }
      };
      UnansweredView.prototype.matchIsMade = function() {
        var answer, match, question;
        question = this.questions.getSelected()[0];
        answer = this.answers.getSelected()[0];
        question.toggleMatched();
        answer.toggleMatched();
        match = new Match({
          question: question,
          answer: answer
        });
        return this.matches.add(match);
      };
      return UnansweredView;
    })();
    MatchedView = (function() {
      __extends(MatchedView, Backbone.View);
      function MatchedView() {
        this.render = __bind(this.render, this);
        MatchedView.__super__.constructor.apply(this, arguments);
      }
      MatchedView.prototype.tagName = 'tr';
      MatchedView.prototype.initialize = function() {
        this.model.bind('change', this.render);
        return this.model.view = this;
      };
      MatchedView.prototype.render = function() {
        $(this.el).html("<td>" + this.model.get("question").get("content") + "</td><td>" + this.model.get("answer").get("content") + "</td>");
        return this;
      };
      return MatchedView;
    })();
    MatchesView = (function() {
      __extends(MatchesView, Backbone.View);
      function MatchesView() {
        this.addOne = __bind(this.addOne, this);
        this.renderCount = __bind(this.renderCount, this);
        MatchesView.__super__.constructor.apply(this, arguments);
      }
      MatchesView.prototype.el = $("#answered");
      MatchesView.prototype.initialize = function() {
        $(this.el).append("<div class='count'></div>");
        this.collection.bind("all", this.renderCount);
        this.collection.bind("add", this.addOne);
        return this.renderCount();
      };
      MatchesView.prototype.renderCount = function() {
        return $('.count', this.el).html("Matches made: " + this.collection.length);
      };
      MatchesView.prototype.addOne = function(match) {
        var view;
        view = new MatchedView({
          model: match
        });
        return $('#answers tbody', this.el).append(view.render().el);
      };
      return MatchesView;
    })();
    Question_data = ['Apple', 'unicorn', 'cat', 'funky'];
    Answer_data = ['pink', 'red', '<img src="http://placekitten.com/200/300" />', '<img src="http://t2.gstatic.com/images?q=tbn:ANd9GcTGGVesaH1Bq6KHz0nOSqJOCadEICGB1lWXjun6miu3Pdt5oCaa" />', 'this is so wrong', 'wildness', 'turquoise'];
    questionModels = Question_data.map(function(question) {
      return new Item({
        'content': question,
        'type': 'question'
      });
    });
    window.questions = new SetItems(questionModels);
    answerModels = Answer_data.map(function(answer) {
      return new Item({
        'content': answer,
        'type': 'answer'
      });
    });
    window.answers = new SetItems(answerModels);
    return window.unansweredView = new UnansweredView({
      'questions': questions,
      'answers': answers
    });
  });
}).call(this);
