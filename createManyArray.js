var createManyArray = function(n) {
  var answer = [];
  var n = n;
  var emptyNxN = makeEmptyMatrix(n);

  var createArray = function(partialArray, currDec) {
    var partialArr = partialArray;
    var currD = currDec;

    var emptySpaces = Math.pow(n, 2) - currD;

    for (var spaces = 0; spaces < emptySpaces; spaces++ ) {
      var newArr = fillNextEmptySpace(partialArr, spaces, n);
      if (currD >= n - 1) {
        answer.push(newArr);
      } else {
        createArray (newArr, currD + 1);    
      }
    }        
  };

  createArray(emptyNxN, 0, 0);

  return answer;
};


var fillNextEmptySpace = function (partialArray, numPossFilled, n) {
  var answer = makeCopy(partialArray);
  var emptySpaceCounter = 0;
  for (var r = 0; r < n; r++) {
    for (var c = 0; c < n; c++) {
      if (answer[r][c] === 0) {
        emptySpaceCounter++; // count number of empty spaces
      }
      if (emptySpaceCounter === numPossFilled + 1) {
        answer[r][c] = 1; // add piece
      }
    }
  }
  return answer;
};

var makeCopy = function(array) {
  var answer = array.slice();
  for (var i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      answer[i] = array[i].slice();
    } else {
      answer[i] = array[i];
    }
  }

  return answer;
};

var toggle = function(value) {
  return value === 0 ? 1 : 0;
};

var makeEmptyMatrix = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
};