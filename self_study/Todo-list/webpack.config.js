module.exports = {
  entry: './src/todo.js', // 입력 파일 경로
  output: {
    filename: 'main.js', // 출력 파일 이름
    path: __dirname + '/dist', // 출력 파일 경로
  },
  mode: 'development', // 개발 모드
};
