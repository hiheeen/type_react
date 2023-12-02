import axios, { AxiosResponse } from 'axios';
import { WeatherResponse, Test } from './interface/response';
import { useEffect, useState } from 'react';
interface ToDoItem {
  todo: string;
  completed: boolean;
}
interface WeatherData {
  name: string;
  weather: string;
}
export default function Todo() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    name: '',
    weather: '',
  });
  const inputElement: HTMLInputElement = document.querySelector('#todo-input')!;
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
  const savedWeatherData = localStorage.getItem('saved-weather')
    ? JSON.parse(localStorage.getItem('saved-weather') as string)
    : null;
  const saveItems = () => {
    saveItemList.length === 0
      ? localStorage.removeItem('toDos')
      : localStorage.setItem('toDos', JSON.stringify(saveItemList));
  };
  const createToDo = (toDo: ToDoItem) => {
    if (inputElement && inputElement.value.trim() !== '') {
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
      toDoList?.appendChild(toDoLi);
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
    }
  };

  if (saveItemList) {
    for (let i = 0; i < saveItemList.length; i++) {
      createToDo(saveItemList[i]);
    }
  }
  const keyCheck = (event: KeyboardEvent): void => {
    if (event?.key === 'Enter' && inputElement!.value.trim() !== '') {
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

  const weatherDataActive = ({ name, weather }: WeatherData) => {
    const locationNameTag: HTMLHeadElement =
      document.querySelector('#location-name-tag')!;
    locationNameTag.textContent = name;
    const weatherList = [
      'Clear',
      'Clouds',
      'Drizzle',
      'Fog',
      'Rain',
      'Snow',
      'Thunderstorm',
    ];
    weather = weatherList.includes(weather) ? weather : 'Fog';
    const backImage = process.env.PUBLIC_URL + `/images/${weather}.jpg`;
    document.body.style.backgroundImage = `url(${backImage})`;

    if (
      !savedWeatherData || // 없다면 truthy가 되서 바로 저장, 있다면 falsy가 되어 다음 식으로
      savedWeatherData?.name !== name ||
      savedWeatherData?.name !== name
    ) {
      localStorage.setItem('saved-weather', JSON.stringify({ name, weather }));
    }
  };
  const weatherSearch = (lat: number, lon: number) => {
    axios
      .get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c64bc32b1755a98826612cc0d6eaf1b1`
      )
      .then((res: AxiosResponse<WeatherResponse>) => {
        setWeatherData({
          name: res.data.name,
          weather: res.data.weather[0].main,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const askForLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }: GeolocationPosition) => {
        const { latitude, longitude } = coords;
        weatherSearch(latitude, longitude);
      },
      (error) => console.error(error)
    );
  };
  // const weatherSearch = async (
  //   lat: number,
  //   lon: number
  // ): Promise<WeatherResponse> => {
  //   const response = await axios.get<WeatherResponse>(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c64bc32b1755a98826612cc0d6eaf1b1`
  //   );
  //   return response.data;
  // };
  // const askForLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position: GeolocationPosition) => {
  //       const response = await weatherSearch(
  //         position.coords.latitude,
  //         position.coords.longitude
  //       ).then((res) => console.log(res));
  //     },
  //     (error) => console.error(error)
  //   );
  // };
  useEffect(() => {
    askForLocation();
  }, []);
  useEffect(() => {
    console.log(weatherData);
    weatherDataActive(weatherData);
  }, [weatherData]);
  //   함수 weatherSearch의 반환 타입이 Promise<WeatherResponse>인 이유는 axios.get 메서드가 비동기적으로 동작하기 때문입니다.

  // axios.get 메서드는 HTTP GET 요청을 보내고, 이 요청의 응답을 Promise 객체로 반환합니다. Promise 객체는 비동기 작업을 나타내는 객체로, 비동기 작업이 완료되면 최종 결과값을 제공합니다.

  // then 메서드는 Promise 객체가 성공적으로 해결되었을 때 호출되는 콜백 함수를 등록하는 역할을 합니다. 이 콜백 함수는 axios.get 메서드의 응답을 인자로 받아, 응답 데이터(res.data)를 반환합니다.

  // 하지만 이 콜백 함수가 동기적으로 동작하는 것이 아니라, Promise 객체가 성공적으로 해결되었을 때 비동기적으로 호출됩니다. 따라서 weatherSearch 함수는 즉시 res.data를 반환하는 것이 아니라, res.data를 반환하는 Promise 객체를 반환합니다.

  // await 키워드는 Promise 객체가 해결될 때까지 함수의 실행을 일시적으로 중지합니다. 따라서 await axios.get(...) 부분은 Promise 객체를 반환하며, 이 Promise 객체가 해결되면 그 결과값이 await 표현식의 값이 됩니다.

  // 그러나 await 키워드를 사용하는 함수는 항상 Promise를 반환해야 합니다. 여기서 return await axios.get(...)는 Promise 객체를 반환하므로, weatherSearch 함수의 반환 타입은 Promise<WeatherResponse>가 됩니다.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 id="location-name-tag">ToDo</h1>
      <div id="todo-container">
        <input id="todo-input" />
        <ul id="todo-list"></ul>
      </div>
      <div id="delete-btn-wrapper">
        <button onClick={deleteAll}>전체 삭제</button>
      </div>
    </div>
  );
}
// const weatherSearch = async (
//   lat: number,
//   lon: number
//   ): Promise<WeatherResponse> => {
//   return await axios
//   .get<WeatherResponse>(
//   https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c64bc32b1755a98826612cc0d6eaf1b1
//   );
//   };
//   const askForLocation = () => {
//   navigator.geolocation.getCurrentPosition(
//   async (position: GeolocationPosition) => {
//   const response = await weatherSearch(
//   position.coords.latitude,
//   position.coords.longitude
//   ).then((res) => console.log(res.data));
//   },
//   (error) => console.error(error)
//   );
//   };
