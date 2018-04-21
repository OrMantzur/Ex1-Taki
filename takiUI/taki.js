function drawCardOnScreen(parentId, playerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    // one player cards row at the caller table
    var cardsRowElement = document.createElement("tr");
    var cardIndex = 0;

    playerCards.forEach(card => {
        var cardElement = document.createElement("td");
        cardElement.setAttribute("id", cardIndex.toString());
        cardIndex++;
        cardElement.addEventListener("click", function () {
            game.makeMove(card);
        });
        cardElement.textContent = card.getValue();
        cardElement.style = "color: " + card.getColor();
        cardsRowElement.appendChild(cardElement);
    });
    document.getElementById(parentId).appendChild(cardsRowElement);
}

// function drawTopCard(parentId) {
//     var card = game.viewTopCardOnTable();
//     parentId.textContent = card.getValue();
//     // parentId.style = "color: red";
// }
