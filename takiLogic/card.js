/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const CARD_VALUES = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"]; // "change color" is added manually in the "Deck" function
const COLORS = ["red", "green", "blue", "yellow"];

const SpecialCard = {
    SUPER_TAKI: "superTaki",
    TAKI: "taki",
    CHANGE_COLOR: "changeColor",
    CHANGE_DIRECTION: "changeDirection",
    PLUS: "plus",
    PLUS_2: "+2",
    STOP: "stop",
};
















function Card(color, value) {
    // TODO auto
    const cardId = 1;
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
