var config = require('./config');
var Kira = require('./engine/socket/socket');

// Socket init
Kira.init();

console.log("Server corriendo en el pruetro: " + config.port);
