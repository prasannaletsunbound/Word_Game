 // Your javascript code goes here
 const generateLetter = () => {
    var result = '';
    var characters = 'abcdefghijklmaopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i <= 0; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const generateRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(12));
  }

  class Tile {
    constructor(x, y) {
      this.x = x;
    this.y = y;
    this.tileSize = 50;
    this.borderRadius = 10; // Adjust the border radius as desired
    this.letterColor = [0, 0, 0];
    this.letterData = " ";
    this.filled = false;
    this.isPartOfCorrectSequence = false;
    this.borderColor = [0, 255, 255]; // Set border color to cyan
    this.borderWidth = 2; // Adjust the border width as desired
    this.fontSize = 20; // Adjust the font size as desired
    this.tileColor = [255, 211, 201];
    }

    isMouseInside(mouseX, mouseY) {
      return mouseX > this.x && mouseX < this.x + this.tileSize && mouseY > this.y && mouseY < this.y + this.tileSize;
    }

    setIsPartOf(data) {
      this.isPartOfCorrectSequence = data;
    }

    getIsPartOf() {
      return this.isPartOfCorrectSequence;
    }

    setFilled(data) {
      this.filled = data;
    }

    getFilled() {
      return this.filled;
    }

    getData() {
      return this.letterData;
    }

    setData(data) {
      this.letterData = data;
    }

    render() {
      fill(this.tileColor[0], this.tileColor[1], this.tileColor[2], this.tileColor[3]);
      
      if (this.filled) {
        fill(lerpColor(color(255), color(0, 255, 0), 0.5));

      } 

      rect(this.x, this.y, this.tileSize, this.tileSize,this.borderRadius);
      
      

      if (this.filled == true) fill(0,0,255);
      else fill("black");

      textSize(this.fontSize);
      
      text(this.letterData, this.x + this.tileSize / 2, this.y + this.tileSize / 2);
      noStroke();
      fill(255);
      textSize(35);
    }
  }

  class Board {
    constructor() {
      this.boardContainer = [];
      this.wordList = [];
      this.wordLimit = 7;

      this.genWordList = ["dog", "cat", "elephant", "lion", "tiger", "giraffe", "zebra", "monkey", "gorilla","camel", "koala", "bear", "panda", "penguin", "dolphin"];

      for (var i = 0; i <= 11; i++) {
        this.boardContainer[i] = [];
      }

      let xx = 0;
      let yy = 0;
      for (var i = 0; i <= 11; i++) {
        for (var j = 0; j <= 11; j++) {
          this.boardContainer[i][j] = new Tile(xx, yy);
          xx += 55;
        }
        xx = 0;
        yy += 55;
      }

      let count = 0;
      let flag = false;

      while (count <= this.genWordList.length - 1) {
        if (!flag) {
          flag = this.generatePlace(this.genWordList[count]);
        } else {
          count += 1;
          flag = false;
        }
      }

      for (var i = 0; i <= 11; i++) {
        for (var j = 0; j <= 11; j++) {
          if (this.boardContainer[i][j].getData() == " ") {
            this.boardContainer[i][j].setData(generateLetter());
          }
        }
      }
    }

    placeHorizontal(row, col, word) {
      for (var i = 0; i < word.length; i++) {
        this.boardContainer[row][col++].setData(word[i]);
      }
    }

    canPlaceHorizontal(col, size) {
      return col + size <= 12;
    }

    isAllClearHorizontal(row, col, word) {
      if (this.canPlaceHorizontal(col, word.length)) {
        for (var i = 0; i < word.length; i++) {
          if (this.boardContainer[row][col++].getData() !== " ") {
            return false;
          }
        }
      }
      return true;
    }

    placeVertical(row, col, word) {
      for (var i = 0; i < word.length; i++) {
        this.boardContainer[row++][col].setData(word[i]);
      }
    }

    canPlaceVertical(row, size) {
      return row + size <= 12;
    }

    isAllClearVertical(row, col, word) {
      if (this.canPlaceVertical(row, word.length)) {
        for (var i = 0; i < word.length; i++) {
          if (this.boardContainer[row++][col].getData() !== " ") {
            return false;
          }
        }
      }
      return true;
    }

    placeDiagonal(row, col, word) {
      for (var i = 0; i < word.length; i++) {
        this.boardContainer[row++][col++].setData(word[i]);
      }
    }

    canPlaceDiagonal(row, col, size) {
      return row + size <= 12 && col + size <= 12;
    }

    isAllClearDiagonal(row, col, word) {
      if (this.canPlaceDiagonal(row, col, word.length)) {
        for (var i = 0; i < word.length; i++) {
          if (this.boardContainer[row++][col++].getData() !== " ") {
            return false;
          }
        }
      }
      return true;
    }

    generatePlace(word) {
      let row = generateRandomInt();
      let col = generateRandomInt();

      if (!this.canPlaceHorizontal(col, word.length)) {
        if (!this.canPlaceVertical(row, word.length)) {
          if (!this.canPlaceDiagonal(row, col, word.length)) {
            return false;
          } else {
            if (this.isAllClearDiagonal(row, col, word)) {
              this.placeDiagonal(row, col, word);
              return true;
            }
          }
        } else {
          if (this.isAllClearVertical(row, col, word)) {
            this.placeVertical(row, col, word);
            return true;
          }
        }
      } else {
        if (this.isAllClearHorizontal(row, col, word)) {
          this.placeHorizontal(row, col, word);
          return true;
        }
      }
    }

    clearSelection() {
      for (var i = 0; i <= 11; i++) {
        for (var j = 0; j <= 11; j++) {
          if (this.boardContainer[i][j].getFilled() && !this.boardContainer[i][j].getIsPartOf()) {
            this.boardContainer[i][j].setFilled(false);
          }
        }
      }
    }

    mouseReleased() {
      let completedWord = "";
      this.wordList.forEach((letter) => {
        completedWord += letter.getData();
      });

      if (this.genWordList.includes(completedWord)) {
        this.wordList.forEach((letter) => {
          letter.setIsPartOf(true);
        });
      }

      this.wordList = [];
      this.clearSelection();
    }

    update(mouseX, mouseY, dragStatus) {
      if (this.wordList.length === 8) {
        dragStatus = false;
      } else if (dragStatus) {
        for (var i = 0; i <= 11; i++) {
          for (var j = 0; j <= 11; j++) {
            let letter = this.boardContainer[i][j];
            if (letter.isMouseInside(mouseX, mouseY) && !letter.getFilled()) {
              letter.setFilled(true);
              this.wordList.push(letter);
            }
          }
        }
      }
    }

    render() {
      for (var i = 0; i <= 11; i++) {
        for (var j = 0; j <= 11; j++) {
          this.boardContainer[i][j].render();
        }
      }
    }
  }

  let board = new Board();
  let mouseDrag = false;

  function setup() {
    createCanvas(673, 673);
    textSize(35);
    textAlign(CENTER, CENTER);
    cursor(CROSS);
  }

  function mousePressed() {
    mouseDrag = true;
  }

  function mouseReleased() {
    mouseDrag = false;
    board.mouseReleased();
  }

  function mouseDragged() {
    if (mouseDrag) {
      board.update(mouseX, mouseY, mouseDrag);
    }
  }

  function draw() {
    board.render();
  }