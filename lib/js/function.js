//javascript file


//Make the DIV element draggable:
dragElement(document.getElementById("start"));
dragElement(document.getElementById("header-text"));
dragElement(document.getElementById("url-images"));
dragElement(document.getElementById("bkgd-colors"));
dragElement(document.getElementById("bkgd-images"));
dragElement(document.getElementById("para-text"));
dragElement(document.getElementById("bold-text"));
dragElement(document.getElementById("italic-text"));
dragElement(document.getElementById("poster-1"));
dragElement(document.getElementById("poster-2"));
dragElement(document.getElementById("poster-3"));
dragElement(document.getElementById("poster-4"));
dragElement(document.getElementById("poster-5"));
dragElement(document.getElementById("move"));



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function swapToStart(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerText = 'The 3 main distinctions between HTML, CSS, and Javascript code are:\n\n HTML tells computer what elements exist\n(HTML = elements on page)\n\n CSS tells the computer how the elements will look\n(CSS = style)\n\n Javascript tells the computer what the elements will do\n(Javascript = function)\n\nOpen any other folder to continue.';
}

function swapToURLImages(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerText = 'Adding an image takes two parts. The first is placing the image. Since this is adding an element, it is HTML code.\n\n <img src= ADD URL HERE>\n\nThe second part is to place the image where you want. Here, you can see that you can set the height and width pixel size of the image. Appearance code is CSS.\n\n img {\nwidth: 50px;\nheight: 50px;\n}\n';
}

function swapToBKGDColors(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerText = 'To change the bkgd color, we want to target the body of the project.\n Use a HEX code or type a color name (such as blue)\n\n body {\nbackground-color: ADD COLOR HERE;\n}\n\n Since this references appearance, this is CSS code.\n';
}

function swapToHeaderText(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerHTML = 'Adding header text takes two parts. The first is to write your content. Since this is adding an element, it is HTML code.<br><br>&lt;h1&gt;This is some example text.&lt;/h1&gt;<br><br>The second part is to stylize the text to your liking. Appearance code is CSS.<br><br> h1 { <br> font-size: 24px; <br> color: SET COLOR HERE;<br>}';
}

function swapToBKGDImages(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerHTML = 'To make the bkgd an image, we want to target the body of the project. Paste a valid url in the designated area. <br><br> body { <br> background-image: url("PASTE IMAGE URL HERE");<br>background-size: cover;<br>}<br><br>Since this references appearance, this is CSS code.';
}

function swapToParaText(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerHTML = 'Similar to adding a header, adding paragraph text takes two parts. The first is to write your content. Since this is adding an element, it is written as HTML code.<br><br> &lt;p&gt;This is some example text.&lt;/p&gt;<br><br>The second part is to stylize the text to your liking. Appearance code is CSS.<br><br> p { <br> font-size: 24px; <br> color: SET COLOR HERE;<br>}';
}

function swapToBoldText(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerHTML = 'Let\'s say you have some text that reads \"This is really important text\" <br> and you want the word really to be bold. You can use the &lt;b&gt; tag to create emphasis. The code would now look like this: <br><br> &lt;p&gt;This is &lt;b&gt;really&lt;/b&gt; important text.&lt;/p&gt;<br><br> and the result is this:<br><p>This is <b>really</b> important text.</p>';
}

function swapToItalicText(){
	document.getElementById('display_code').innerHTML = '';
	document.getElementById('display_code').innerHTML = 'Let\'s say you have some text that reads \"This is really important text\" <br> and you want the word really to be italicized. You can use the &lt;i&gt; tag to create emphasis. The code would now look like this: <br><br> &lt;p&gt;This is &lt;i&gt;really&lt;/i&gt; important text.&lt;/p&gt;<br><br> and the result is this:<br><p>This is <i>really</i> important text.</p>';
}


function reset(){
	document.getElementById("html-code").value = '';
	document.getElementById("css-code").value = '';
	document.getElementById("js-code").value = '';
}

function launchGalleryPage(){
	window.location.href="gallery.html";
}

function launchHomePage(){
	window.location.href="index.html";
}