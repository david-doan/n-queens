var createManyArray = function(n) {
  var answer = [];
  var uniqRows = {};
  var n = n;
  var emptyNxN = new Board({n: n});
  var fullValidArr = makeEmptyValid(n);

  var createBoards = function(partialBoard, currDec, objValid) {
    // var partialBrd = partialBoard;
    // var partialArr = partialBrd.rows();
    var currD = currDec;
    var prevSpace;
    //if(partialBoard.rows()[0][0] === 1 && partialBoard.rows()[3][2]===1){debugger;}
    for (var validSpace in objValid ) {
      //somehow keep track of where prev Piece was placed and toggle it off when placing next spot
      var newArrValidContainer = fillNextEmptySpace(partialBoard, validSpace, n, objValid, prevSpace, currD);
      var newValidObj = newArrValidContainer[0];
      prevSpace = newArrValidContainer[1];
      
      // instead of creating a board every time, lets try keeping one board, and toggle pieces
      // toggle off a newly added piece, then toggle on the next position 

      // check if we put our last piece down and answer is NOT duplicate
      if (currD === (n - 1) && uniqRows[ JSON.stringify( partialBoard.rows() ) ] === undefined && !(partialBoard.hasAnyConflicts()) ) {
        // debugger;
        // if (!partialBoard.hasAnyConflicts()) debugger;
        // console.log('I am on ' + currD + ' piece.');
        answer.push( JSON.parse(JSON.stringify(partialBoard.rows())) );
        uniqRows[ JSON.stringify(partialBoard.rows()) ] = 1;
        // prevSpace = undefined;
      } 
      // else if ( currD === (n - 1) ) { // board was not successful, toggle off the last piece
      //   partialBoard.togglePiece(prevSpace[0], prevSpace[1]);
      // } 
      else if (currD < n - 1) {
        createBoards (partialBoard, currD + 1, newValidObj);    
      }
    }

    // if we are not at the last piece and there are no valid spaces left, we should turn off
    // the piece we just put down
    if (prevSpace) {
      partialBoard.togglePiece(prevSpace[0], prevSpace[1]);
    }
    // if (prevSpace && partialBoard.rows()[prevSpace[0]][prevSpace[1]] === 1) {
    //   partialBoard.togglePiece(prevSpace[0], prevSpace[1]);
    // }
  };
  createBoards(emptyNxN, 0, fullValidArr);
  return answer;
};



// objValid  is obj contains array of valid possible indices { 0:[r,c], 1:[r,c], 2:[r,c], 3:[r,c] }
var fillNextEmptySpace = function (theBoard, nextValidSpace, n, objValid, indexPrevPiece, pieceNum) {
  var nextValidObj = JSON.parse(JSON.stringify(objValid));

  // debugger;
  // toggle off prev piece
  if (indexPrevPiece && theBoard.rows()[indexPrevPiece[0]][indexPrevPiece[1]] === 1) {
    var rowPrevPiece = indexPrevPiece[0];
    var colPrevPiece = indexPrevPiece[1];
    theBoard.togglePiece(rowPrevPiece, colPrevPiece); 
  }

  // put down the current piece
  var newR = objValid[nextValidSpace][0];
  var newC = objValid[nextValidSpace][1];
  // if(newR === 3 && newC === 2 && pieceNum === 2){debugger;}
  theBoard.togglePiece(newR, newC);

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

  

  return [nextValidObj, [newR, newC] ];
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