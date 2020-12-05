const folder_name = ""; // TODO: SETTING FOLDER_NAME WHICH YOU WANT TO CHECK EXIST JAPANESE AT HERE
const fs = require("fs");
const gracefulFs = require('graceful-fs'); //Fix error: Error: EMFILE: too many open files
gracefulFs.gracefulify(fs);
const klaw = require("klaw");

// An array to store the folder and files inside
let items = [];

// Push file or folder to above array
klaw(folder_name)
  .on("data", function (item) {
    if (fs.lstatSync(item.path).isFile()) {
      items.push(item.path);
    }
  })
  .on("end", function () {
    console.log(items);
    // Loop above lists and read file
    console.log("Total files: " + items.length);
    items.forEach((item) => {
      fs.readFile(item, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          console.log(item + "===> READ FILE ERROR !!!");
        } else {
          if (
            data.match(
              /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g
            )
          ) {
            console.log(item + " ===> Japanese is exist !!!");
          } else {
            console.log(item + " ===> OK !!!");
          }
        }
      });
    });
  })
  .on("error", function (err, item) {
    console.log(err.message);
    console.log(item.path);
  });