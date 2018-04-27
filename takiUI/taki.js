/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function drawCardOnScreen() {
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
}

function refreshCards() {
    drawCardOnScreen();
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
