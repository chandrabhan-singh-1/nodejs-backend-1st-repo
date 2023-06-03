// const http = require("http");
// const myName = require("./features");
import http from "http";
import * as obj from "./features.js"; // import

import fs from "fs";
import path from "path";

/* 
import ChampakChacha from "./features.js"; // imported name can be different from the exported name in case of default export

import { myName2, myName3 } from "./features.js"; // imported name must match the exported name in case of individual export

import myName, {myName2, myName3} from "./features
*/

import { generateLovePercent } from "./features.js";

console.log(http);
console.log(obj.myName);
console.log(generateLovePercent());
console.log(obj.generateLovePercent());
// console.log(myName2);
// console.log(myName3);

// const server = http.createServer((req, res) => {
//   console.log(req.url);
//   console.log("Server...");
// });

// const home = fs.readFile("./index.html", () => {
//   console.log("File Read...");
// });

const home = fs.readFileSync("./index.html");

// console.log(path.extname("/home/random/index.js"));
console.log(path.dirname("/home/random/index.js"));

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log("Server...");

  // res.end("noice");
  // res.end("<h1>Hello Bhamsa</h1>");

  console.log(req.method);

  if (req.url === "/") {
    res.end(
      `<h1>Our Home Page</h1><p>Love percentage: ${generateLovePercent()}</p>`
    );
  } else if (req.url === "/about") {
    // console.log(home);
    res.end("<h1>Our About Page</h1>");
  } else if (req.url === "/contact") {
    // fs.readFile("./index.html", (err, data) => {
    //   console.log("File Read...");
    //   res.end(data);
    // });
    // res.end("<h1>Our Contact Page</h1>");
    res.end(home);
  } else {
    res.end("Page Not Found. 404");
  }
});

server.listen(5000, () => {
  console.log("Server is working...");
});
