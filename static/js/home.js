const quizBtn = $("#quiz-btn");
const categorySelect = $("#category-select");
const countSelect = $("#count-select");

const handleQuizBtnClick = () => {
  const category = categorySelect.val();
  const count = countSelect.val();

  if (category === null) {
    return alert("카테고리를 선택해주세요");
  }

  if (count === null) {
    return alert("문항수를 선택해주세요");
  }

  location.href = `/quiz?category=${category}&count=${count}`;
};

quizBtn.on("click", handleQuizBtnClick);
