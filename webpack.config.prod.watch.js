const prod = require('./webpack.config.prod.js');

prod.watch = true;
prod.watchOptions = {
    aggregateTimeout: 300,
    poll: 1000
};

module.exports = prod;