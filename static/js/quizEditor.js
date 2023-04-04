const quizContainer = $("#quiz-container");
const addQuizBtn = $("#add-quiz");
const uploadQuizBtn = $("#upload-quiz-btn");
const addContentBtn = $("#add-multiple-choice-btn");
const categorySelect = $("#category");

let quizNumber = 1;

const handleRemoveQuizBtnClick = (event) => {
  const result = confirm("해당 퀴즈를 삭제하시겠습니까?");
  if (result === false) {
    return;
  }
  const btn = $(event.currentTarget);
  const quizElement = btn.parent().parent();
  const hrElement = quizElement.prev();
  quizElement.remove();
  hrElement.remove();
};

const handleAddContentBtnClick = (event) => {
  const btn = $(event.currentTarget);
  const contentContainer = btn.parent().prev();
  const radioElements = contentContainer.find("input[type='radio']");

  console.log(contentContainer);

  const radioValue =
    parseInt(radioElements[radioElements.length - 1].getAttribute("value")) + 1;
  const radioName = radioElements[0].getAttribute("name");

  const contentHTML = `
    <label class="inline-flex items-center mt-3 w-full">
      <input type="radio" class="form-radio text-indigo-600" name="${radioName}" value="${radioValue}">
      <input type="text" class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="보기를 입력해주세요">
    </label>
  `;

  contentContainer.append(contentHTML);
};

const handleAddQuizBtnClick = () => {
  const html = `
    <hr class="border-t-2 border-gray-300 my-8" />
    <div class="mb-3">
      <div class="mb-3">
        <label class="block text-gray-700 font-bold mb-2" for="textarea">
          문제를 입력해주세요:
        </label>
        <textarea
          placeholder="문제를 입력해주세요."
          class="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="textarea"
          rows="4"
        ></textarea>
      </div>
      <div class="flex flex-col mb-2 multiple-choice">
        <div class="block text-gray-700 font-bold mb-2">
          보기를 입력하고 정답을 체크해주세요
        </div>
        <div class="multiple-choice-container">
          <label class="inline-flex items-center mt-3 w-full">
            <input
              type="radio"
              class="form-radio text-indigo-600"
              name="radio-group-${quizNumber}"
              value="0"
            />
            <input
              type="text"
              class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="보기를 입력해주세요"
            />
          </label>
          <label class="inline-flex items-center mt-3 w-full">
            <input
              type="radio"
              class="form-radio text-indigo-600"
              name="radio-group-${quizNumber}"
              value="1"
            />
            <input
              type="text"
              class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="보기를 입력해주세요"
            />
          </label>
        </div>
        <div class="flex justify-center mb-2 mt-3">
          <button
            id="add-multiple-choice-btn"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onclick="handleAddContentBtnClick(event)"
          >
            +보기 추가
          </button>
        </div>
      </div>
    </div>
    
    `;

  quizContainer.append(html);
  quizNumber++;
};

// handleUploadQuizBtnClick 이벤트 내에서 사용되는 함수들

const checkCategory = () => {
  const selectedValue = categorySelect.val();
  if (selectedValue === null) {
    alert("퀴즈의 카테고리를 선택해주세요");
    categorySelect.focus();
    return false;
  }
  return selectedValue;
};

const checkTitles = () => {
  const textareas = $("textarea");

  const titles = [];
  let checkTextarea = true;
  textareas.each(function () {
    if ($(this).val() === "") {
      $(this).focus();
      alert("퀴즈의 제목을 입력해주세요");
      checkTextarea = false;
      return false;
    }

    titles.push($(this).val());
  });

  if (checkTextarea === false) {
    return false;
  } else {
    return titles;
  }
};

const checkMultipleChoiceList = () => {
  const multipleChoiceList = $(".multiple-choice");

  let isAllInputsFilled = true;
  let isAnswerChecked = false;

  multipleChoiceList.each(function () {
    const radios = $(this).find("input[type='radio']");
    const inputs = $(this).find("input[type='text']");

    let isRadioChecked = false;

    for (let i = 0; i < radios.length; i++) {
      console.log(radios[i].checked);
      if (radios[i].checked === true) {
        isRadioChecked = true;
      }
      if (inputs[i].value === "") {
        isAllInputsFilled = false;
      }
    }

    if (isRadioChecked === false) {
      alert("정답이 선택되지 않은 문제가 있습니다.");
      return false;
    }

    if (isAllInputsFilled === false) {
      alert("입력되지 않은 보기가 있습니다.");
      return false;
    }
  });

  if (isAnswerChecked === false) {
    return false;
  }

  if (isAllInputsFilled === false) {
    return false;
  }
  return multipleChoiceList;
};

const handleUploadQuizBtnClick = async () => {
  // 누락된 사항 체크
  const category = checkCategory();
  if (category === false) {
    return;
  }

  const titles = checkTitles();
  if (titles === false) {
    return;
  }

  const multipleChoiceList = checkMultipleChoiceList();

  if (multipleChoiceList === false) {
    return;
  }

  // 입력된 데이터를 request body 형식에 맞춰 변형

  const problems = [];
  for (let i = 0; i < titles.length; i++) {
    const radios = $(multipleChoiceList[i]).find("input[type='radio']");
    const inputs = $(multipleChoiceList[i]).find("input[type='text']");

    let answer;
    radios.each(function () {
      if (this.checked) {
        answer = this.value;
      }
    });

    const content = [];
    inputs.each(function () {
      content.push(this.value);
    });

    const problem = {
      title: titles[i],
      category,
      answer,
      content,
    };

    problems.push(problem);
  }

  console.log(problems);

  try {
    await axios.post("/api/problems", { problems });
    alert("문제를 성공적으로 생성하였습니다");
    location.href = "/";
  } catch (err) {
    alert(err);
  }
};

addQuizBtn.on("click", handleAddQuizBtnClick);
addContentBtn.on("click", handleAddContentBtnClick);
uploadQuizBtn.on("click", handleUploadQuizBtnClick);
