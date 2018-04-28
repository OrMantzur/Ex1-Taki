/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

var game = Game(GameType.BASIC, 2, "Taki Man", "ex1");
var regularPlayer = Player("Me", false);
var computerPlayer = Player("Computer", true);

function initGame() {
    console.log("Running tests:");
    game.addPlayerToGame(regularPlayer);
    game.addPlayerToGame(computerPlayer);
    console.log("Top card is: ");
    game.viewTopCardOnTable().printCardToConsole();
    document.addEventListener("DOMContentLoaded", function () {
        var currPlayerIndex = 0;
        var cardsRemainingTableElement = document.getElementById('cardsRemainingTable');
        var currPlayer;
        while (currPlayer = game.getPlayer(currPlayerIndex)) {
            var newRow = document.createElement("tr");
            newRow.innerHTML = "<td>" + currPlayer.getName() + "</td><td id='cardsRemaining_" + game.getPlayer(currPlayerIndex).getName() + "'>" + currPlayer.getCardsRemainingNum() + "</td>";
            cardsRemainingTableElement.appendChild(newRow);
            currPlayerIndex++;
        }
        updateStatistics();
        refreshCards();
        overlayToggle();
    });
}

function drawPlayerCardsOnScreen(playerId, containerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    var playerCardsContainer = document.getElementById(containerId);

    // if there is a card in the players hand that is not on the screen then add it
    playerCards.forEach(function (card) {
        if (document.getElementById(card.getId()) === null) {
            var cardElement = createCardElement(card, true);
            cardElement.addEventListener("click", function () {
                // if a card is clicked and a successful move is made, remove the card from the deck
                if (card.getValue() === SpecialCard.CHANGE_COLOR && game.getGameState().gameState !== GameState.OPEN_TAKI) {
                    document.getElementById("colorPicker").style.display = "flex";
                    document.getElementById("colorPicker").setAttribute("selectedCardId", card.getId());
                    playerCardsContainer.removeChild(cardElement);
                }
                else {
                    if (game.makeMove(card)) {
                        playerCardsContainer.removeChild(cardElement);
                        drawTopCardOnTable()
                    }
                }
            });
            playerCardsContainer.appendChild(cardElement);
        }
    });
}

function createCardElement(card, isClickable) {
    var cardElement = document.createElement("div");
    var cardColor = card.getColor() !== null ? card.getColor() : "noColor";
    cardElement.setAttribute("class", "card " + cardColor + (isClickable ? " clickable-card" : ""));
    cardElement.setAttribute("cardValue", card);
    cardElement.setAttribute("id", "" + card.getId());
    if (card.getValue().length > 1)
        cardElement.className += " textCard";
    cardElement.textContent = card.getValue();
    return cardElement;
}

function drawTopCardOnTable() {
    var card = game.viewTopCardOnTable();
    var deckElement = document.getElementById('topCard');
    var cardElement = createCardElement(card, false);
    while (deckElement.firstChild)
        deckElement.removeChild(deckElement.firstChild);
    deckElement.appendChild(cardElement);
}

function clickedDeck() {
    game.takeCardsFromDeck();
    refreshCards();
}

function refreshCards() {
    drawPlayerCardsOnScreen(0, 'player-container');
    // drawPlayerCardsOnScreen(1, 'player-container2');
    drawTopCardOnTable("topCard");
    updateIsCurrPlayerTurn();
    updateStatistics();
}

function updateIsCurrPlayerTurn() {
    var currPlayerTurn = document.getElementById("isCurrPlayerTurn");
    var activePlayer = game.getActivePlayer();
    var msg;
    if (activePlayer.getId() === regularPlayer.getId()) {
        msg = "your turn";
    } else {
        msg = "computer player is playing now";
    }
    currPlayerTurn.innerText = msg;
}

