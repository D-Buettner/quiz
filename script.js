var questions = [

  {question:"Gavrilo Princip assasinated the Archduke Franz Ferdinand in 1914, leading to the onset of WWI. What country was he from?",
    choices:["Russia", "Germany", "Bosnia", "Serbia"], correctAnswer:3},
  {question:"What was Attila the Hun also known as?", 
    choices:["The Scourge of the West", "The Scourge of God", 
              "The Scourge of the Papacy","Jody Highroller"], correctAnswer:1},
  {question:"In what year did the Great Fire of London occur?",
    choices:["1666", "666", "1766", "1966"], correctAnswer:0},
  {question:"Which American politician led infamous anti-communist hearings in 1954?",
     choices:["Joseph McCarthy", "John McCain","William McKinley", "Ronald McDonald" ],
              correctAnswer:0},
  {question:"The American invasion of Iraq in 1991 was known as Operation.. ?",
    choices:["Desert Wind", "Desert flower", "Desert Cactus", "Desert Storm"], correctAnswer:3},
  {question:"What international confrontation during the cold war nearly led to nuclear weapons being used in open warfare?",
    choices:["The Cuban Rum Crisis", "The Cuban Missile Crisis", "The Cuban Embargo Crisis",
             "The Cuban Salsa Crisis"], correctAnswer:1},
  {question:"Who was 'founder' and first Governor-General of Pakistan in 1947?",
    choices:["M. Gandhi", "J. Nehru", "M. Jinnah", "L. Khan"], correctAnswer:2},
  {question:"Which great Spanish military leader famously faught for both the Spanish and the Moors during the Reconquista?",
    choices:["El Empecinado","El Greco","El Cid","Elton John"], correctAnswer:2},
  {question:"What did Julius Caesar cross in 49 BC to begin the Great Roman Civil War?",
    choices:["The Alps", "The Rubicon", "The English Channel",
             "His Shoelaces"], correctAnswer:1},
  {question:"What city did the Ottoman Sultan Mehmed II 'The conqueror' capture in 1453?",
    choices:["Rome", "Vienna", "Jerusalem", "Constantinple"], correctAnswer:3},

];
//{question:, choices:[], correctAnswer:},

function Game(questionList) {
  this.questions = questionList;
  this.questionCounter = 0;
  this.totalQs = questionList.length;
  this.score = 0;

}
// Use prototype, users may ending up starting a new game
Game.prototype.displayNextQuestion = function(questionIndex) {
  if (questionIndex >= this.totalQs) {
    this.displayScore();
    return null;
  }
  var currentQuestion = this.questions[questionIndex];
  // Seperate functions for modularity (maybe change to jQuery later?)
  clearOldQuestion();
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
  
  var buttons = createButtons();
  qForm.appendChild(buttons);

  // Event listener for submit button
  // Maybe redo that/this with bind?
  var that = this;
  qForm.addEventListener("submit", 
        function(event) {
          var answers = document.getElementsByClassName("answer_choices");
          for (var i = 0; i < answers.length; i++) {
            if (answers[i].checked){
              that.submitQuestion(currentQuestion, answers[i].value);
            }
            // Stops form from reloading 
            event.preventDefault();
          }
        });
  writeToPage(qForm);
}

Game.prototype.submitQuestion = function(question, answer) {
  if (question.correctAnswer === parseInt(answer)) {
    this.score += 1;
  }
  this.questionCounter += 1;
  this.displayNextQuestion(this.questionCounter);
}

Game.prototype.displayScore = function() {
  // display score. Make more complex later? (diff text for better scores)
  clearOldQuestion();
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

function clearOldQuestion() {
  var oldForm = document.getElementById("question_form");
  if (oldForm) {
    oldForm.parentNode.removeChild(oldForm);
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

function createButtons() {
  // Create submit button
  var buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "buttons");
  var nextButtonHolder = document.createElement("label");
  nextButtonHolder.textContent = "Next";
  var nextButton = document.createElement("input");
  nextButton.setAttribute("type", "submit");
  nextButton.setAttribute("id", "submit_button");
  nextButtonHolder.appendChild(nextButton);
  buttonsDiv.appendChild(nextButtonHolder);
  return buttonsDiv;
}

function runGame(question_list) {
  var CurrentGame = new Game(question_list);
  CurrentGame.displayNextQuestion(0);
}
