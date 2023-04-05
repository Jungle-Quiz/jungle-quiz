const quizContainer = document.querySelector("#quiz-container");

const searchParams = new URLSearchParams(location.search);

const count = searchParams.get("count");
const category = searchParams.get("category");

const applyCategory = () => {
  const categoryText = {
    DS_LANG: "자료구조/알고리즘 퀴즈",
    C_LANG: "C언어 퀴즈",
    PYTHON: "파이썬 퀴즈",
    OS: "운영체제 퀴즈",
    ETC: "기타 퀴즈",
  };

  const categoryElement = document.getElementById("title-category");
  categoryElement.innerText = categoryText[category];
};

const getProblems = async () => {
  try {
    const res = await axios.get(
      `/api/problems?category=${category}&count=${count}`
    );
    const problems = res.data.problems;

    let radioNumber = 0;
    problems.forEach((problem) => {
      const titleElement = document.createElement("div");
      titleElement.classList.add("text-lg", "mt-3");
      titleElement.innerHTML = `${problem.title}`;

      const contentContainer = document.createElement("div");
      contentContainer.classList.add("content-container");
      contentContainer.dataset.problemId = problem._id;

      problem.content.forEach((text) => {
        const labelElement = document.createElement("label");
        labelElement.classList.add("inline-flex", "items-center", "w-full");
        labelElement.innerHTML = `
          <input
            type="radio"
            class="form-radio text-indigo-600"
            name="radio-group-${radioNumber}"
          />
          <div class="bg-white hover:bg-gray-100 cursor-pointer p-2 rounded">
            ${text}
          </div>
        `;

        contentContainer.appendChild(labelElement);
      });

      quizContainer.append(titleElement);
      quizContainer.append(contentContainer);
      radioNumber++;
    });
  } catch (err) {
    alert(err);
  }
};

const handleWindowReady = async () => {
  applyCategory();
  await getProblems();
};

const handleSubmit = async () => {
  const problemIdList = [];
  const answerList = [];

  let isAllCheck = true;

  const contentContainers = document.querySelectorAll(".content-container");
  contentContainers.forEach((contentContainer) => {
    const radios = contentContainer.querySelectorAll("input[type='radio']");
    let isCheck = false;
    radios.forEach((radio, idx) => {
      if (radio.checked) {
        answerList.push(idx);
        isCheck = true;
      }
    });
    if (isCheck === false) {
      isAllCheck = false;
    }

    problemIdList.push(contentContainer.dataset.problemId);
  });

  if (isAllCheck === false) {
    return alert("풀리지 않은 문제가 있습니다");
  }

  try {
    // post 요청보내기
    const res = await axios.post("/api/solved_problems", {
      problems: problemIdList,
      answers: answerList,
    });

    localStorage.setItem("quiz_result", res.data);
    location.href = "/result";
  } catch (err) {
    alert(err);
  }

  // 전부 풀었는지 체크

  // request body 만들기

  // POST 요청 보내기
};

$(document).ready(handleWindowReady);