function overlayToggle() {
    var currentPlayer = null;
    var OVERLAY_TOGGLE_INTERVAL = 200;
    var currentTopCard = null;
    setInterval(function () {
        //if the active player hasn't changed don't do anything
        if (currentPlayer !== game.getActivePlayer()) {
            currentPlayer = game.getActivePlayer();
            var screenOverlay = document.getElementById("player-overlay");
            var deck = document.getElementById("deck");
            if (game.getActivePlayer().getName() === 'p2') {
                screenOverlay.style.display = "block";
                deck.classList.add("disabled-button");
            } else {
                screenOverlay.style.display = "none";
                deck.classList.remove("disabled-button");
            }
            refreshCards();
        }
        if (currentTopCard !== game.viewTopCardOnTable()) {
            currentTopCard = game.viewTopCardOnTable();
            drawTopCardOnTable("topCard");
        }
        if (game.getGameState().gameState === GameState.GAME_ENDED) {
            document.getElementById("playerWonScreen").style.display = 'flex';
            document.getElementById("player-overlay").style.display = 'block';
            document.getElementById('winningPlayerName').innerText = game.getGameState().additionalInfo.getName();
            var stats = game.getStatistics();
            document.getElementById('gameStatistics').innerHTML = "Total time played: " + stats.getGameDuration() + "</br> Total turns played: " + stats.getTotalTurnsPlayed();
            var playerStats = "";
            var player;
            for (var i = 0; (player = game.getPlayer(i)) !== undefined; i++) {
                playerStats += player.getName() + ":\n    Total turns played: " + player.getTotalTurnsPlayed() + ":\n    AverageTurnTime: " + player.getAverageTurnTime() + "\n    Times reached last card: " + player.getTimesReachedSingleCard() + "\n";
            }
            document.getElementById('playerStatistics').innerText = playerStats;
        }
    }, OVERLAY_TOGGLE_INTERVAL)
}

function colorPickerClickedCard(color) {
    document.getElementById("colorPicker").style.display = "none";
    var selectedCard = game.getActivePlayer().getCardById(document.getElementById("colorPicker").getAttribute("selectedCardId"));
    game.makeMove(selectedCard, color);
    drawTopCardOnTable()
}

function updateStatistics() {
    var currPlayerIndex = 0;
    var currPlayer;
    document.getElementById('cardsInDeckCount').innerText = game.getCardsRemainingInDeck();
    document.getElementById('cardsOnTableCount').innerText = game.getCardsOnTableCount();
    document.getElementById('totalTurn').innerText = game.getStatistics().getTotalTurnsPlayed();
    while (currPlayer = game.getPlayer(currPlayerIndex)) {
        var tableRow = document.getElementById("cardsRemaining_" + currPlayer.getName());
        tableRow.innerText = game.getPlayer(currPlayerIndex).getCardsRemainingNum();
        if (currPlayer === game.getActivePlayer()) {
            tableRow.parentElement.setAttribute("class", "bold");
        } else {
            tableRow.parentElement.classList.remove("bold");
        }
        currPlayerIndex++;
    }
}

function exitGame() {
    // TODO test
    game.leaveGame(regularPlayer.getId());
}

initGame();

setInterval(function () {
    // update clock
    var timerElement = document.getElementById("timer");
    var gameDurationInMilliSecond = game.getGameDuration().toString();
    var secondsPlayed = Math.floor(gameDurationInMilliSecond / 1000) % 60;
    var minutesPlayed = Math.floor(gameDurationInMilliSecond / (1000 * 60));
    var hoursPlayed = Math.floor(gameDurationInMilliSecond / (1000 * 60 * 60));
    var timer = (minutesPlayed < 10 ? "0" + minutesPlayed : minutesPlayed) + ":" + (secondsPlayed < 10 ? "0" + secondsPlayed : secondsPlayed);

    if (hoursPlayed !== 0) {
        timer = hoursPlayed + ":" + timer;
    }
    timerElement.innerText = timer;

    // check hint to player that he need to take card from deck
    var activePlayer = game.getActivePlayer();
    if (activePlayer.getId() === regularPlayer.getId() && game.getPossibleMoveForActivePlayer() === null) {
        document.getElementById("needTakeCardFromDeck").innerText = "out of move take card from deck";
    } else {
        document.getElementById("needTakeCardFromDeck").innerText = "";
    }
}, 1000);
