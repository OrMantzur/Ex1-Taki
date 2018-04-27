/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function drawCardOnScreenNew(){
    var playerCards = game.getPlayer(0).getCards();
    var playerCardsContainer = document.getElementById("playerCardsContainer");
    var cardIndex = 0;

    playerCards.forEach(function(card){
        var cardElement = document.createElement("div");
        cardElement.setAttribute("id", cardIndex.toString());
        cardElement.setAttribute("class", "card " + card.getColor());
        cardIndex++;
        cardElement.addEventListener("click", function () {
            game.makeMove(card);
            refreshCards();
        });
        cardElement.textContent = card.getValue();
        // cardElement.style = "color: " + card.getColor();
        playerCardsContainer.appendChild(cardElement);
    });
}

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
    playerCards.forEach(function(card){
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
    drawCardOnScreen("player1CardsTable", 0);
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
