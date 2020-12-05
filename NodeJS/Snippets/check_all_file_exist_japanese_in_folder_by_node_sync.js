const folder_name = ""; // TODO: SETTING FOLDER_NAME WHICH YOU WANT TO CHECK EXIST JAPANESE AT HERE
const fs = require("fs");
const gracefulFs = require("graceful-fs"); gracefulFs.gracefulify(fs);//Fix error: Error: EMFILE: too many open files
const klaw = require("klaw");

// An array to store the folder and files inside
let items = [];
let error_files = [];
let japanese_files = [];
let no_japanese_files = [];

// Push file or folder to above array
klaw(folder_name)
  .on("data", function (item) {
    if (fs.lstatSync(item.path).isFile()) {
      items.push(item.path);
    }
  })
  .on("end", function () {
    // Loop above lists and read file
    console.log("Total files: " + items.length);
    items.forEach((item) => {
      try {
        let data = fs.readFileSync(item).toString();
        if (data.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
          japanese_files.push(item);
        } else {
          no_japanese_files.push(item);
        }
      } catch (error) {
        error_files.push(item);
      }
    });

    // Print list file: read file error, exist japanese files, no existing japanese files
    // READ FILE ERROR
    console.log("================== READ FILE ERROR: " + error_files.length + " ==================");
    error_files.forEach((item) => {
      console.log(item);
    });

    // EXIST JAPANESE FILES
    console.log("================== EXIST JAPANESE FILES: " + japanese_files.length + " ==================");
    japanese_files.forEach((item) => {
      console.log(item);
    });

    // NO EXISTING FILES: CONVERT => OK
    console.log("================== NO EXISTING JAPANESE FILES: " + no_japanese_files.length + "==================");
    no_japanese_files.forEach((item) => {
      console.log(item);
    });
  })
  .on("error", function (err, item) {
    console.log(err.message);
    console.log(item.path);
  });