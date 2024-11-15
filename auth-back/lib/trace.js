const bunyan = require("bunyan");

const log = bunyan.createLogger({
  name: "FonoAPI",
  stream: process.stdout,
});

module.exports = log;
