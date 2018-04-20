
function drawCardOnScreen(parentId, playerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    // one player cards row at the caller table
    var cardsRowElement = document.createElement("tr");
    var cardIndex = 0;

    playerCards.forEach(card => {
        var cardElement = document.createElement("td");
        cardElement.setAttribute("id", cardIndex.toString());
        cardIndex++;
        cardElement.setAttribute("onclick", "game.makeMove()");
        cardElement.textContent = card.getValue();
        cardsRowElement.appendChild(cardElement);
    });
    document.getElementById(parentId).appendChild(cardsRowElement);
}
