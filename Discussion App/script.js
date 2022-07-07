var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var submitQuestionNode = document.getElementById("submitBtn");
var allQuestionsListNode = document.getElementById("dataList");
var questionSubjectInput = document.getElementById("subject");
var questionDescriptionInput = document.getElementById("question");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var commentNameInput = document.getElementById("pickName");
var commentDescriptionInput = document.getElementById("pickComment");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var newQuestionFormNode = document.getElementById("newQuestionForm");
var resolveQuestionNode = document.getElementById("resolveQuestion");
// submitQuestionNode.addEventListener("click",onQuestionSubmit);

newQuestionFormNode.addEventListener("click", function()
{
    createQuestionFormNode.style.display = "block";
    clearResponseSection();

})

function clearResponseSection()
{
    resolveQuestionContainerNode.style.display="none";
    resolveQuestionNode.style.display="none";
    responseContainerNode.style.display="none";
    commentContainerNode.style.display="none";
    commentatorNameNode.style.display="none";
    commentNode.style.display="none";
    submitCommentNode.style.display="none";
    questionDetailContainerNode.style.display="none";
}
questionSearchNode.addEventListener("input",function(event)
{
    filterResult(event.target.value);
}
);

function filterResult(query)
{

  var allQuestions = getAllQuestions();
  
  if(query)
  {
    clearQuestionPanel();    

    var filteredQuestions = allQuestions.filter(function(question)
    {
      if(question.title.includes(query))
      {
        return true;
      }
    });

    if(filteredQuestions.length)
    {
      filteredQuestions.forEach(function(question)
      {
        addQuestionToPanel(question);
      })
    }
    else
    {
      printNoMatchFound();
    }
  }
  else
  {
    clearQuestionPanel();    

    allQuestions.forEach(function(question)
    {
      
        addQuestionToPanel(question);
      
    });
  }
}
function printNoMatchFound()
{
  var title = document.createElement("h1");
  title.innerHTML = "No match found";

  allQuestionsListNode.appendChild(title) 
}
function clearQuestionPanel()
{
    allQuestionsListNode.innerHTML="";
}
submitQuestionNode.onclick= (onQuestionSubmit);

function onQuestionSubmit()
{
    var question = {
        title : questionTitleNode.value,
        description : questionDescriptionNode.value,
        responses : [],
        upvotes:0,
        downvotes:0,
        createdAt: Date.now(),
        isFav: false
    }
    saveQuestion(question);
    addQuestionToPanel(question);
};

function saveQuestion(question)
{
    var allQuestions = getAllQuestions();
    allQuestions.push(question);
    localStorage.setItem("questions",JSON.stringify(allQuestions));
}

function getAllQuestions()
{
    let allQuestions = localStorage.getItem("questions");
    if(allQuestions)
    {
        allQuestions = JSON.parse(allQuestions);
    }
    else
    {
        allQuestions = [];
    }
    return allQuestions;
}

function addQuestionToPanel(question)
{

    var questionContainer = document.createElement("div");
    questionContainer.setAttribute("id",question.title);
    questionContainer.style.background = "white";
    var newQuestionTitleNode = document.createElement("h4");
    newQuestionTitleNode.innerHTML = question.title;
    questionContainer.appendChild(newQuestionTitleNode)

    var newQuestionDescriptionNode = document.createElement("p");
    newQuestionDescriptionNode.innerHTML = question.description;
    questionContainer.appendChild(newQuestionDescriptionNode);

    allQuestionsListNode.appendChild(questionContainer);
    questionSubjectInput.value = "";
    questionDescriptionInput.value="";

    var upVoteTextNode = document.createElement("h4");
    upVoteTextNode.innerHTML = "upvote = "+question.upvotes;
    questionContainer.appendChild(upVoteTextNode);

    var downVoteTextNode = document.createElement("h4");
    downVoteTextNode.innerHTML = "downvote = "+question.downvotes;
    questionContainer.appendChild(downVoteTextNode);

    var creationDateAndTimeNode = document.createElement("h5"); 
    creationDateAndTimeNode.innerHTML ="Created At : "+ new Date(question.createdAt).toLocaleString();
    questionContainer.appendChild(creationDateAndTimeNode);
    var createdAtNode = document.createElement("h5");
    questionContainer.appendChild(createdAtNode);
    setInterval(function()
    {

        createdAtNode.innerHTML = "created " + convertDateToCreatedAtTime(question.createdAt)+" ago";

    },1000)

    var addToFavNode = document.createElement("button");
    addToFavNode.setAttribute("id","favButton");
    if(question.isFav)
    {
        addToFavNode.innerHTML = "Remove from Favourite";
    }
    else{
        addToFavNode.innerHTML = "Mark as Favourite";
    }
    // addToFavNode.innerHTML = "Add Fav";
    questionContainer.appendChild(addToFavNode);
    addToFavNode.addEventListener("click", toggleFavQuestion(question))

    questionContainer.onclick=onQuestionClick(question);
}
function toggleFavQuestion(question)
{
    return function(event)
    {
        question.isFav = !question.isFav;
        updateQuestion(question);
        if(question.isFav)
        {
            event.target.innerHTML = "Remove from Favourite";
        }
        else{
            event.target.innerHTML = "Mark as Favourite";
        }
    }
}
function convertDateToCreatedAtTime(date)
{
    var currentTime = Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();
    var secDiff = parseInt(timeLapsed/1000);
    var minDiff = parseInt(secDiff/60);
    var hourDiff = parseInt(minDiff/60);
    return hourDiff + " hours " + minDiff%60 + " minutes " + secDiff%60 + " seconds ";
    
}

