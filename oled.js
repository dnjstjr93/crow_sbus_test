// I2C
var bus = 1;
var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(bus),
    oled = require('oled-i2c-bus');
var font = require('oled-font-5x7');
var sleep = require('system-sleep');

const SIZE_X=128,
    SIZE_Y=32;

var opts = {
    width: SIZE_X,
    height: SIZE_Y,
    address: 0x3c
};

try {
    var oled = new oled(i2cBus, opts);

    oled.clearDisplay();
    oled.turnOnDisplay();
}
catch(err) {
    // Print an error message and terminate the application
    console.log(err.message);
    process.exit(1);
}

oled.setCursor(0,10);
oled.writeString(font, 1, 'Start nCube', 1, false);
