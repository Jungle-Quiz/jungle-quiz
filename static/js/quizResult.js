const quizResultHtml = localStorage.getItem("quiz_result");

if (!quizResultHtml) {
  location.href = "/";
}

document.querySelector("html").innerHTML = quizResultHtml;
