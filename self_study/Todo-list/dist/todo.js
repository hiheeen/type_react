"use strict";
const inputElement = document.querySelector('#todo-input');
const keyCheck = (event) => {
    if ((event === null || event === void 0 ? void 0 : event.key) === 'Enter') {
        if (inputElement && inputElement.value) {
            const toDo = document.createElement('li');
            const toDoList = document.querySelector('#todo-list');
            toDo.innerText = inputElement.value;
            toDoList.appendChild(toDo);
            inputElement.value = '';
        }
    }
};
if (inputElement) {
    inputElement.addEventListener('keydown', keyCheck);
}
