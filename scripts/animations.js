  $("#quiz_app").hide().fadeIn();

  var jQFadeIn = function(target) {
    $(target).hide().fadeIn();
  }

var jQWelcome = function(name, message) {
  var messageObject = $("<div/>")
  $(document.body).append(messageObject);
  messageObject.text(message + name + "!");
  messageObject.addClass("user_message");
  
  messageObject.animate({"top": "82.5vh"}, 600);
  messageObject.delay(1200);
  messageObject.animate({"top": "110vh"}, 600);
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


