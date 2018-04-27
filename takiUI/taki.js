/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function drawCardOnScreenNew() {
    var playerCards = game.getPlayer(0).getCards();
    var playerCardsContainer = document.getElementById("playerCardsContainer");
    var cardIndex = 0;
    //clear all children
    while (playerCardsContainer.firstChild) {
        playerCardsContainer.removeChild(playerCardsContainer.firstChild);
    }

    playerCards.forEach(function (card) {
        var cardElement = document.createElement("div");
        var cardColor = card.getColor() !== null ? card.getColor() : "noColor";
        cardElement.setAttribute("id", cardIndex.toString());
        cardElement.setAttribute("class", "card " + cardColor);
        cardElement.setAttribute("cardValue", card);
        if (card.getValue().length > 1)
            cardElement.className += " textCard";
        cardIndex++;
        cardElement.addEventListener("click", function () {
            game.makeMove(card);
            refreshCards();
        });
        cardElement.textContent = card.getValue();
        // cardElement.style = "color: " + card.getColor();
        playerCardsContainer.appendChild(cardElement);
    });
    // for (var i = 0; i < playerCards.length; i++) {
    //     var card = playerCards[i];
    //     var cardElement = document.createElement("div");
    //     var cardColor = playerCards[i].getColor() !== null ? playerCards[i].getColor() : "noColor";
    //     cardElement.setAttribute("id", cardIndex.toString());
    //     cardElement.setAttribute("class", "card " + cardColor);
    //     cardElement.setAttribute("cardValue", card);
    //     if (playerCards[i].getValue().length > 1)
    //         cardElement.className += " textCard";
    //     cardIndex++;
    //     cardElement.addEventListener("click", function () {
    //         game.makeMove(card);
    //         refreshCards();
    //     });
    //     cardElement.textContent = playerCards[i].getValue();
    //     // cardElement.style = "color: " + card.getColor();
    //     playerCardsContainer.appendChild(cardElement);
    // }
};

function drawCardOnScreen(parentId, playerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    // one player cards row at the caller table
    var cardsRowElement = document.createElement("tr");
    var cardIndex = 0;

    //clear all children
    while (cardsRowElement.firstChild) {
        cardsRowElement.removeChild(cardsRowElement.firstChild);
    }
    document.getElementById(parentId).innerHTML = '';
    playerCards.forEach(function (card) {
        var cardElement = document.createElement("td");
        cardElement.setAttribute("id", cardIndex.toString());
        cardElement.setAttribute("class", "card " + card.getColor());
        cardIndex++;
        cardElement.addEventListener("click", function () {
            game.makeMove(card);
            refreshCards();
        });
        cardElement.textContent = card.getValue();
        // cardElement.style = "color: " + card.getColor();
        cardsRowElement.appendChild(cardElement);
    });
    document.getElementById(parentId).appendChild(cardsRowElement);
}

function refreshCards() {
    drawCardOnScreenNew();
    // drawCardOnScreen("player1CardsTable", 0);
    drawCardOnScreen("player2CardsTable", 1);
    drawTopCard("topCard");
}

function drawTopCard(parentId) {
    var card = game.viewTopCardOnTable();
    var cardElement = document.getElementById(parentId);
    cardElement.innerHTML = card.getValue();
    cardElement.style = "color: " + card.getColor();
}

function clickedDeck() {
    game.takeCardsFromDeck();
    refreshCards();
}
