const request = require('request');
const fs = require('fs');
const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const userInput = () => {
  return process.argv.slice(2, 4); //1st element is the page and second element is the local path given at the console
};

//This is the function that uses file system from node to write our file
//Bytes is the length of the body we receive
const writeToFile = (local, body) => {
  fs.writeFile(local, body, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Downloaded and saved ${body.length} bytes to ${local}`);
  });
};

const pageFetch = (page, local) => {
  request(page, (error, response, body) => {
   
    //This is to check if there's no error and also if the status code is non 200
    if (!error && response.statusCode === 200) {
      //This checks if the file exists already within our local system
      if (fs.existsSync(local)) {
        rl.question('File already exists, would you like to overwrite the existing file? Y or N: ', (answer) => {
          if (answer.toUpperCase() === "Y") {
            writeToFile(local, body);
            rl.close();
          } else if (answer.toUpperCase() === "N") {
            rl.close();
          } else {
            console.log("Not a valid input");
            rl.close();
          }
        });
      } else {
        writeToFile(local, body);
      }
    } else {
      console.log(`Returning status code: ${response.statusCode}. Failed to receive data.`);
      throw error;
    }
  });
};

const userInputArray = userInput();
//userInputArray[0] is the url and userInputArray[1] is the local path

pageFetch(userInputArray[0], userInputArray[1]);



// > node fetcher.js http://www.example.edu/ ./index.html
// Downloaded and saved 3261 bytes to ./index.html