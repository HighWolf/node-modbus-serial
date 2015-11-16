// Create serial port
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyUSB0", {baudrate: 9600});
var lastAns = Date.now();

// Create modbus master
//var ModbusRTU = require("modbus-serial");
var ModbusRTU = require("../index");
var modbusRTU = new ModbusRTU(serialPort);

// Open modbus communication.
modbusRTU.open(start);

/* read 10 registers every one second 
 * 1 - The Slave Address.
 * 0 - The Data Address of the first register.
 * 10 - Number of registers to read.
 */
function start() {
    modbusRTU.writeFC4(1, 0, 10, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data.data);
        }
        lastAns = Date.now();
        start();
    });
}

// Watch dog
setInterval(function() {
    if (lastAns < (Date.now() - 5000)) {
        lastAns = Date.now();
        start();
    }
});
