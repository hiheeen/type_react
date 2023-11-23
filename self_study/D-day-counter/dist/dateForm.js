"use strict";
const container = document.querySelector('#d-day-container');
container.style.display = 'none';
const message = document.querySelector('#d-day-message');
message.innerHTML = '<h3>D-day를 입력해주세요.</h3>';
const dateFormMaker = () => {
    const inputYear = document.querySelector("#target-year-input");
    const inputYearValue = inputYear.value;
    const inputMonth = document.querySelector("#target-month-input");
    const inputMonthValue = inputMonth.value;
    const inputDate = document.querySelector("#target-day-input");
    const inputDateValue = inputDate.value;
    return `${inputYearValue}-${inputMonthValue}-${inputDateValue}`;
}; // 입력한 날짜를 형식 갖춰서 데이터 추출
const countMaker = () => {
    const nowDate = new Date().getTime();
    const targetDate = new Date(dateFormMaker()).setHours(0, 0, 0, 0); // 오전 9시 기준이던 것을 자정을 기준으로 변경
    const remaining = (targetDate - nowDate) / 1000;
    // remaining (남은 시간)이 0이하이거나 유효하지 않은 값일 때의 처리 
    if (remaining <= 0) {
        message.innerHTML = '<h3>타이머가 종료되었습니다.</h3>';
    }
    else if (isNaN(remaining)) {
        message.innerHTML = '<h3>유효한 시간대가 아닙니다</h3>';
    }
    else if (remaining > 0) {
        message.innerHTML = '';
        container.style.display = 'flex';
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
    // for in 문에서는 객체의 프로퍼티 갯수 혹은 배열의 인덱스 만큼만 진행을 하는 조건식이다. i를 계속 증가시키지 않으므로 i에 대한 제어 x
    // let i = 0;
    // for (let key of documentObj) {
        // documentObj[key] = remainingObj[remainKeys[i]];
        // i++ 
    // }
   
}; 
