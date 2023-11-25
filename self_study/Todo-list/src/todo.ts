interface ToDoItem {
  todo: string;
  completed: boolean;
}
const inputElement: HTMLInputElement | null =
  document.querySelector('#todo-input');
const toDoList: HTMLUListElement = document.querySelector('#todo-list')!;

const readToDo = (): ToDoItem[] => {
  const todoJSON = localStorage.getItem('toDos');
  if (todoJSON === null) {
    return [];
  } else {
    return JSON.parse(todoJSON);
  }
};

let saveItemList: ToDoItem[] = readToDo();

const saveItems = () => {
  saveItemList.length === 0
    ? localStorage.removeItem('toDos')
    : localStorage.setItem('toDos', JSON.stringify(saveItemList));
};
const createToDo = (toDo: ToDoItem) => {
  const toDoLi: HTMLLIElement = document.createElement('li');
  const toDoSpan: HTMLSpanElement = document.createElement('span');
  const toDoCheck: HTMLInputElement = document.createElement('input');
  toDoCheck.type = 'checkbox';
  toDoCheck.addEventListener('click', () => {
    toDoLi.classList.toggle('complete'); // class명 추가 toggle
  });
  toDoLi.addEventListener('dblclick', () => {
    toDoLi.remove();
    saveItemList = saveItemList.filter((item) => item !== toDo);
    saveItems();
  });
  // toDoSpan.innerText = inputElement.value;
  toDoSpan.innerText = toDo.todo;
  toDoCheck.checked = toDo.completed;
  toDoLi.appendChild(toDoCheck);
  toDoLi.appendChild(toDoSpan);
  toDoList.appendChild(toDoLi);
  toDoCheck.addEventListener('change', () => {
    toDo.completed = toDoCheck.checked;
    // 내가 이해하기 위해 애쓰던 부분
    // 여기서의 toDo는 createToDo 함수를 호출할 때 전달된 객체입니다.
    // 이 말인 즉슨, 함수 내부로 전달된 toDo객체가 기억되고 있다가, change이벤트가 발생했을 때 해당 변경사항인 checked여부를 기억하고 있던 toDo객체의 completed값으로 재할당해준다는거야?

    // => chatGPT의 대답
    // 네, 맞습니다. toDo는 createToDo 함수를 호출할 때 전달된 객체입니다.
    // 이 객체는 함수 내부에서 참조되고 기억되며, 이후 체크박스의 change 이벤트가 발생했을 때 해당 객체의 completed 속성을 업데이트하는데 사용됩니다.
    // createToDo 함수가 호출될 때 toDo 객체가 전달되면, 함수 내부에서는 이 객체를 참조하여 HTML 요소를 생성하고 목록에 추가합니다.

    // 이 때 toDo 객체의 정보는 함수 내의 클로저에 저장됩니다.
    // *****클로저는 함수가 정의될 때의 환경을 기억하고 있으며, 이를 통해 함수 외부의 변수 또는 객체에 접근할 수 있습니다.
    // 따라서 체크박스의 change 이벤트가 발생하면, 이벤트 핸들러 내에서는 클로저를 통해 toDo 객체에 접근할 수 있습니다.
    // 이 때 체크박스의 checked 속성을 사용하여 toDo 객체의 completed 속성을 업데이트할 수 있습니다.
    // 이 업데이트된 값은 saveItems 함수를 호출하여 saveItemList 배열에도 반영됩니다.
    // 즉, toDo 객체는 createToDo 함수를 호출할 때 전달되고, 이 객체는 함수 내부에서 클로저로 기억됩니다.
    // 체크박스의 change 이벤트가 발생하면 해당 객체의 completed 속성을 업데이트할 수 있습니다.
    saveItems();
  });
  if (toDo.completed === true) {
    toDoLi.classList.add('complete');
  }
  inputElement!.value = '';
};

if (saveItemList) {
  for (let i = 0; i < saveItemList.length; i++) {
    createToDo(saveItemList[i]);
  }
}
const keyCheck = (event: KeyboardEvent): void => {
  if (event?.key === 'Enter') {
    const newTodo: ToDoItem = {
      todo: inputElement!.value,
      completed: false,
    };
    saveItemList.push(newTodo);
    createToDo(newTodo);
    saveItems();
  }
};
if (inputElement) {
  inputElement.addEventListener('keydown', keyCheck);
}

const deleteAll = () => {
  const liList: NodeList = document.querySelectorAll('li');
  for (let i = 0; i < liList.length; i++) {
    (liList[i] as HTMLLIElement).remove();
  }
  localStorage.removeItem('toDos');
  inputElement!.value = '';
};
