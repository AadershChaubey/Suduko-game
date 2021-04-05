const solveButton = document.querySelector(".solve-btn");
const clearButton = document.querySelector(".clear-btn");
const randomGenerator = document.querySelector(".random-generator-btn");
const algoButton = document.querySelector(".choose-algo");
const algoOptions = document.querySelector(".algo-container");
const speedButton = document.querySelector(".speed-btn");
const speedContainer = document.querySelector(".speed-list-container");
const speedList = speedContainer.querySelectorAll(".list-item")
const algoList = algoOptions.querySelectorAll(".list-item");
const body = document.querySelector("body");

var generateButtonAllow = true;
var solveButtonAllow = true;

solveButton.addEventListener("click", ()=>{
    if(solveButtonAllow){
        solveButtonAllow = false;
        generateButtonAllow = false;
        let text = speedButton.innerText;
        let speed = 100;
        if(text == "Instant")speed = -1;
        else if(text == "Fast")speed = 0;
        BackTracking(speed);
    }
    // bfs()
})


clearButton.addEventListener("click", ()=>{
    clearAll();
    console.log(timer)
    clearInterval(timer);
})

randomGenerator.addEventListener("click", ()=>{
    
    if(generateButtonAllow){
        solveButtonAllow = false;
        generateButtonAllow = false;
        generateRandomMatrix();
    }
})


for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
        let element = sudukoMatrix[i][j];
        element.addEventListener("keyup", (key)=>{
            // console.log(key.keyCode, parseInt(key.KeyCode) > parseInt(96))
            const arr = [];
            element.value = "";
            if(key.keyCode != 8)element.value = key.keyCode - 96;
            ResetToZero(false, arr);
            if(!check(i, j, arr))element.style.color = "red"; 
            else element.style.color = "rgb(58, 57, 57)"
        })
    }
}

algoButton.addEventListener("click", ()=>{
    if(algoOptions.style.transform != "scale3d(1, 1, 1)")algoOptions.style.transform = "scale3d(1, 1, 1)";
    else algoOptions.style.transform = "scale3d(1, 0, 1)"
})

algoList.forEach((item)=>{
    item.addEventListener("click", ()=>{
        algoButton.querySelector("p").innerText = item.innerText;
    })
})

speedButton.addEventListener("click", ()=>{
    if(speedContainer.style.transform != "scale3d(1, 1, 1)")speedContainer.style.transform = "scale3d(1, 1, 1)";
    else speedContainer.style.transform = "scale3d(1, 0, 1)"
})

speedList.forEach((item)=>{
    item.addEventListener("click", ()=>{
        speedButton.querySelector("p").innerText = item.innerText;
    })
})

body.addEventListener("click", ()=>{
    const list =  window.event.srcElement.classList;
    if(list.contains("btn") || list.contains("algo-p") || list.contains("icon"))return;
    speedContainer.style.transform = "scale3d(1, 0, 1)";
    algoOptions.style.transform = "scale3d(1, 0, 1)";
})

function clearAll(){
    sudukoMatrix.forEach((row)=>{
        row.forEach((element)=>{
            element.value = "";
        })
    })
}