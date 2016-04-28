var createManyArray = function(n) {
  var answer = [];
  var uniqRows = {};
  var n = n;
  var emptyNxN = new Board({n: n});
  var fullValidArr = makeEmptyValid(n);

  var createBoards = function(partialBoard, currDec, objValid) {
    var partialBrd = partialBoard;
    var partialArr = partialBrd.rows();
    var currD = currDec;

    var emptySpaces = Math.pow(n, 2) - currD;

    for (var validSpace in objValid ) {
      var newArrValidContainer = fillNextEmptySpace(partialArr, validSpace, n, objValid);
      var newArr = newArrValidContainer[0];
      var newValidObj = newArrValidContainer[1];

      // instead of creating a board every time, lets try keeping one board, and toggle pieces
      // toggle off a newly added piece, then toggle on the next position 
      var newBrd = new Board(newArr);
      // if ( newBrd.hasAnyConflicts() ) {
      //   continue;  
      // }

      // check if we put our last piece down and answer is NOT duplicate
      if (currD >= n - 1 && uniqRows[ JSON.stringify(newArr) ] === undefined) {
        // debugger;
        // console.log('I am on ' + currD + ' piece.');
        answer.push(newBrd);
        uniqRows[ JSON.stringify(newArr) ] = 1;
      } else if (currD < n - 1) {
        createBoards (newBrd, currD + 1, newValidObj);    
      }
    }        
  };

  createBoards(emptyNxN, 0, fullValidArr);
  return answer;
};

// objValid  is obj contains array of valid possible indices { 0:[r,c], 1:[r,c], 2:[r,c], 3:[r,c] }
var fillNextEmptySpace = function (partialArray, nextValidSpace, n, objValid) {
  var answer = makeCopy(partialArray);
  // var rowPrevPiece = indexPrevPiece[0];
  // var colPrevPiece = indexPrevPiece[1];
  var nextValidObj = JSON.parse(JSON.stringify(objValid));

  // debugger;

  // this loop will put down the current piece
  var newR = objValid[nextValidSpace][0];
  var newC = objValid[nextValidSpace][1];
  answer[newR][newC] = 1; // add piece to valid position
  var majorDiaIntersect = newR - newC;
  var minorDiaIntersect = newR + newC;

  for ( var index in nextValidObj) {
    //debugger;
    if ( nextValidObj[index] ) {
      if (nextValidObj[index][0] === newR || nextValidObj[index][1] === newC) {
        delete nextValidObj[index];
      } else {
        var b = nextValidObj[index][0] - nextValidObj[index][1];
        var d = nextValidObj[index][0] + nextValidObj[index][1];
     
        if (b === majorDiaIntersect || d === minorDiaIntersect) {
          delete nextValidObj[index];
        }  
      }      
    }
    
  }


  // if we are not at last piece but there is no valid places to put that piece, 
  // we need to fail that tree

  // for (var r = 0; r < n; r++) {
  //   if(r === rowPrevPiece){
  //     r++;
  //     continue;
  //   }
  //   for (var c = 0; c < n; c++) {
  //     if (c === colPrevPiece) {
  //       c++;
  //       continue;
  //     }
  //     if (answer[r][c] === 0) {
  //       emptySpaceCounter++; // count number of empty spaces
  //     }
  //     if (emptySpaceCounter === numPossFilled + 1) {
  //       answer[r][c] = 1; // add piece
  //     }
  //   }
  // }
  return [answer, nextValidObj];
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

var makeEmptyValid = function(n) {
  var answer = {};
  var index = 0;
  for (var r = 0; r < n; r++) {
    for (var c = 0; c < n; c++) {
      answer[index] = [r, c];
      index++;
    }
  }
  //answer.length = index;
  return answer;
};