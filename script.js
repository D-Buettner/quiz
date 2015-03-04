var questions = [
  {question:"Who was 'founder' and first Governor-General of Pakistan in 1947?",
    choices:["M. Gandhi", "J. Nehru", "M. Jinnah", "L. Khan"], correctAnswer:2},
  {question:"What is Attila the Hun also known as?", 
    choices:["The Scourge of the West", "The Scourge of God", 
              "The Scourge of the Papacy","Jody Highroller"], correctAnswer:1},
{question:"In what year did the Great Fire of London occur?",
     choices:["1666", "666", "1766", "1966"], correctAnswer:0}
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
  // Create submit button
  var submitButton = document.createElement("input");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("id", "submit_button");
  qForm.appendChild(submitButton);
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
  console.log('hey' + this.questionCounter, this.totalQs)
  this.displayNextQuestion(this.questionCounter);
}

Game.prototype.displayScore = function() {
  console.log('hey heres the score');
  // display score. Make more complex later? (diff text for better scores)
  clearOldQuestion();
  var scoreString = "You scored: ";
  scoreString += this.score;
  scoreString += " out of ";
  scoreString += this.totalQs;
  scoreString += " Thanks for playing the quiz!"
  writeToPage(document.createTextNode(scoreString));
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
    questionText.textContent = text;
    questionText.setAttribute("id", "question_text");
    return questionText;
  }

function createAnswers(question) {
  var answers = [];
  for (var i = 0; i < question.choices.length; i++) {
    var answerLabel = document.createElement("label");
    answerLabel.setAttribute("id", "answer_" + i);
    // textContent prefered over innerHTML for sec and performance
    answerLabel.textContent = question.choices[i];
  
    var button = document.createElement("input");
    button.setAttribute("type", "radio");
    button.setAttribute("name", "selected_answer");
    button.setAttribute("value", i);
    button.setAttribute("class", 'answer_choices')
    if (i < question.choices.length / 2.0) {
      answerLabel.appendChild(button);
    } else {
      answerLabel.insertBefore(button, answerLabel.firstChild);
      answerLabel.setAttribute("class", "right_answers");
    }
    answers.push(answerLabel);
  }
  return answers;
}

function runGame(question_list) {
  var CurrentGame = new Game(question_list);
  CurrentGame.displayNextQuestion(0);
}


