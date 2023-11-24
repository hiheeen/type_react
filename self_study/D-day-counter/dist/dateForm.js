"use strict";
const container = document.querySelector('#d-day-container');
container.style.display = 'none';
const message = document.querySelector('#d-day-message');
message.innerHTML = '<h3>D-day를 입력해주세요.</h3>';
const intervalIdArr = [];
const savedDate = localStorage.getItem('saved-date');
const inputValueObj = {
    inputYear: document.querySelector("#target-year-input"),
    inputMonth: document.querySelector("#target-month-input"),
    inputDate: document.querySelector("#target-day-input")
};
const dateFormMaker = () => {
    var _a, _b, _c;
    const inputYearValue = (_a = inputValueObj.inputYear) === null || _a === void 0 ? void 0 : _a.value;
    const inputMonthValue = (_b = inputValueObj.inputMonth) === null || _b === void 0 ? void 0 : _b.value;
    const inputDateValue = (_c = inputValueObj.inputDate) === null || _c === void 0 ? void 0 : _c.value;
    return `${inputYearValue}-${inputMonthValue}-${inputDateValue}`;
}; // 입력한 날짜를 형식 갖춰서 데이터 추출
const countMaker = (date) => {
    const nowDate = new Date().getTime();
    const targetDate = new Date(date).setHours(0, 0, 0, 0); // 오전 9시 기준이던 것을 자정을 기준으로 변경
    const remaining = (targetDate - nowDate) / 1000;
    // remaining (남은 시간)이 0이하이거나 유효하지 않은 값일 때의 처리 
    if (remaining <= 0) {
        message.innerHTML = '<h3>타이머가 종료되었습니다.</h3>';
        container.style.display = 'none';
        setClearInterval(); // 초기화 버튼 누른 게 아니기 때문에 실행해줌.
        localStorage.removeItem('saved-date');
    }
    else if (isNaN(remaining)) {
        message.innerHTML = '<h3>유효한 시간대가 아닙니다</h3>';
        container.style.display = 'none';
        setClearInterval(); // 초기화 버튼 누른 게 아니기 때문에 실행해줌.
        localStorage.removeItem('saved-date');
    }
    const remainingObj = {
        remainDate: Math.floor(remaining / 3600 / 24),
        remainHour: Math.floor(remaining / 3600) % 24,
        remainMin: Math.floor(remaining / 60) % 60,
        remainSec: Math.floor(remaining) % 60,
    };
    const documentObj = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    for (let i = 0; i < 5; i++) {
        let docKeys = Object.keys(documentObj);
        let remainKeys = Object.keys(remainingObj);
        documentObj[docKeys[i]].textContent = `${remainingObj[remainKeys[i]]}`;
        // keyof 를 사용하여 타입 안정성을 확보
    }
    // for in 문에서는 객체의 프로퍼티 갯수 만큼만 진행을 하는 조건식이다. i를 계속 증가시키지 않으므로 i에 대한 제어 x (for of는 배열)
    // let i = 0;
    // for (let key of documentObj) {
    // documentObj[key] = remainingObj[remainKeys[i]];
    // i++ 
    // }
    // documentObj 생성하여 반복되던 document.getElementById를 간소화하기 위해 id(key)의 배열 만들어 사용
    // 하지만 한 눈에 알아보기 쉽게 객체로 만들어 사용하는 것이 더 좋아보임 
    // let remainKeys = Object.keys(remainingObj);
    // let i = 0;
    // const documentArr = ['days','hours', 'minutes', 'seconds'];
    // for (let tag of documentArr) {
    //     (document.getElementById(tag) as HTMLSpanElement).textContent = `${remainingObj[remainKeys[i] as keyof RemainTime]}`;
    // }
}; // 입력한 날짜와 현재 날짜와의 간격 구하기
const starter = (savedDate) => {
    const date = dateFormMaker(); // 버튼 눌렀을때 입력된 값으로 countMaker를 작동시킴. 기존에 countMaker안에 있었을때에는 
    // setInterval에 따라 계속 작동하고 있는 countMaker에서 입력값을 바꾸면 바뀐 값으로 인식해버리기 때문에 시간이 바뀌는 문제 발생. 
    message.innerHTML = '';
    container.style.display = 'flex';
    setClearInterval();
    console.log(date, 'date');
    if (savedDate) { // 화면 새로고침 or 새로 창을 열었을 때 이미 저장해둔 데이터가 있다면
        const intervalId = setInterval(() => countMaker(savedDate), 1000);
        intervalIdArr.push(intervalId);
    }
    else { // 직접 입력하여 타이머 시작하면
        // countMaker(date); // setInterval 의 1초 뒤 실행을 기다리기 전 자체적으로 한번 먼저 실행 => 그러나 이 코드를 추가하니 setInterval이 정상작동하지 않음. 왜?
        localStorage.setItem('saved-date', date);
        const intervalId = setInterval(() => countMaker(date), 1000); // 변수에 담아줘도 자체 실행되는 신기한 함수..
        intervalIdArr.push(intervalId);
    }
};
const setClearInterval = () => {
    for (let i = 0; i < intervalIdArr.length; i++) {
        clearInterval(intervalIdArr[i]);
    }
};
if (savedDate) {
    starter(savedDate);
} // 처음 렌더링될 때 localStorage에 저장된 값이 있으면 starter함수 실행
else {
    container.style.display = 'none';
    message.innerHTML = '<h3>D-day를 입력해주세요.</h3>';
}
const resetTimer = () => {
    container.style.display = 'none';
    message.innerHTML = '<h3>D-day를 입력해주세요.</h3>';
    setClearInterval();
    localStorage.removeItem('saved-date');
    for (let key in inputValueObj) {
        inputValueObj[key].value = '';
    }
};
// setTimeout의 실행방식에 대한 견해 
// for (let i = 0; i<100; i++) {
//     setTimeout(()=> {
//         countMaker();
//     }, 1000 * i) 
// } // => 1초 뒤에 실행되며 실행 후에 i가 증가하는 방식으로 반복문이 진행될거라 생각하였으나, setTimeout이 비동기 함수이므로 
// 1초뒤에 콜백함수를 실행시킬 것을 약속한 후 종료된다. 그 사이에 i는 계속 빠르게 증가하여 반복문이 종료된다.
// 그래서 * i 를 하면 ??
// chatGPT의 대답
// * i를 사용하면 각 setTimeout에 전달되는 시간이 i에 비례하여 증가하게 됩니다. 즉, 첫 번째 setTimeout은 0초 뒤에 실행되고, 두 번째는 1초, 세 번째는 2초, ..., 백 번째는 99초 뒤에 실행됩니다.
// 이렇게 하면 for 반복문이 실행될 때마다 각 setTimeout의 콜백 함수가 다음과 같이 예약되게 됩니다:
// 첫 번째 콜백 함수: 0초 뒤에 실행
// 두 번째 콜백 함수: 1초 뒤에 실행
// 세 번째 콜백 함수: 2초 뒤에 실행
// ...
// 백 번째 콜백 함수: 99초 뒤에 실행
// 결과적으로, setTimeout이 각각의 콜백 함수를 실행할 때의 i 값이 고정되어 있으므로, 예상한 대로 동작하게 됩니다.
// 나의 결론 : 비동기 함수의 완료를 기다리지 않고 빠르게 증가하는 반복문에서 처음 시작될때를 기준으로 1,2,3,4, ...초 뒤에 실행되도록 콜백함수를 모두 실행시킨 후 반복문은 종료됨
// 타이머 눌러 작동하고 있을 때 input값이 바뀌면 메세지가 바뀌거나 타이머 시간이 마음대로 바뀌는 문제 해결. 
