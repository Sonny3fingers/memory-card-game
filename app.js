const section = document.querySelector("section");
const loader = document.querySelector("section .loader");

let selectedTheme = null;
let params = null;
let totalCorrect = 0;
let gameTime;
let comparedCardsCounter = 0;
let myTimer;
let roles = [];

// fetchData
const fetchData = async () => {
  try {
    const response = await fetch(
      `https://memory-card-game-2d4ca-default-rtdb.europe-west1.firebasedatabase.app/${params}.json`
    );
    const data = await response.json();
    if (data["Al Pacino"] || data["Robert De Niro"]) {
      // Make pairs of fetched data
      Object.values(data)
        .concat(Object.values(data))
        .forEach((item) => {
          for (let key in item) {
            roles.push(item[key]);
          }
        });
      console.log(roles);
    } else {
      // Make pairs of fetched data
      Object.entries(data)
        .concat(Object.entries(data))
        .forEach((item) => {
          roles.push(item[1]);
        });
      console.log(roles);
    }
    loader.style.display = "none";
    return roles;
  } catch (error) {
    alert(error);
  }
};
// Set params for API
function setParams() {
  if (selectedTheme === "actors") {
    params = "actors";
  } else if (selectedTheme === "Al Pacino") {
    params = "actors/Al%20Pacino";
  } else if (selectedTheme === "Robert De Niro") {
    params = "actors/Robert%20De%20Niro";
  }
  return params;
}
// Sort random data
const randomize = (data) => {
  return data.sort(() => Math.random() - 0.5);
};
// Create cards
const createCards = (data) => {
  data.length === 36
    ? `${section.classList.add("selectedBothActors")}`
    : `${section.classList.add("selectedSingleActor")}`;
  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("dataId", item.dataId);
    const frontImgCard = document.createElement("img");
    frontImgCard.src = `${item.imageUrl}`;
    frontImgCard.classList = "front";
    const backCard = document.createElement("div");
    const backCardName = document.createElement("h3");
    backCardName.textContent = item.actor;
    backCard.classList = "back";
    backCard.appendChild(backCardName);
    card.appendChild(frontImgCard);
    card.appendChild(backCard);
    section.appendChild(card);
  });
};
// Compare cards
const compareCards = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.target.parentElement.classList.add("flipped");
      e.target.parentElement.classList.add("turnedCard");
      const flippedCards = document.querySelectorAll(".turnedCard");
      if (flippedCards.length === 2) {
        comparedCardsCounter = comparedCardsCounter + 1;
        counterMoves(comparedCardsCounter);
        if (
          flippedCards[0].getAttribute("dataId") ===
          flippedCards[1].getAttribute("dataId")
        ) {
          totalCorrect++;
          totalCorrectCounter(totalCorrect);
          setTimeout(() => {
            flippedCards.forEach((card) => {
              card.classList.add("correct");
              card.classList.remove("turnedCard");
            });
          }, 500);
        } else {
          setTimeout(() => {
            flippedCards.forEach((item) => {
              item.classList.remove("flipped");
              item.classList.remove("turnedCard");
            });
          }, 1000);
        }
      }
    });
  });
};
// Start game
const startGame = () => {
  const cards = document.querySelectorAll(".card");
  const timeDOM = document.querySelector(".time");
  const watchEl = document.createElement("span");
  let started = false;
  let SECONDS = 0;
  watchEl.classList = "watch";
  watchEl.innerText = "00:00";
  timeDOM.appendChild(watchEl);
  const startBtn = document.querySelector(".actions button:first-child");
  startBtn.classList.add("start");
  startBtn.addEventListener("click", () => {
    if (!started) {
      started = true;
      section.style.pointerEvents = "none";
      section.style.cursor = "pointer";
      cards.forEach((card) => {
        card.style.pointerEvents = "all";
        card.style.cursor = "pointer";
      });
      startBtn.innerText = "pause";
      myTimer = setInterval(() => {
        SECONDS++;
        gameTime = new Date(SECONDS * 1000).toISOString().substring(14, 19);
        watchEl.innerText = `${gameTime}`;
      }, 1000);
    } else {
      section.style.cursor = "not-allowed";
      // section.style.pointerEvents = "none";
      cards.forEach((card) => {
        card.style.pointerEvents = "none";
      });
      started = false;
      startBtn.innerText = "start";
      clearInterval(myTimer);
    }
  });
};
// Count number of moves
function counterMoves(comparedCardsCounter = 0) {
  const moves = document.querySelector(".moves span:last-child");
  moves.innerHTML = `<span>${comparedCardsCounter}</span>`;
}
// Count total correct answers
function totalCorrectCounter(totalCorrect) {
  const modal = document.querySelector(".modal");
  const endModalContent = document.querySelector(".endModalContent");
  if (selectedTheme === "actors" && totalCorrect === 18) {
    endTotalInfo(gameTime, comparedCardsCounter);
    endGame(myTimer);
    setTimeout(() => {
      modal.classList.add("show");
      endModalContent.classList.add("showEndModal");
    }, 2000);
  } else if (
    (selectedTheme === "Al Pacino" || selectedTheme === "Robert De Niro") &&
    totalCorrect === 9
  ) {
    endTotalInfo(gameTime, comparedCardsCounter);
    endGame(myTimer);
    setTimeout(() => {
      modal.classList.add("show");
      endModalContent.classList.add("showEndModal");
    }, 2000);
  }
}
// End game function
function endGame(myTimer) {
  clearInterval(myTimer);
}
// Stats information at the end of game
function endTotalInfo(time, moves) {
  const endTimeInfo = document.querySelector(".endTimeInfo");
  const totalTime = document.createElement("span");
  totalTime.innerText = time;
  endTimeInfo.appendChild(totalTime);
  const endTotalMoves = document.querySelector(".endTotalMoves");
  const totalMoves = document.createElement("span");
  totalMoves.innerText = moves;
  endTotalMoves.appendChild(totalMoves);
  restartGame();
}
// Restart game
function restartGame() {
  const restartBtn = document.querySelector(".endGameActions button");
  console.log(restartBtn);
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}
// Get selected item
function getSelectedItem() {
  const modal = document.querySelector(".modal");
  const startModalContent = document.querySelector(".startModalContent");
  const enterBtn = document.querySelector(".startGameActions button");
  const radioButtons = document.querySelectorAll("input[name='themeOption']");
  enterBtn.addEventListener("click", () => {
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        selectedTheme = radioButton.value;
        break;
      }
    }
    // Show alert if nothing is selected
    if (selectedTheme === null) {
      alert("Please choose your theme.");
      return;
    } else {
      startModalContent.classList.remove("showStartModal");
      modal.classList.remove("show");
    }

    setParams();
    fetchData()
      .then((data) => {
        randomize(data);
        return data;
      })
      .then((data) => {
        createCards(data);
        return data;
      })
      .then((data) => {
        compareCards();
        return data;
      })
      .then((data) => {
        startGame();
        return data;
      })
      .then((data) => {
        counterMoves();
        return data;
      })
      .catch((error) => alert(error));
    return selectedTheme;
  });
}
// First get selected data then fetch data
getSelectedItem();
