const handleSpinnerBtnClick = (event) => {
  event.currentTarget.innerHTML = `
    <div class="flex justify-center items-center">
      <div class="loader"></div>
    </div>
    `;
};
