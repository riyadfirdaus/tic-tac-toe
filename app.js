const header = document.querySelector("h1");
const mainboard = (() => {
  const boardElement = document.getElementById("mainboard");
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let count = 0;
  let boardMap = {};
  let isFull = false;

  const checkCell = (index) => {
    if (board[index] != 0) return true;
    else return false;
  };

  const create = () => {
    //Reset the board first
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    boardMap = {};
    count = 0;
    mainboard.isFull = false;
    boardElement.innerHTML = "";
    header.innerHTML = "It's a Tic-Tac-Toe";

    //Create the fresh cell as fresh as morning air
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("span");
      cell.id = `cell-${i}`;
      cell.className = "cell unselectable";
      cell.addEventListener(
        "click",
        () => {
          player.draw(i);
        },
        { once: true }
      );
      boardElement.appendChild(cell);
    }
  };

  const createMap = (mark, index) => {
    function assignMap(s) {
      if (boardMap[s]) {
        boardMap[s]++;
      } else {
        boardMap[s] = 1;
      }
      if (boardMap[s] === 3) {
        if (`${s[0]}` === "X") header.innerHTML = "You win!";
        else header.innerHTML = "You Lose";
        game.stop();
      }
    }

    let row = Math.floor(index / 3) + 1;
    let column = Math.floor(index % 3) + 1;
    assignMap(`${mark} on row ${row}`);
    assignMap(`${mark} on column ${column}`);

    if ((index + 1) % 2 == 1) {
      if (index == 0 || index == 4 || index == 8) {
        assignMap(`${mark} on diagonal left`);
      }
      if (index == 2 || index == 4 || index == 6) {
        assignMap(`${mark} on diagonal right`);
      }
    }
  };

  const draw = async (mark, index) => {
    if (count === 9 || mainboard.isFull) return false;
    if (board[index] == 0) {
      // Isi DOM
      let cell = document.getElementById(`cell-${index}`);

      cell.classList.add("pre-animation");
      await new Promise((resolve) =>
        setTimeout(() => {
          cell.innerText = `${mark}`;
          cell.classList.remove("pre-animation");
          resolve();
        }, 150)
      );

      // Isi array
      board[index] = mark;

      //Isi Map
      createMap(mark, index);

      count++;
      if (count == 9) {
        mainboard.isFull = true;
      }
      return true;
    } else {
      return false;
    }
  };

  return { create, draw, checkCell, isFull };
})();

//Prototype
const Player = (name, mark) => {
  return { name, mark };
};

// Person Factory
const createPlayer = (name, mark) => {
  const prototype = Player(name, mark);
  const draw = (i) => {
    if (mainboard.draw(mark, i)) {
      setTimeout(() => {
        computer.draw();
      }, 150);
    }
  };
  return Object.assign({}, prototype, { draw });
};

//Computer Factory
const createComputer = (name, mark) => {
  const prototype = Player(name, mark);

  const draw = () => {
    let index;
    do {
      index = Math.floor(Math.random() * 10);
    } while (mainboard.checkCell(index) && !mainboard.isFull);
    mainboard.draw(mark, index);
  };

  return Object.assign({}, prototype, { draw });
};

const resetButton = document.querySelector("#reset-btn");
resetButton.addEventListener("click", () => {
  game.start("X");
});

let player;
let computer;
const game = (() => {
  const stop = () => {
    mainboard.isFull = true;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.replaceWith(cell.cloneNode(true));
    });
  };

  const start = (mark) => {
    if (mark === "X") {
      player = createPlayer("player", "X");
      computer = createComputer("cpu", "O");
    } else {
      player = createPlayer("player", "O");
      computer = createComputer("cpu", "X");
      computer.draw();
    }
    mainboard.create();
  };
  return { start, stop };
})();

game.start("X");
