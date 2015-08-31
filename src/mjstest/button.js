function hoge(){
		b=document.getElementById('btn');


		if(x==0)
		{
			b.style.background="blue";
			b.value="color change!b";
			x=1;
		}
		else
		{
			b.style.background="white";
			b.value="color change!w";
			x=0;
		}
	}
	y=0;

	function hoge2(){
		b2=document.getElementById('btn2');


		if(y==0)
		{
			b2.style.background="blue";
			b2.innerHTML="color change!2b";
			y=1;
		}
		else
		{
			b2.style.background="white";
			b2.innerHTML="color change!2w";
			y=0;
		}
	}