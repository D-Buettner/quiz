function Game() {
  this.questionCounter = -1;
  this.totalQs = null;
  this.score = 0;
  this.userAnswers = [];

}

Game.prototype.getQuestions = function() {
  var gameObjRef = this;
  console.log('getting questions..');
  var questionURL = "questions.json";
  this.httpRequest = new XMLHttpRequest();
  this.httpRequest.onreadystatechange = function() {
    // change status for live site- can show as 0 locally
    if (this.readyState != 4 || this.status === 404) {
      console.log('Questions not Loaded');
      return;
    } else {
      gameObjRef.questions = JSON.parse(this.responseText);
      console.log('Questions Loaded', gameObjRef.questions);
      gameObjRef.firstPage();
      return;
    }
  }
  this.httpRequest.open("GET", questionURL, true);
  this.httpRequest.send();
}

Game.prototype.firstPage = function() {
  console.log('yoyoyo', this.questions);
  var openingMenu = document.createElement("div");
  var introText = document.createElement("div");
  introText.textContent = "Welcome to the quiz. ";
  introText.textContent += "Click below to get started."
  openingMenu.appendChild(introText);
  var buttons = createButtons(this.questionCounter, this.totalQs, this);
  openingMenu.appendChild(buttons);
  writeToPage(openingMenu);
}

// Use prototype, users may ending up starting a new game
Game.prototype.displayNextQuestion = function() {
  var questionIndex = this.questionCounter;
  var totalQs = this.totalQs;
  if (questionIndex >= totalQs) {
    this.displayScore();
    return null;
  }
  var currentQuestion = this.questions[questionIndex];
  // Seperate functions for modularity (maybe change to jQuery later?)
  clearPrevious();
  var qForm = createForm();

  // Create question text
  var questionText = createQuestion(currentQuestion.question);
  qForm.appendChild(questionText);
  
  // Create Answers
  var answerContainer = document.createElement("div");
  answerContainer.setAttribute("id", "answer_container");
  var answerList = createAnswers(currentQuestion);
  for (var i = 0; i < answerList.length; i++) {
    answerContainer.appendChild(answerList[i]);
  }
  qForm.appendChild(answerContainer);
  
  var buttons = createButtons(questionIndex, totalQs, this);
  qForm.appendChild(buttons);


  writeToPage(qForm);
}

Game.prototype.submitQuestion = function(question, answer) {
  this.userAnswers[question] = parseInt(answer);
  this.questionCounter += 1;
  this.displayNextQuestion(this.questionCounter);
}

Game.prototype.displayScore = function() {
  for (var i = 0; i < this.totalQs; i++) {
    if (this.userAnswers[i] === this.questions[i].correctAnswer) {
      this.score += 1;
    }
  }
  clearPrevious();
  var scoreString = "You scored: ";
  scoreString += this.score;
  scoreString += " out of ";
  scoreString += this.totalQs;
  scoreString += " Thanks for playing the quiz!"
  scoreString = document.createTextNode(scoreString)
  var scoreStringHolder = document.createElement("div");
  scoreStringHolder.setAttribute("id", "score");
  scoreStringHolder.appendChild(scoreString);
  writeToPage(scoreStringHolder);
}

function clearPrevious() {
  var quizHolder = document.getElementById("quiz_app");
  while (quizHolder.firstChild) {
    quizHolder.removeChild(quizHolder.firstChild);
  }
}

function writeToPage(stuff) {
  var target = document.getElementById("quiz_app");
  target.appendChild(stuff);
}

function createForm() {
  // Create form element holding the new question.
  var qForm = document.createElement("form");
  qForm.setAttribute("id","question_form");
  qForm.setAttribute("action","");
  qForm.setAttribute("method","post");
  return qForm;
}

function createQuestion(text) {
    var questionText = document.createElement("div");
    var innerTextDiv = document.createElement("div");
    innerTextDiv.textContent = text;
    questionText.appendChild(innerTextDiv);
    questionText.setAttribute("id", "question_text");
    return questionText;
  }

function createAnswers(question) {
  // Create list of answers. Half 'left' sided, half 'right' sided.
  var answers = [];
  for (var i = 0; i < question.choices.length; i++) {
    var answerLabel = document.createElement("label");
    answerLabel.setAttribute("id", "answer_" + i);
    // textContent prefered over innerHTML
    answerLabel.textContent = question.choices[i];
    // Spans to create custom radio button.
    var span = document.createElement("span");
    span.appendChild(document.createElement("span"));
    var button = document.createElement("input");
    button.setAttribute("type", "radio");
    button.setAttribute("name", "selected_answer");
    button.setAttribute("value", i);
    button.setAttribute("class", 'answer_choices')
    // Class and span depending on side.
    if (i < question.choices.length / 2.0) {
      answerLabel.insertBefore(button, answerLabel.firstChild);
      answerLabel.appendChild(span);
      answerLabel.setAttribute("class", "left_answers");
    } else {
      answerLabel.insertBefore(span, answerLabel.firstChild);
      answerLabel.insertBefore(button, answerLabel.firstChild);
      answerLabel.setAttribute("class", "right_answers");
    }
    answers.push(answerLabel);
  }
  return answers;
}

function createButtons(qIndex, totalQs, gameObjRef) {
  // Create submit button
  console.log("creating buttons", qIndex, totalQs);
  var buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "buttons");
  // First page
  if (qIndex < 0) {
    console.log("creating start button..");
    var startButtonHolder = document.createElement("label");
        startButtonHolder.textContent = "Start the Quiz";
    var startButton = document.createElement("input");
    startButton.setAttribute("type", "submit");
    startButton.setAttribute("id", "start_button");
    startButtonHolder.appendChild(startButton);

    startButtonHolder.addEventListener("click", function(event) {
      // Initialise game. Then load first question
      console.log("start button firing..");
      console.log(gameObjRef.questions);
      if (gameObjRef.questions) {
        gameObjRef.questionCounter = 0;
        gameObjRef.totalQs = gameObjRef.questions.length;
        gameObjRef.displayNextQuestion();
      }
      event.preventDefault();
    });

    buttonsDiv.appendChild(startButtonHolder);

  // Middle pages
  } else if (0 <= qIndex < totalQs) {
    var nextButtonHolder = document.createElement("label");
    nextButtonHolder.textContent = "Next";
    var nextButton = document.createElement("input");
    nextButton.setAttribute("type", "submit");
    nextButton.setAttribute("id", "submit_button");
    nextButtonHolder.appendChild(nextButton);

     // Event listener for submit button
     // Redo after more event listener practise
    nextButtonHolder.addEventListener("click", function(event) {
      console.log('next button firing..')
      var answers = document.getElementsByClassName("answer_choices");
      for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
          gameObjRef.submitQuestion(qIndex, answers[i].value);
        }
        // Stops form from reloading 
        event.preventDefault();
      }
    });

    buttonsDiv.appendChild(nextButtonHolder);
  }
  return buttonsDiv;
}

function runGame() {
  var CurrentGame = new Game();
  CurrentGame.getQuestions();
}
