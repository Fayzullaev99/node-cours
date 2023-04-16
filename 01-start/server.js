// console.log("Hello World");

// console.log(global);

// const os = require('os')

// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());
// console.log(os.hostname());
// console.log(os.userInfo());
// console.log(__dirname);
// console.log(__filename);

// const path = require('path')

// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));
// console.log(path.parse(__filename));


const {add, subtract, multiply, divide} = require('./math')

console.log(add(2,3));
console.log(subtract(5,3));
console.log(multiply(5,5));
console.log(divide(25,5));