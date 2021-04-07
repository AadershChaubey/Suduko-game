// 8:25
const sudukoBox = document.querySelector(".suduko-container");
const sudukoMatrix = [];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const bottomDisplay = document.querySelector(".display-box");
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
const steps = [parseInt(1)];
function BackTracking(time){
    const arr = [];
    ResetToZero(false, arr);
    const changes = [];
    steps[0] = parseInt(0);
    let solved = backtrackingSolver(0, 0, arr, changes);
    if(!solved){
        alert();
        return false;
    }
    console.log("step", steps[0]);
    steps[0] = parseInt(0);
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
    steps[0]++;
    if(row >= 9)return true;
    if(steps[0] > parseInt(400000)) return false;
    let nextCol = (col + 1) % 9;
    let nextRow = row;
    if(nextCol === 0)nextRow++;

    if(arr[row][col] == 0){
        for(let i = 1; i <= 9; i++){
            arr[row][col] = i;
            if(check(row, col, arr)){
                changes.push([sudukoMatrix[row][col], i, true]);
                if(backtrackingSolver(nextRow, nextCol, arr, changes))return true;
                if(steps[0] > parseInt(300000)) return false;
            }else changes.push([sudukoMatrix[row][col], i, false]);
        }   
        arr[row][col] = 0;
        changes.push([sudukoMatrix[row][col], 0, false]);
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

// bfs
function bfs(time){
    const matrixOfAvailableNumbers = [];
    const HArray = [];
    const arr = [];
    ResetToZero(false, arr);
    preBfs(matrixOfAvailableNumbers, HArray, arr);
    
    const changes = [];
    steps[0] = parseInt(0);
    let solved = bfsSolver(matrixOfAvailableNumbers, HArray, arr, changes);
    if(!solved){
        alert();
        return false;
    }
    console.log("step", steps[0]);
    steps[0] = parseInt(0);
    if(time == parseInt(-1))display(arr);
    else AnimateSearch(changes, time);
}

function preBfs(matrixOfAvailableNumbers, HArray, arr){
    for(let i = 0; i < 9; i++){
        matrixOfAvailableNumbers.push([]);
        for(let j = 0; j < 9; j++){
            matrixOfAvailableNumbers[i][j] = {"NotAvailableArray":[],
                                              "HValue": parseInt(0)}
            if(arr[i][j] == parseInt(0)) {
                for(let value = 1; value <= 9; value++){
                    arr[i][j] = value;
                    if(!check(i, j, arr)){
                        matrixOfAvailableNumbers[i][j].NotAvailableArray[value - 1] = 1;
                        matrixOfAvailableNumbers[i][j].HValue++;
                    }else matrixOfAvailableNumbers[i][j].NotAvailableArray[value - 1] = 0;
                }
                arr[i][j] = 0;
            }else matrixOfAvailableNumbers[i][j].HValue = -1;;
            HArray.push([i, j]);
        }
    }
}

function bfsSolver(matrixOfAvailableNumbers, HArray, arr, changes){
    steps[0]++;
    if(steps[0] >= parseInt(300000))return false;
    if(HArray.length <= 0)return true;
    HArray.sort((a, b)=>{
        let ans =  matrixOfAvailableNumbers[a[0]][a[1]].HValue - matrixOfAvailableNumbers[b[0]][b[1]].HValue;
        if(ans != 0)return ans;
        ans = b[0] + b[1] - a[0] - a[1];
        return ans;
    });
    const bestIndex = HArray.pop();
    const x = parseInt(bestIndex[0]);
    const y = parseInt(bestIndex[1]);
    if(matrixOfAvailableNumbers[x][y].HValue == -1)return true;
    for(let i = 1; i <= 9; i++){
        arr[x][y] = i;
        if(check(x, y, arr)){
            updateHValues(matrixOfAvailableNumbers, x, y, i, false);
            changes.push([sudukoMatrix[x][y], i, true]);
            if(bfsSolver(matrixOfAvailableNumbers, HArray, arr, changes)) return true;
            if(steps[0] >= parseInt(300000))return false;
            updateHValues(matrixOfAvailableNumbers, x, y, i, true);
        }
    }

    arr[x][y] = 0;
    changes.push([sudukoMatrix[x][y], 0, false]);
    HArray.push(bestIndex);
    return false;
}


//  update Bfs

function updateHValues(matrixOfAvailableNumbers, row, col, val, Available){
    // check for col
    for(let i = 0; i < 9; i++){
        if(i != row){
            if(!Available){
                let value = matrixOfAvailableNumbers[i][col].NotAvailableArray[val - 1];
                if(value == parseInt(0))matrixOfAvailableNumbers[i][col].HValue++;
                matrixOfAvailableNumbers[i][col].NotAvailableArray[val - 1] = value + parseInt(1);
            }else{
                let value = matrixOfAvailableNumbers[i][col].NotAvailableArray[val - 1];
                if(value == parseInt(1))matrixOfAvailableNumbers[i][col].HValue--;
                matrixOfAvailableNumbers[i][col].NotAvailableArray[val - 1] = value - parseInt(1);
            }
        }
    }

    // check for row
    for(let i = 0; i < 9; i++){
        if(i != col){
            if(!Available){
                let value = matrixOfAvailableNumbers[row][i].NotAvailableArray[val - 1];
                if(value == parseInt(0))matrixOfAvailableNumbers[row][i].HValue++;
                matrixOfAvailableNumbers[row][i].NotAvailableArray[val - 1] = value + parseInt(1);
            }else{
                let value = matrixOfAvailableNumbers[row][i].NotAvailableArray[val - 1];
                if(value == parseInt(1))matrixOfAvailableNumbers[row][i].HValue.HValue--;
                matrixOfAvailableNumbers[row][i].NotAvailableArray[val - 1] = value - parseInt(1);
            }
        }
    }

    // check for sub-cube
    let rowStart = parseInt(row / 3) * 3;
    let colStart = parseInt(col / 3) * 3;
    // 
    let rowEnd = rowStart + parseInt(3);
    let colEnd = colStart + parseInt(3);
    for(let i = rowStart; i < rowEnd; i++){
        for(let j = colStart; j < colEnd; j++){
            if(i != row && j != col){
                if(!Available){
                    let value = matrixOfAvailableNumbers[i][j].NotAvailableArray[val - 1];
                    if(value == parseInt(0))matrixOfAvailableNumbers[i][j].HValue++;
                    matrixOfAvailableNumbers[i][j].NotAvailableArray[val - 1] = value + parseInt(1);
                }else{
                    let value = matrixOfAvailableNumbers[i][j].NotAvailableArray[val - 1];
                    if(value == parseInt(1))matrixOfAvailableNumbers[i][j].HValue--;
                    matrixOfAvailableNumbers[i][j].NotAvailableArray[val - 1] = value - parseInt(1);
                }
            }
        }
    }
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
    displayNothing();

    shuffleArray(indexes);
    let numberOfEmptySpaces = 55;
    let i = 0;
    for(; i <= numberOfEmptySpaces; i++){
        let index = indexes[i];
        sudukoMatrix[index[0]][index[1]].value = "";
    }

    while(i != 81){
        let index = indexes[i];
        sudukoMatrix[index[0]][index[1]].style.color = "rgb(44, 42, 42)";
        i++;
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
            if(sudukoMatrix[i][j].value == "")sudukoMatrix[i][j].style.color = "rgb(121, 118, 118)";
            sudukoMatrix[i][j].value = arr[i][j];
        }
    }
    generateButtonAllow = true;
    displaySolved();
}

function AnimateSearch(changes, time){
    let i = 0;
    timer = setInterval(() => {
        changes[i][0].value = changes[i][1];
        if(!changes[i][2]){
            changes[i][0].style.color = "rgb(200, 0, 0)";
        } else changes[i][0].style.color = "rgb(121, 118, 118)";
        i++;
        if(i >= changes.length){
            clearInterval(timer);
            generateButtonAllow = true;
            displaySolved();
        }
    }, time);
}


function alert(){
    bottomDisplay.innerText = "Time out, try different algorithm";
    generateButtonAllow = true;
    solveButtonAllow = true;
}

function displaySolving(){
    bottomDisplay.innerText = "solving...";
}

function displayNothing(){
    bottomDisplay.innerText = "";
}

function displaySolved(){
    bottomDisplay.innerText = "Solved";
}