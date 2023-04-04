const quizContainer = $("#quiz-container");
const addQuizBtn = $("#add-quiz");
const uploadQuizBtn = $("#upload-quiz-btn");
const categorySelect = $("#category");

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

$(".quiz-remove-btn").on("click", handleRemoveQuizBtnClick);

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
        <div class="flex flex-col">
        <div class="block text-gray-700 font-bold mb-2">
            보기를 입력하고 정답을 체크해주세요
        </div>
        <label class="inline-flex items-center mt-3">
            <input
            type="radio"
            class="form-radio text-indigo-600"
            name="radio-group"
            value="option1"
            />
            <input
            type="text"
            class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="1번 보기를 입력해주세요"
            />
        </label>
        <label class="inline-flex items-center mt-3">
            <input
            type="radio"
            class="form-radio text-indigo-600"
            name="radio-group"
            value="option2"
            />
            <input
            type="text"
            class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="2번 보기를 입력해주세요"
            />
        </label>
        <label class="inline-flex items-center mt-3">
            <input
            type="radio"
            class="form-radio text-indigo-600"
            name="radio-group"
            value="option3"
            />
            <input
            type="text"
            class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="3번 보기를 입력해주세요"
            />
        </label>
        <label class="inline-flex items-center mt-3">
            <input
            type="radio"
            class="form-radio text-indigo-600"
            name="radio-group"
            value="option3"
            />
            <input
            type="text"
            class="ml-3 block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="4번 보기를 입력해주세요"
            />
        </label>
        </div>
        <div class="flex justify-end">
            <button
              class="quiz-remove-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
              onclick="handleRemoveQuizBtnClick(event)"
            >
              문제 제거
            </button>
          </div>
    </div>`;

  quizContainer.append(html);
};

const handleUploadQuizBtnClick = () => {
  // 누락된 사항 체크
  const selectedValue = categorySelect.val();
  if (selectedValue === null) {
    alert("퀴즈의 카테고리를 선택해주세요");
    categorySelect.focus();
    return;
  }

  const textareas = $("textarea");
  let checkTextarea = true;
  textareas.each(function () {
    if ($(this).val() === "") {
      $(this).focus();
      alert("퀴즈의 제목을 입력해주세요");
      checkTextarea = false;
      return false;
    }
  });
  if (checkTextarea === false) {
    return;
  }

  // 입력된 데이터를 request body 형식에 맞춰 변형
  // POST Request 보내기
};

addQuizBtn.on("click", handleAddQuizBtnClick);
uploadQuizBtn.on("click", handleUploadQuizBtnClick);
