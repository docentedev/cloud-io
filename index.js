// const { exec } = require('child_process');
// exec('./node_modules/webpack/bin/webpack.js', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`error: ${error.message}`);
//         return;
//     }

//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//     }

//     console.log(`stdout:\n${stdout}`);
// });

const fs = require('fs');
const dir = './upload';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


module.exports = require("./src/index.js");