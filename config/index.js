const env = process.env.NODE_ENV;
const config = require(`./${env}`);

module.exports = config;