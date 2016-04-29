// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    // returns the board as an array of rows
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    //get the column index of the diagonal for the first row
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var numPieces = 0;   
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          numPieces ++;
        }
        if (numPieces > 1) {
          return true;
        }
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowLength = this.attributes.n;
      for (var i = 0; i < rowLength; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rowIndex = 0;
      var rowLength = this.attributes.n;
      var numPieces = 0;
      var board = this.rows();

      //console.log(this);

      for (var i = 0; i < rowLength; i++) {

        if (board[i][colIndex] === 1) {
          numPieces ++;
        }
        if (numPieces > 1) {
          return true;
        }
      }

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rowLength = this.get(0).length;
      for (var i = 0; i < rowLength; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(diagColIndex, rowIndex) {
      var length = this.attributes.n;
      var numPieces = 0;
      var board = this.rows();
      var colIndex = diagColIndex;
        // check corner cases
      if (diagColIndex === length - 1 && rowIndex === 0) {
        return false;
      }
      //count pieces in diagonal
      for (var row = rowIndex; row < length; row++) {
        if (board[row][colIndex] === 1) {
          numPieces++;
        }
        colIndex++;
      }

      return numPieces > 1 ? true : false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var length = this.get(0).length;
      for (var col = 0; col < length; col++) {
        if (this.hasMajorDiagonalConflictAt(col, 0) ) {
          return true;
        }
      }
      for (var row = 1; row < length; row++) {
        if (this.hasMajorDiagonalConflictAt(0, row)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(diagColIndex, rowIndex) {

      var length = this.attributes.n;
      var numPieces = 0;
      var board = this.rows();
      var colIndex = diagColIndex;
        // check corner cases
      if (colIndex === 0 && rowIndex === 0) {
        return false;
      }
      if (colIndex === length - 1 && rowIndex === length - 1) {
        return false;
      }
      //count pieces in diagonal
      for (var row = rowIndex; row < length; row++) {
        if (board[row][colIndex] === 1) {
          numPieces++;
        }
        colIndex--;
      }

      return numPieces > 1 ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var length = this.attributes.n;
      for (var col = length - 1; col >= 0; col--) {
        if (this.hasMinorDiagonalConflictAt(col, 0)) {
          return true;
        }
      }
      for (var row = 1; row < length; row++) {
        if (this.hasMinorDiagonalConflictAt(length - 1, row)) {
          return true;  
        }
      }
      return false; // fixme
    },

    hasAnyConflicts: function() {
      if ( this.hasAnyColConflicts() || this.hasAnyRowConflicts() || 
        this.hasAnyMinorDiagonalConflicts() || 
        this.hasAnyMajorDiagonalConflicts() ) { 
        return true;
      }
      return false;

    },

    hasAnyRookConflicts: function() {
      if (this.hasAnyColConflicts() || this.hasAnyRowConflicts()) { 
        return true;
      }
      return false;

    }



    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

  // import createManyArray functionality into board


}());
