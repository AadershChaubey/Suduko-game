// 8:25
const sudukoBox = document.querySelector(".suduko-container");
const sudukoMatrix = [];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var timer = null;
for(let i = 0; i < 9; i++)sudukoMatrix.push([]);
for(let i = 0; i < 9; i++){
    const sudukoSubBox = document.createElement("div");
    sudukoSubBox.classList.add("suduko-sub-box");
    let rowContainer = parseInt(i / 3) * 3;
    let colContainer = (i % 3) * 3;
    for(let j = 0; j < 9; j++){
        let newBox = document.createElement("div");
        let newInput = document.createElement("input");
        newInput.classList.add("input-box");
        newBox.append(newInput);
        newBox.classList.add("box");
        sudukoSubBox.append(newBox);
        sudukoMatrix[parseInt(rowContainer) + parseInt((j / 3))][parseInt(colContainer) + (j % 3)] = newInput;
        
    }
    sudukoBox.append(sudukoSubBox);
}


// suduko  solver


// backtracking
function BackTracking(time){
    const arr = [];
    ResetToZero(false, arr);
    const changes = [];
    backtrackingSolver(0, 0, arr, changes);
    if(time == -1)display(arr);
    else AnimateSearch(changes, time);
}

function ResetToZero(makeAllZero, arr){
    for(let i = 0; i < 9; i++){
        arr.push([]);
        for(let j = 0; j < 9; j++){
            if(makeAllZero || sudukoMatrix[i][j].value == "")arr[i][j] = 0;
            else arr[i][j] = parseInt(sudukoMatrix[i][j].value);
        }
    }
}

function backtrackingSolver(row, col, arr, changes){
    if(row >= 9)return true;

    let nextCol = (col + 1) % 9;
    let nextRow = row;
    if(nextCol === 0)nextRow++;

    if(arr[row][col] == 0){
        for(let i = 1; i <= 9; i++){
            arr[row][col] = i;
            if(check(row, col, arr)){
                changes.push([sudukoMatrix[row][col], i, true]);
                if(backtrackingSolver(nextRow, nextCol, arr, changes))return true;
            }else changes.push([sudukoMatrix[row][col], i, false]);
        }   
        arr[row][col] = 0;
        changes.push([sudukoMatrix[row][col], 0, true]);
        return false;
    }else{
        if(backtrackingSolver(nextRow, nextCol, arr, changes))return true;
        else return false;
    }
}

function check(row, col, arr){
    // check for col
    let val = parseInt(arr[row][col]);
    for(let i = 0; i < 9; i++){
        if(i != row && arr[i][col] == val)return false;
    }

    // check for row
    for(let i = 0; i < 9; i++){
        if(i != col && arr[row][i] == val)return false;
    }

    // check for sub-cube
    let rowStart = parseInt(row / 3) * 3;
    let colStart = parseInt(col / 3) * 3;
    // 
    let rowEnd = rowStart + parseInt(3);
    let colEnd = colStart + parseInt(3);
    for(let i = rowStart; i < rowEnd; i++){
        for(let j = colStart; j < colEnd; j++){
            if(i != row && j != col && arr[i][j] == val)return false;
        }
    }
    return true;
}

// Generate Random Matrix

const indexes = [];
for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
        indexes.push([i, j]);
    }
}
function generateRandomMatrix(){
    clearAll();
    const RandomArray = shuffleArray(numbers);
    for(let i = 0; i < 9; i++) sudukoMatrix[1][i].value = RandomArray[i];
    let get = 3 + parseInt((Math.random()) * 5);
    sudukoMatrix[0][0].value = RandomArray[get];
    BackTracking(-1);

    shuffleArray(indexes);
    let numberOfEmptySpaces = 55;
    for(let i = 0; i <= numberOfEmptySpaces; i++){
        let index = indexes[i];
        sudukoMatrix[index[0]][index[1]].value = "";
    }
    generateButtonAllow = true;
    solveButtonAllow = true;
}


function shuffleArray(Array){
    let n = Array.length;
    for(let i = 0; i < n; i++){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    return Array;
}


function display(arr){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            sudukoMatrix[i][j].value = arr[i][j];
        }
    }
    solveButtonAllow = true;
    generateButtonAllow = true;
}

function AnimateSearch(changes, time){
    let i = 0;
    timer = setInterval(() => {
        changes[i][0].value = changes[i][1];
        if(!changes[i][2]){
            changes[i][0].style.color = "rgb(200, 0, 0)";
        } else changes[i][0].style.color = "rgb(68, 65, 65)";
        i++;
        if(i >= changes.length){
            clearInterval(timer);
            solveButtonAllow = true;
            generateButtonAllow = true;
        }
    }, time);
}