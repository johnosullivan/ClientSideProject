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
  });
  $('#closeMenu').click(function() {
    document.getElementById("menu").style.display = "none";
  });

});