function onQuestionClick(question)
{
    return function()
    {
        hideQuestionPanel();
        clearQuestionDetails();
        clearResponsePanel();
        showDetails();
        addQuestionToRight(question);
        question.responses.forEach(function(response)
        {
            addResponeInPanel(response);
        })
        submitCommentNode.onclick= onResponseSubmit(question);
        upvote.onclick=upvoteQuestion(question);
        downvote.onclick=downvoteQuestion(question);
        resolveQuestionNode.onclick = resolveQuestion(question);
    }
}

function resolveQuestion(question)
{
    return function()
    {
        var allQuestions = getAllQuestions();
        var ind;
        allQuestions.forEach(function(ques)
        {
            if(ques.title === question.title)
            {
                ind = allQuestions.indexOf(ques);
                allQuestions.splice(ind,1);
            }
        });
        localStorage.setItem("questions",JSON.stringify(allQuestions));
        clearQuestionPanel();
        onLoad();
        clearResponseSection();
    }
}



function upvoteQuestion(question)
{
    return function()
    {
    question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

function downvoteQuestion(question)
{
    return function()
    {
    question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

function updateQuestionUI(question)
{
    var questionContainerNode = document.getElementById(question.title);
    // console.log(questionContainerNode.childNodes);
    questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
    questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;

}

function updateQuestion(updatedQuestion)
{
    var allQuestions = getAllQuestions();
    var revisedQuestions = allQuestions.map(function(question)
    {
        if(updatedQuestion.title === question.title)
        {
            return updatedQuestion;
        }
        return question;
    })
    localStorage.setItem("questions",JSON.stringify(revisedQuestions));  

}
function onResponseSubmit(question)
{
    return function()
    {
        var response = {
            name: commentatorNameNode.value,
            description: commentNode.value
        };
        saveResponse(question,response);
        addResponeInPanel(response);
    }
}

function addResponeInPanel(response)
{
    var userNameNode = document.createElement("h4");
    userNameNode.innerHTML = response.name;
    var userCommentNode = document.createElement("p");
    userCommentNode.innerHTML =  response.description;
    var container = document.createElement("div");
    container.appendChild(userNameNode);
    container.appendChild(userCommentNode);
    responseContainerNode.appendChild(container);
    container.style.background = "grey";
    commentNameInput.value="";
    commentDescriptionInput.value="";

}
function hideQuestionPanel()
{
    createQuestionFormNode.style.display = "none";
}

function showDetails()
{
    resolveQuestionContainerNode.style.display="block";
    resolveQuestionNode.style.display="block";
    responseContainerNode.style.display="block";
    commentContainerNode.style.display="block";
    commentatorNameNode.style.display="block";
    commentNode.style.display="block";
    submitCommentNode.style.display="block";
    questionDetailContainerNode.style.display="block";
}

function addQuestionToRight(question)
{
    var heading = document.createElement("h2");
    heading.innerHTML = "Question :";
    questionDetailContainerNode.appendChild(heading);
    var titleNode = document.createElement("h3");
    titleNode.innerHTML = question.title;

    var descriptionNode = document.createElement("p");
    descriptionNode.innerHTML=question.description;

    questionDetailContainerNode.appendChild(titleNode);
    questionDetailContainerNode.appendChild(descriptionNode);
    questionDetailContainerNode.style.background = "teal";
    questionDetailContainerNode.style.color = "white";

}

function saveResponse(updatedQuestion, response)
{
    var allQuestions = getAllQuestions();
    var revisedQuestions = allQuestions.map(function(question)
    {
        if(updatedQuestion.title === question.title)
        {
            question.responses.push(response)
        }
        return question;
    })
    localStorage.setItem("questions",JSON.stringify(revisedQuestions));
}

function clearQuestionDetails()
{
    questionDetailContainerNode.innerHTML="";
}

function clearResponsePanel()
{
    responseContainerNode.innerHTML="";
}
function onLoad()
{
    var allQuestions = getAllQuestions();
    allQuestions = allQuestions.sort(function(currentQ, nextQ)
    {
        if(currentQ.isFav)
        {
            return -1;
        }
        else{
            return 1;
        }
    });
    allQuestions.forEach(function(question)
    {
        addQuestionToPanel(question);
    }) 
}

onLoad();