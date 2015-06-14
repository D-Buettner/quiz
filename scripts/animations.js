$("#quiz_app").hide().fadeIn();

function jQFadeIn(target) {

  $(target).hide().fadeIn();
};


function jQWelcome(name, message) {

  var messageObject = $("<div/>");
  $(document.body).append(messageObject);
  messageObject.text(message + name + "!");
  messageObject.addClass("user_message");
  
  messageObject.animate({"top": "82.5vh"}, 600);
  messageObject.delay(1200);
  messageObject.animate({"top": "110vh"}, 600);
};


$(document).ready(function(){

  // Button Animations
  $(document.body).on("mouseover", "label", function(){
    $(this).addClass("highlight");
  });

  $(document.body).on("mouseleave", "label", function(){
    $(this).removeClass("highlight");
  });
});


