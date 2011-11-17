// Define String.trim()
if(typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function() {
        return ('' + this).replace(/^\s+|\s+$/g, '');
    };
}

var timesTable;

function parseRange(s) {
    var numbers = [];
    var valid = true;
    $.each(s.split(','), function(index, bit) {
        // Try interpreting it as a range
        var splitBit = bit.split('-', 2);
        var from = parseInt(splitBit[0]);
        var to = parseInt(splitBit[1]);
        if(!isNaN(from) && !isNaN(to)) {
            for(var i = from; i <= to; ++i) {
                numbers[numbers.length] = i;
            }
        // If that doesn't work, interpret it as a single integer
        } else {
            var num = parseInt(bit);
            if(!isNaN(num)) {
                numbers[numbers.length] = num;
            // If all else fails, bail out
            } else {
                valid = false;
                return false;
            }
        }
    });
    console.log(numbers);
    return (valid ? numbers : null);
}

// Main times table class
function TimesTable(sandbox) {
    this.sandbox = $(sandbox);
    this.rows = [];
    this.cols = [];
}

TimesTable.prototype.clear = function() {
    this.sandbox.empty();
};

TimesTable.prototype.render = function() {
    var rows = this.rows;
    var cols = this.cols;
    var table = $('<table/>');

    // Build the header
    var header = $('<thead/>').appendTo(table);
    var headerRow = $('<tr/>').appendTo(header);
    // Multiplication sign in the top-left corner
    $('<th class="times-sign">&times;</th>').appendTo(headerRow);
    // Add each number, one by one
    $.each(cols, function(_, col) {
        $('<th/>').text(col).appendTo(headerRow);
    });

    // Fill the table
    var body = $('<tbody/>').appendTo(table);
    $.each(rows, function(_, row) {
        var rowElem = $('<tr/>').appendTo(body);
        $('<th/>').text(row).appendTo(rowElem);
        $.each(cols, function(_, col) {
            $('<td/>').text(row * col).appendTo(rowElem);
        });
    });

    this.clear();
    table.appendTo(this.sandbox);
};

TimesTable.prototype.update = function(inputs) {
    var rows = parseRange(inputs.rows);
    var cols = parseRange(inputs.cols);
    if(rows !== null && cols !== null) {
        this.rows = rows;
        this.cols = cols;
        this.render();
        return true;
    } else {
        return false;
    }
};

function inputsChanged() {
    var inputs = {};
    $('#options input').each(function(index, elem) {
        inputs[$(elem).attr('id')] = $(elem).val();
    });
    timesTable.update(inputs);
}

$(document).ready(function() {
    window.timesTable = new TimesTable($('#sandbox'));
    inputsChanged();
    $('#options input').change(inputsChanged);
});
