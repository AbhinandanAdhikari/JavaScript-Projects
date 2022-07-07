var textArea=document.getElementById("textarea");
var language=document.getElementById("language");
var outputArea=document.getElementById("outputArea");
var butt=document.getElementById("compilerButton");
butt.addEventListener("click",function()
{
    var code=textArea.value;
    var langid=language.value;
    compiler(code,langid);

})

function compiler(code,langid)
  {
    var request=new XMLHttpRequest();
    request.open("POST","https://codequotient.com/api/executeCode");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({code:code,langId:langid}));
    setTimeout(function(event){
       var response=JSON.parse(request.responseText);
       console.log(response);
       printOutput(response.codeId);
       
     },5000);
}


function printOutput(codeId)
{
  var request=new XMLHttpRequest();
  request.open("GET","https://codequotient.com/api/codeResult/"+codeId);
  request.send();

  request.addEventListener("load",function(event){
    var abc=JSON.parse(event.target.responseText);

    var data=JSON.parse(abc.data);

    if(data.output!==""){
      outputArea.innerHTML=data.output;
    //   alertwindow();
    }
    else{
      outputArea.innerHTML="ERROR:"+data.errors;
    //   alertwindow();
    }
  });
}

window.alert("Always refresh your page to write new code");





