var createManyArray = function(n) {
  var answer = [];
  var uniqRows = [];
  var n = n;
  var emptyNxN = new Board({n: n});

  var createBoards = function(partialBoard, currDec) {
    var partialBrd = partialBoard;
    var partialArr = partialBrd.rows();
    var currD = currDec;

    var emptySpaces = Math.pow(n, 2) - currD;

    for (var spaces = 0; spaces < emptySpaces; spaces++ ) {
      var newArr = fillNextEmptySpace(partialArr, spaces, n);
      var newBrd = new Board(newArr);
      if ( newBrd.hasAnyConflicts() ) {
        continue;  
      }
      // for some reason the JSON.stringify memo of newArr is not working
      if (currD >= n - 1 && uniqRows.indexOf( JSON.stringify(newArr)) === -1) {
        answer.push(newBrd);
        uniqRows.push( JSON.stringify(newArr) );
      } else {
        createBoards (newBrd, currD + 1);    
      }
    }        
  };

  createBoards(emptyNxN, 0, 0);
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