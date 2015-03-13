  $("#quiz_app").hide().fadeIn();

  var jQFadeIn = function(target) {
    $(target).hide().fadeIn();
    console.log("fade in");
  }

var jQWelcome = function(name) {
  var messageObject = $("<div/>")
  $(document.body).append(messageObject);
  messageObject.text("Let's get started " + name + "!");
  messageObject.addClass("user_message");
  
  messageObject.animate({"top": "85vh"}, 700);
  messageObject.delay(1400);
  messageObject.animate({"top": "110vh"}, 700);
};

var jQWelcomeBack = function(name) {

};

// Button Animations

$(document).ready(function(){

  $(document.body).on("mouseover", "label", function(){
    $(this).addClass("highlight");
  });

  $(document.body).on("mouseleave", "label", function(){
    $(this).removeClass("highlight");
  });

});


