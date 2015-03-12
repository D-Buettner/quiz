$(document).ready(function(){
  console.log("jquery ready");
  $(document.body).on("mouseover", "#buttons", function(){
    $("#buttons").children().addClass(".button");
  });
  $(document.body).on("mouseover", "label", function(){
    $(this).addClass("highlight");
  });
  $(document.body).on("mouseleave", "label", function(){
    $(this).removeClass("highlight");
  });
});