"use strict";

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
  openingMenu.setAttribute("id", "register_form");

  var introText = document.createElement("div");
  introText.setAttribute("id", "welcome_message");
  introText.textContent = "Welcome to the quiz. ";
  introText.textContent += "Please enter your name.";

  openingMenu.appendChild(introText);
  var login = this.register();
  openingMenu.appendChild(login);

  var buttons = createButtons(this.questionCounter,
                              this.totalQs, this);
  openingMenu.appendChild(buttons);
  
  writeToPage(openingMenu);
}


Game.prototype.displayNextQuestion = function() {

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
  
  // Create answers. Pre-checked if already answered
  var prevAnswer = this.userAnswers[questionIndex];
  var answerContainer = createAnswers(currentQuestion, prevAnswer);
  
  qForm.appendChild(answerContainer);
  
  var buttons = createButtons(questionIndex, totalQs, this);
  qForm.appendChild(buttons);

  writeToPage(qForm);
}


Game.prototype.submitQuestion = function(question, answer) {

  this.userAnswers[question] = parseInt(answer);
  this.questionCounter += 1;
  this.displayNextQuestion();
}


Game.prototype.goBack = function(question, answer) {

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
  scoreString = document.createTextNode(scoreString)
  var scoreStringHolder = document.createElement("div");
  scoreStringHolder.setAttribute("id", "score");
  scoreStringHolder.appendChild(scoreString);
  
  var rating = "";
  var image = document.createElement("img");
  console.log(this.score);
  if (this.score < this.totalQs * 0.34) {
    image.setAttribute("src", "images/flames.jpg");
    rating = "Better luck next time.";
  } else if (this.score < this.totalQs * 0.67) {
    image.setAttribute("src", "images/middletown.jpg");
    rating = "Not bad!";
  } else {
    image.setAttribute("src", "images/empire.jpg");
    rating = "You are the master!";
  }
  var thanks = "Thanks for playing the quiz.";

  rating = document.createTextNode(rating)
  thanks = document.createTextNode(thanks);
  var brk = document.createElement("br");
  scoreStringHolder.appendChild(image);
  scoreStringHolder.appendChild(rating);
  scoreStringHolder.appendChild(brk);
  scoreStringHolder.appendChild(thanks);
  writeToPage(scoreStringHolder);
}


Game.prototype.register = function() {

  var gameObjRef = this;
  var regForm = document.createElement("form");
  regForm.setAttribute("action", "");
  regForm.setAttribute("id", "login_form");

  var loginField = document.createElement("input");
  loginField.setAttribute("type", "text");
  loginField.setAttribute("name", "login");
  loginField.setAttribute("id", "login_box");
  if (document.cookie) {
    var cookie = document.cookie;

    // Doesn't work properly on local environment.
    console.log(cookie);
    var cookieRegEx = /username=(\w+)\B/;
    var userName = cookie.replace(cookieRegEx, "$1");
    

    loginField.setAttribute("value", userName);
  }
  var loginHolder = document.createElement("label");
  loginHolder.textContent = "Name:";
  loginHolder.appendChild(loginField);
  regForm.appendChild(loginHolder);

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
  jQFadeIn(stuff);
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

    var answerContainer = document.createElement("div");
    answerContainer.setAttribute("id", "answer_container");
  // Create list of answers. Half 'left' sided, half 'right' sided.
    var leftList = document.createElement("ul");
    leftList.className = "answer_container";
    leftList.setAttribute("id", "list_left");
    var rightList = document.createElement("ul");
    rightList.className = "answer_container"
    rightList.setAttribute("id", "list_right");

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


    if (i < question.choices.length / 2.0) {
      answerLabel.insertBefore(button, answerLabel.firstChild);
      answerLabel.appendChild(span);
      leftList.appendChild(answerLabel);
    } else {
      answerLabel.appendChild(span);
      answerLabel.insertBefore(span, answerLabel.firstChild);
      answerLabel.insertBefore(button, answerLabel.firstChild);
      rightList.appendChild(answerLabel);
    }
    answerContainer.appendChild(leftList);
    answerContainer.appendChild(rightList);
  }
  return answerContainer;
}


function createButtonsDiv() {

  var buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "buttons");
  return buttonsDiv;
}


function createButtons(qIndex, totalQs, gameObjRef) {

  var buttonsDiv = createButtonsDiv();

  // Button to begin quiz - first page

  if (qIndex < 0) {

    var startButtonHolder = buttonAndLabel("start");

    startButtonHolder.addEventListener("click", function(event) {

      event.preventDefault();
      // Save login from form

      var form = document.getElementById("login_form");
      checkUsername(form.login.value);
      
      makeCookie(form.login.value);
      this.loggedIn = true;

      // Initialise game. Then load first question
      if (gameObjRef.questions) {
        gameObjRef.questionCounter = 0;
        gameObjRef.totalQs = gameObjRef.questions.length;
        gameObjRef.displayNextQuestion();
      }
      
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
        break;
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


function checkUsername(name) {
  // Check existing names
  for (var i = 0; i < localStorage.length; i++) {
    var val = localStorage.getItem(localStorage.key(i));
    if (val === name) {
      jQWelcome(name, "Welcome back ");
      return;
    }

  }
  var storageRef = "login_0";
  storageRef = findUsernameIndex(storageRef);
  localStorage[storageRef] = name;
  jQWelcome(name, "Let's get started ");
}


function findUsernameIndex(storageRef) {

  // Function calls recursively untill empty slot found.
  if (localStorage[storageRef]) {
    var currentDigit = parseInt(storageRef.substring(storageRef.length - 1));
    storageRef = storageRef.substring(0, storageRef.length -1)
                                      + (currentDigit + 1);

    return findUsernameIndex(storageRef);
  } else {
    return storageRef;
  }
}


function makeCookie(name) {

  var date = new Date();
    date = new Date(date.setMonth(date.getMonth() + 1));
    console.log(date);
    var cookieString = "username=" + name + "; expires=" + date.toGMTString();
    document.cookie = cookieString;
}


function runGame() {

  var CurrentGame = new Game();
  CurrentGame.getQuestions();
}
