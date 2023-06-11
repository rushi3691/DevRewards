function validatePercentInteger(string) {
    var value = parseInt(string, 10);
    return Number.isInteger(value) && value >= 1 && value <= 100;
}

function validateETHValue(string) {
    // Regular expression pattern to match valid ETH value
    var pattern = /^(\d+(\.\d*)?|\.\d+)$/;

    // Additional checks
    var value = parseFloat(string);
    var isValid = pattern.test(string) && !isNaN(value) && value >= 0;

    return isValid;
}

module.exports = {
    validatePercentInteger,
    validateETHValue
};