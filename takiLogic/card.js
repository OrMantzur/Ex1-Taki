/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const NUMBER_CARD = ["1", "3", "4", "5", "6", "7", "8", "9", "taki", "stop"];
const SpecialCard = {
    TAKI: "taki",
    STOP: "stop",
    CHANGE_COLOR: "changeColor",
    PLUS: "plus",
    // TODO advance game
    PLUS_2: "+2",
    SUPER_TAKI: "superTaki"
};
const Color = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow",
    NONE:"none"
};
Card.nextFreeCardId = 0;

function Card(color, value) {
    const cardId = Card.nextFreeCardId++;
    const cardColor = color;
    const cardValue = value;

    return {
        getId: function () {
            return cardId;
        },

        getColor: function () {
            return cardColor;
        },

        getValue: function () {
            return cardValue;
        },

        printCardToConsole: function () {
            console.log("Color: " + cardColor + ", Value: " + cardValue);
        }
    }
}
