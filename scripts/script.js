// to do:
//
// write labeling function
// 2 divs for questions 

function Game() {
  this.questionCounter = -1;
  this.totalQs = null;
  this.score = 0;
  this.userAnswers = [];
  this.loggedIn = false;
}


Game.prototype.getQuestions = function() {
  var gameObjRef = this;
  var questionURL = "questions.json";
  this.httpRequest = new XMLHttpRequest();
  this.httpRequest.onreadystatechange = function() {
    // change status for live site- can show as 0 locally
    if (this.readyState != 4 || this.status === 404) {
      return;
    } else {
      gameObjRef.questions = JSON.parse(this.responseText);
      gameObjRef.firstPage();
      return;
    }
  }
  this.httpRequest.open("GET", questionURL, true);
  this.httpRequest.send();
}


Game.prototype.firstPage = function() {
  var openingMenu = document.createElement("div");
  var introText = document.createElement("div");
  introText.textContent = "Welcome to the quiz. ";
  introText.textContent += "Login or Register."
  openingMenu.appendChild(introText);
  var login = this.register();
  openingMenu.appendChild(login);
  
  writeToPage(openingMenu);
}


// Use prototype, users may ending up starting a new game
Game.prototype.displayNextQuestion = function() {
  console.log('user answers: ', this.userAnswers);
  var questionIndex = this.questionCounter;
  var totalQs = this.totalQs;
  if (questionIndex >= totalQs) {
    this.displayScore();
    return null;
  }
  var currentQuestion = this.questions[questionIndex];
  clearPrevious();

  var qForm = createForm();

  var questionText = createQuestion(currentQuestion.question);
  qForm.appendChild(questionText);
  
  var answerContainer = document.createElement("div");
  answerContainer.setAttribute("id", "answer_container");

  // Create answers. Pre-checked if already answered
  var prevAnswer = this.userAnswers[questionIndex];
  var answerList = createAnswers(currentQuestion, prevAnswer);
  for (var i = 0; i < answerList.length; i++) {
    answerContainer.appendChild(answerList[i]);
  }
  
  qForm.appendChild(answerContainer);
  
  var buttons = createButtons(questionIndex, totalQs, this);
  qForm.appendChild(buttons);

  writeToPage(qForm);
}


Game.prototype.submitQuestion = function(question, answer) {
  console.log('submitting..');
  this.userAnswers[question] = parseInt(answer);
  this.questionCounter += 1;
  this.displayNextQuestion();
}


Game.prototype.goBack = function(question, answer) {
  console.log('goback firing..');
  console.log(answer);
  if (answer) {
    this.userAnswers[question] = parseInt(answer);
  }
  this.questionCounter -= 1;
  this.displayNextQuestion();
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


Game.prototype.register = function() {
  var gameObjRef = this;
  var regForm = document.createElement("form");
  regForm.setAttribute("action", "");
  regForm.setAttribute("id", "register_form");

  var loginField = document.createElement("input");
  loginField.setAttribute("type", "text");
  loginField.setAttribute("name", "login");
  var loginHolder = document.createElement("label");
  loginHolder.textContent = "Login: ";
  loginHolder.appendChild(loginField);
  regForm.appendChild(loginHolder);

  var pwdField = document.createElement("input");
  pwdField.setAttribute("name", "pwd");
  var pwdHolder = document.createElement("label");
  pwdHolder.textContent = "Password: ";
  pwdHolder.appendChild(pwdField);
  regForm.appendChild(pwdHolder);

  var brk = document.createElement("br");
  regForm.appendChild(brk);


  // Create login and register buttons

  var login = buttonAndLabel("login");
  var registerButton = buttonAndLabel("register");
  


  var quiz = document.getElementById("quiz_app");
  var buttons = createButtons(this.questionCounter,
                                  this.totalQs, this);
  // Display begin button once logged in or registered
  login.addEventListener("click", function(event) {
    event.preventDefault();
    if (regForm.login.value === localStorage.login &&
          regForm.pwd.value === localStorage.pwd) {
      this.loggedIn = true;

      removeItemById("register_form");

      quiz.appendChild(buttons);
    }
  });

  registerButton.addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.login = regForm.login.value;
    localStorage.pwd = regForm.pwd.value;

    removeItemById("register_form");
    quiz.appendChild(buttons);
  });

  regForm.appendChild(login);
  regForm.appendChild(registerButton);

  return regForm;

}

