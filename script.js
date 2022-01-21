// const promocode = 84533920;
// const promocode = 48183276;
// const promocode = 73289388; 
// const promocode = 37283988;
const button = document.querySelector('button');
const input = document.querySelector('input');
const div = document.querySelector('div');

div.hidden = true;
button.disabled = true;

input.oninput = () => {
    div.hidden = true;
    if (input.value.length == 8) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

button.onclick = () => {
    let promocode = input.value;

    if (promocode >= 10000000 && promocode <= 99999999) {
        let bonus = countBonus(promocode);
        div.innerHTML = `Your bonus is equal to ${bonus} UAH`;        
    } else {
        div.innerHTML = "Invalid promocode";        
    }

    div.hidden = false;
    button.disabled = true;
    input.value = "";
}

function countBonus(promocode) {
    const numArray = getNumbersArray(promocode);
    let {evenNumArray, oddNumArray} = getEvenOddNumArray(numArray);
    let bonus = 0;
    let sumEven = sumArrayElements(evenNumArray);
    let sumOdd = sumArrayElements(oddNumArray);

    if (sumEven > sumOdd) {
        bonus = 100;
    }

    let oddSeparatedPairs = findOddSeparatedPairs(oddNumArray, numArray);
    
    if (Object.keys(oddSeparatedPairs).length == 0) {
        return bonus;
    }

    if (checkOddPairsSeparation(oddSeparatedPairs, numArray)) {
        bonus = 1000;
    }

    if (areNumbersIncreasing(oddSeparatedPairs)) {
        bonus = 2000;
    }

    return bonus;
}

function getNumbersArray(promocode) {
    let array = [];
    let number = promocode;
    for (let i = 0; i < 8; i++) {
        let digit = Math.floor(number / (10**(8-(i+1))));
        array.push(digit);
        number = number - digit*(10**(8-(i+1)));
    }
    return array;
}

function getEvenOddNumArray(numbersArray) {
    let evenNumArray = [];
    let oddNumArray = [];
    for (let i = 0; i < 8; i++) {
        if (numbersArray[i] % 2 == 0) {
            evenNumArray.push(numbersArray[i]);
        }
        else {
            oddNumArray.push(numbersArray[i]);
        }
    }
    return {evenNumArray, oddNumArray}
}

function sumArrayElements(numbersArray) {
    let sum = 0;

    for (let i = 0; i < numbersArray.length; i++) {
        sum = sum + numbersArray[i];
    }

    return sum;
}

function findOddSeparatedPairs(oddNumArray, initNumArray) {
    let oddNumPairs = {};

    if (oddNumArray.length < 4 || oddNumArray.length == 8) {
        return oddNumPairs;
    }

    let start = 0;
    

    for (let i = 0; i < oddNumArray.length; i++) {
        let firstIndex = initNumArray.indexOf(oddNumArray[i], start);

        if (i > 0 && firstIndex == start && !oddNumPairs[firstIndex - 1]) {
            oddNumPairs[firstIndex] = oddNumArray[i-1] * 10 + oddNumArray[i];
        }

        start = firstIndex + 1;
    }

    if (Object.keys(oddNumPairs).length >= 2) {
        return oddNumPairs
    }

    return {};
}

function checkOddPairsSeparation(oddPairs, initNumArray) {
    let counter = 0;

    for (let key of Object.keys(oddPairs)) {
        counter++;
        if (counter == 1) {
            continue
        }
        if (initNumArray[ + key - 2] % 2 == 0 && counter <= Object.keys(oddPairs).length) {
            return true;
        }
    }

    return false;
}

function areNumbersIncreasing(oddPairs) {
    let counter = 0;

    for (let value of Object.values(oddPairs)) {
        if (Math.floor(+value/10) < value - Math.floor(+value/10)*10) {
            counter++;
        }
    }

    if (counter == Object.keys(oddPairs).length) {
        return true;
    }
    
    return false;
}

