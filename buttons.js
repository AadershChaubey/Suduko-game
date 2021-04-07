const solveButton = document.querySelector(".solve-btn");
const clearButton = document.querySelector(".clear-btn");
const randomGenerator = document.querySelector(".random-generator-btn");
const algoButton = document.querySelector(".choose-algo");
const algoOptions = document.querySelector(".algo-container");
const speedButton = document.querySelector(".speed-btn");
const speedContainer = document.querySelector(".speed-list-container");
const speedList = speedContainer.querySelectorAll(".list-item")
const algoList = algoOptions.querySelectorAll(".list-item");
const undoButton = document.querySelector(".reset-btn");
const body = document.querySelector("body");

var generateButtonAllow = true;
var solveButtonAllow = true;

solveButton.addEventListener("click", ()=>{
    if(solveButtonAllow){
        console.log("hey");
        displaySolving();
        solveButtonAllow = false;
        generateButtonAllow = false;
        let text = speedButton.innerText;
        let speed = 100;
        if(text == "Instant")speed = -1;
        else if(text == "Fast")speed = 0;
        let algoText = algoButton.querySelector("p").innerText;
        console.log(algoText);
        if(algoText == "Backtracking")BackTracking(speed);
        else bfs(speed);
    }
})


clearButton.addEventListener("click", ()=>{
    displayNothing();
    clearAll();
    console.log(timer)
    clearInterval(timer);
    solveButtonAllow = true;
    generateButtonAllow = true;
})

randomGenerator.addEventListener("click", ()=>{
    displayNothing();
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
            const arr = [];
            let value = element.value;
            if(value.length > 1)element.value = value.slice(1);
            ResetToZero(false, arr);
            if(!check(i, j, arr))element.style.color = "red"; 
            else element.style.color = "rgb(23 22 22)"
        })
    }
}

algoButton.addEventListener("click", ()=>{
    if(algoOptions.style.transform != "scale3d(1, 1, 1)")algoOptions.style.transform = "scale3d(1, 1, 1)";
    else algoOptions.style.transform = "scale3d(1, 0, 1)"
})

algoList.forEach((item)=>{
    item.addEventListener("click", ()=>{
        let text = item.innerText;
        if(text == "Best First Search")algoButton.querySelector("p").innerText = "BFS";
        else algoButton.querySelector("p").innerText = text;

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
    if(list.contains("btn") || list.contains("para") || list.contains("icon"))return;
    speedContainer.style.transform = "scale3d(1, 0, 1)";
    algoOptions.style.transform = "scale3d(1, 0, 1)";
    displayNothing();
})

undoButton.addEventListener("click",()=>{
    undo();
    clearInterval(timer);
    displayNothing();
    solveButtonAllow = true;
    generateButtonAllow = true;
});

function clearAll(){
    sudukoMatrix.forEach((row)=>{
        row.forEach((element)=>{
            element.value = "";
        })
    })
}

function undo(){
    sudukoMatrix.forEach((row)=>{
        row.forEach((cell)=>{
            if(cell.style.color == "rgb(121, 118, 118)" || cell.style.color == "rgb(200, 0, 0)")cell.value = "";
        })
    })
}