const ghpages = require('gh-pages');
const package = require('../package.json');
const common = require('../webpack.config.common.js');

const source = common.folders.bin;

console.log('------------------------ deploying to github pages - started ------------------------');
console.log('publishing "' + source + '" to "' + package.repository.url + '"');

ghpages.publish(source, function(err) {
    if (err) {
        console.error(err);
        console.log('------------------------ deploying to github pages - failed ------------------------');
    } else
        console.log('------------------------ deploying to github pages - succeeded ------------------------');
});