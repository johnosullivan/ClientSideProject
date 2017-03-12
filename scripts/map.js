$(document).ready(function(){

  function hideLoading(){
    $("#loading").hide();
  }
  setTimeout(hideLoading, 2000);

  $.parameter = function(name){
	  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	  return results[1] || 0;
  }
  $('#openMenu').click(function() {
    document.getElementById("menu").style.display = "block";
    //$("#map").width($("#map").width() - 330);
  });
  $('#closeMenu').click(function() {
    document.getElementById("menu").style.display = "none";
    //$("#map").width($("#map").width() + 330);
  });

});
