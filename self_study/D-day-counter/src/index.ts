interface TestType {
 testMethod() : void
}
function consoleTool(props :TestType) {
 props.testMethod();
};
const testTypeMethod :TestType = {
    testMethod() {
        console.log("testing");
    }
} 
consoleTool(testTypeMethod);

interface NumType {
    testNum : number,
    returnMethod() : number
}
function numTool(props : NumType) :void {
    console.log(props.testNum);
    console.log(props.returnMethod())
}
const testNumMethod :NumType = {
    testNum : 5,
    returnMethod() {
        return 6;
    }
}
numTool(testNumMethod);