function removeItemById(id) {
  var target = document.getElementById(id);
  target.parentNode.removeChild(target);
}


function clearPrevious() {
  var quizHolder = document.getElementById("quiz_app");
  // Remove all children of quiz holder div
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


function createAnswers(question, prevAnswer) {
  console.log(prevAnswer, '<-- recreating with this checked');
  // Create list of answers. Half 'left' sided, half 'right' sided.
  var answers = [];
  for (var i = 0; i < question.choices.length; i++) {
    var answerLabel = document.createElement("label");
    answerLabel.setAttribute("id", "answer_" + i);
    // textContent preferred over innerHTML
    answerLabel.textContent = question.choices[i];
    // Spans to create custom radio button.
    var span = document.createElement("span");
    span.appendChild(document.createElement("span"));
    var button = document.createElement("input");
    button.setAttribute("type", "radio");
    button.setAttribute("name", "selected_answer");
    button.setAttribute("value", i);
    button.setAttribute("class", 'answer_choices')
    // Pre-checked if already 
    if (prevAnswer === i) {
      button.setAttribute("checked", true);
    }
    // Class and span depending on side.

    /*
    
    REDO WITH 2 DIVS WILL BE MUCH EASIER TO STYLE

    */
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

  // div holds all buttons
  var buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "buttons");


  // Button to begin quiz - first page
  if (qIndex < 0) {

    var startButtonHolder = buttonAndLabel("start");

    startButtonHolder.addEventListener("click", function(event) {
      // Initialise game. Then load first question
      if (gameObjRef.questions) {
        gameObjRef.questionCounter = 0;
        gameObjRef.totalQs = gameObjRef.questions.length;
        gameObjRef.displayNextQuestion();
      }
      event.preventDefault();
    });

    buttonsDiv.appendChild(startButtonHolder);
  }


  // Middle pages - next question button

  if (0 <= qIndex < totalQs) {
    var nextButtonHolder = buttonAndLabel("next");

     // Event listener for submit button
     // Redo after more event listener practice
    nextButtonHolder.addEventListener("click", function(event) {
      event.preventDefault();
      var answers = document.getElementsByClassName("answer_choices");
      for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
          console.log('checked forward');
          gameObjRef.submitQuestion(qIndex, i);
          break;
        }
      }
    });
    buttonsDiv.appendChild(nextButtonHolder);
  }


  // Second Q and onwards - back button

  if (qIndex > 0) {
    var backButtonHolder = buttonAndLabel("back");

    // Bug- Quiz doesn't save selection unless submitted w/ 'next'
    backButtonHolder.addEventListener("click", function(event) {
      event.preventDefault();
      var answers = document.getElementsByClassName("answer_choices");
      for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
          gameObjRef.goBack(qIndex, i);
          break;
        }
        gameObjRef.goBack(qIndex);
      }
    });
    buttonsDiv.insertBefore(backButtonHolder, buttonsDiv.firstChild);
  }
  return buttonsDiv;
}


function buttonAndLabel(name) {
  // Create a button formatted for quiz
  var label = document.createElement("label");
  label.textContent = name[0].toUpperCase();
  label.textContent += name.substring(1);
  var button = document.createElement("input");
  button.setAttribute("type", "submit")
  button.setAttribute("id", name + "_button");
  label.className = "button";
  label.appendChild(button);

  return label;
}


function runGame() {
  var CurrentGame = new Game();
  CurrentGame.getQuestions();
}
