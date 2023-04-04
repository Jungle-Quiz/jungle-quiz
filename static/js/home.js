const quizContainer = $("#quiz-container");
const addQuizBtn = $("#add-quiz");

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
            placeholder="Enter your text here"
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
            placeholder="Enter your text here"
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
            placeholder="Enter your text here"
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
            placeholder="Enter your text here"
            />
        </label>
        </div>
    </div>`;

  quizContainer.append(html);
};

addQuizBtn.on("click", handleAddQuizBtnClick);
