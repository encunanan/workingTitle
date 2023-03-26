//javascript
function display0() {
  var textToShow = document.getElementById("code display");
  if (textToShow.innerHTML == "CLICK THE START FOLDER TO BEGIN.") {
    textToShow.innerHTML = "NEW code here";
  } else {
    textToShow.innerHTML = "NEW code here";
  }
}

function display() {
  var textToShow = document.getElementById("code display");
  var closeWindowButton = document.getElementByClassName(close_code);

  closeWindowButton.addEventListener("click", textToShow.innerHTML = "Click another file or hit play");

  if (closeWindowButton.clicked == true) {
    textToShow.innerHTML = "Press another file";
  } 
  else if (textToShow.innerHTML == "CLICK THE START FOLDER TO BEGIN.") {
    textToShow.innerHTML = "NEW code here";
  } 
  else {
    textToShow.innerHTML = "NEW code here";
  }
}

var closebtns = document.getElementsByClassName("close_code");
var i;

for (i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener("click", function() {
    this.parentElement.style.display = 'none';
  });
}


var javaEditor = CodeMirror.fromTextArea(document.getElementById("java-code"), {
    lineNumbers: true,
    matchBrackets: true,
    mode: "text/x-java"
  });
  var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
  CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";