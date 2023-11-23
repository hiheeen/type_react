"use strict";
function consoleTool(props) {
    props.testMethod();
}
;
const testTypeMethod = {
    testMethod() {
        console.log("testing");
    }
};
consoleTool(testTypeMethod);
function numTool(props) {
    console.log(props.testNum);
    console.log(props.returnMethod());
}
const testNumMethod = {
    testNum: 5,
    returnMethod() {
        return 6;
    }
};
numTool(testNumMethod);
