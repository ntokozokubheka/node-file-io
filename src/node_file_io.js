const fs = require("fs");
const { promisify } = require("util");

const {
  validateParameters,
  validateFullName,
  filePath,
} = require("./helper_functions.js");

const { errorMessages, successMessages } = require("./helper_objects.js");

class Visitor {
  static instanceCount = 0;

  constructor(fullName, age, dateOfVisit, timeOfVisit, comments, assistorName) {
    Visitor.instanceCount++;
    this.id = Visitor.instanceCount;
    this.fullName = fullName;
    this.age = age;
    this.dateOfVisit = dateOfVisit;
    this.timeOfVisit = timeOfVisit;
    this.comments = comments;
    this.assistorName = assistorName;
  }

  async save() {
    validateParameters(
      this.age,
      this.dateOfVisit,
      this.timeOfVisit,
      this.comments
    );

    validateFullName(this.fullName);
    validateFullName(this.assistorName);
    const dateConversion = new Date(this.dateOfVisit);
    const folderPath = "visitors";
    const dataToWrite = {
      id: this.id,
      fullName: this.fullName,
      age: this.age,
      dateOfVisit: dateConversion,
      timeOfVisit: this.timeOfVisit,
      comments: this.comments,
      assistorName: this.assistorName,
    };

    const jsonData = JSON.stringify(dataToWrite, null, 2);

    const accessAsync = promisify(fs.access);
    const writeFileAsync = promisify(fs.writeFile);

    try {
      await accessAsync(filePath(this.fullName), fs.constants.F_OK);
      throw new Error(errorMessages.errorFileExists(filePath(this.fullName)));
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    try {
      await writeFileAsync(filePath(this.fullName), jsonData);
      console.log(successMessages.createdFile());
    } catch (err) {
      throw new Error(errorMessages.errorCreatingFile(err.message));
    }
  }
}

function load(fullName) {
  validateFullName(fullName.toLowerCase());

  return new Promise((resolve, reject) => {
    fs.readFile(filePath(fullName), "utf8", (err, data) => {
      if (err) {
        throw new Error(errorMessages.errorReadingFile(err.message));
      }

      try {
        const jsonData = JSON.parse(data);
        const visitor = new Visitor(
          jsonData.fullName,
          jsonData.age,
          jsonData.dateOfVisit,
          jsonData.timeOfVisit,
          jsonData.comments,
          jsonData.assistorName
        );
        visitor.id = jsonData.id;
        resolve(visitor);
      } catch (error) {
        throw new Error(errorMessages.errorReturningObject(error.message));
      }
    });
  });
}

module.exports = { Visitor, load };