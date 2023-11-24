const inputElement: HTMLInputElement | null =
  document.querySelector('#todo-input');
const keyCheck = (event: KeyboardEvent): void => {
  if (event?.key === 'Enter') {
    if (inputElement && inputElement.value) {
      const toDo: HTMLLIElement = document.createElement('li');
      const toDoList: HTMLUListElement = document.querySelector('#todo-list')!;
      toDo.innerText = inputElement.value;
      toDoList.appendChild(toDo);
      inputElement.value = '';
    }
  }
};
if (inputElement) {
  inputElement.addEventListener('keydown', keyCheck);
}
