$ ->
  class window.Item extends Backbone.Model
    defaults:
      content: "cat picture"
      matched: false
      selected: false

    # Toggle the matched state of this todo item.
    toggleMatched: ->
      @set({ matched: !@get("matched") })

      # If the item is 'matched' then it must be unselected.
      if @get("matched") then @set( { selected: false, silent: true} )

    # Toggle the selected state of this todo item.
    toggleSelected: ->
      @set({ selected: !@get("selected") })

  class window.Match extends Backbone.Model

  class window.SetItems extends Backbone.Collection
    model: Item

    initialize: ->
      @bind("change:selected", @unselectSiblings)

    getUnmatched: ->
      return @filter (item) ->
        !item.get("matched")

    getSelected: =>
      return @filter (item) ->
        item.get("selected")

    unselectSiblings: (item) ->
      siblings = (model for model in @models when model.cid isnt item.cid)
      for sibling in siblings
        if sibling.get("selected")
          sibling.set {selected: false}, {silent: true}
          # Manually trigger a change so the item is rerendered.
          sibling.trigger('change')

    selectedCount: ->
      return @getSelected().length

  class window.Matches extends Backbone.Collection
    model: Match

  class window.ItemView extends Backbone.View
    tagName: "li"

    events:
      "click"         : "toggleSelect"

    initialize: ->
      @model.bind('change', @render)
      @model.view = @

    render: =>
      # If the item is matched, remove from the list.
      if @model.get("matched")
        @remove()
      else
        $(@el).html( @model.get("content") )

        if @model.get("selected")
          $(@el).addClass("selected")
        else
          $(@el).removeClass("selected")

      return @

    toggleSelect: ->
      @model.toggleSelected()
      @render()

  class ListView extends Backbone.View
    tagName: "ul"

    initialize: ->
      @collection.bind('add', @addItem)

    render: =>
      renderedItems = @collection.getUnmatched().map (item) ->
        itemView = new ItemView { 'model': item }
        return itemView.render().el

      $(@el).html(renderedItems)
      return @

    addItem: (item) =>
      itemView = new ItemView { model: item }
      $('ul', @el).append(itemView.render().el)


  class UnansweredView extends Backbone.View
    el: $("#quiz")

    initialize: ->
      @questions = @options.questions
      @answers = @options.answers

      # Bind to "selected" being changed in an item and check for a match.
      @questions.bind("change:selected", @isMatch)
      @answers.bind("change:selected", @isMatch)

      # Initialize the Question and Answer views.
      @questionsView = new ListView( { className: 'questions', collection: @questions } )
      @answersView = new ListView( { className: 'answers', collection: @answers } )

      # Initialize the Matches Collection and View.
      @matches = new Matches()
      @matchesView = new MatchesView( { collection: @matches } )

      @render()

    render: =>
      $(@el).append( @questionsView.render().el )
      $(@el).append( @answersView.render().el )
      return @

    isMatch: =>
      if @questions.selectedCount() is 1 and @answers.selectedCount() is 1
        @matchIsMade()

    # If a match is made, extract the question and answer and copy them
    # to the matches collection.
    matchIsMade: =>
      question = @questions.getSelected()[0]
      answer = @answers.getSelected()[0]
      question.toggleMatched()
      answer.toggleMatched()
      match = new Match( { question: question, answer: answer } )
      @matches.add( match )

  class MatchedView extends Backbone.View
    tagName: 'tr'

    initialize: ->
      @model.bind('change', @render)
      @model.view = @

    render: =>
      $(@el).html("<td>" + @model.get("question").get("content") + "</td><td>" + @model.get("answer").get("content") + "</td>")
      return @


  class MatchesView extends Backbone.View
    el: $("#answered")

    initialize: ->
      $(@el).append("<div class='count'></div>")
      @collection.bind("all", @renderCount)
      @collection.bind("add", @addOne)
      @renderCount()

    renderCount: =>
      $('.count', @el).html("Matches made: " + @collection.length)

    addOne: (match) =>
      view = new MatchedView( { model: match } )
      $('#answers tbody', @el).append( view.render().el )

  # Initialize models and collections.
  Question_data = ['Apple', 'unicorn', 'cat', 'funky']
  Answer_data = ['pink'
                 'red'
                 '<img src="http://placekitten.com/200/300" />'
                 '<img src="http://t2.gstatic.com/images?q=tbn:ANd9GcTGGVesaH1Bq6KHz0nOSqJOCadEICGB1lWXjun6miu3Pdt5oCaa" />'
                 'this is so wrong'
                 'wildness'
                 'turquoise']

  # Initialize question and answer models.
  questionModels = Question_data.map (question) -> new Item( { 'content': question, 'type': 'question' } )
  window.questions = new SetItems( questionModels )

  answerModels = Answer_data.map (answer) -> new Item( { 'content': answer, 'type': 'answer' } )
  window.answers = new SetItems( answerModels )

  window.unansweredView = new UnansweredView( { 'questions': questions, 'answers': answers } )
