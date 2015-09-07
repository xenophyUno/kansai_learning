

function disp(){
	var e = document.getElementById("canvas");
	e.style.background = "url('img/logo.gif')";
}



 function disp2(){
	document.createElement('img');
	var image = new Image();
	var i = document.getElementById("imgdiv");
	i.appendChild(image);
	image.onload = function(e){
		//var image_size= ImageGetNaturalSize(image);
	};
	image.src = "img/logo.gif";
}


/*function disp2(){
 var Img2 = document.getElementById('img2');
 Img2.src = 'img/logo.gif';
}*/