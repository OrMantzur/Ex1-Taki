/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function sleep(millisecs) {
    var initiation = new Date().getTime();
    while ((new Date().getTime() - initiation) < millisecs);
}
