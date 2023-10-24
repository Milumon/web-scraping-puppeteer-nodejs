const fs = require('fs')

// Where to save .txt database (more of a cache)
const PATH = `${__dirname}/.data/database/`

// Promise-ified readFile, writeFile
const readFile = (path, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    });

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })

function parseKey(key) {
  return key.toLowerCase().replace(" ", "_").replace("'", "")
}

// (String nameOfFile, String pathToFile, Object data)
async function saveToDB(key, path, data) {
  console.log("Saving to DB: " + PATH + path + parseKey(key) + ".txt")
  writeFile(PATH + path + parseKey(key) + ".txt", JSON.stringify(data))
}

// (String nameOfFile, String pathToFile)
async function fetchFromDB(key, path) {
  console.log("Requesting from DB: " + PATH + path + parseKey(key) + ".txt")
  try {
    let rawData = await readFile(PATH + path + parseKey(key) + ".txt")
    return JSON.parse(rawData)
  }
  catch (ex) {
    console.log("Failed reading", PATH + path + parseKey(key) + ".txt");
    return null
  }
}

module.exports = {
  saveToDB: saveToDB,
  fetchFromDB: fetchFromDB
}