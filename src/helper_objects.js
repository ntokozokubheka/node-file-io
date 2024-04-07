const errorMessages = {
  errorFileExists: function (err) {
    return `The file '${err}' exists.`;
  },
  errorCreatingFile: function (err) {
    return `Error creating/writing to JSON file: ${err}`;
  },
  errorReadingFile: function (err) {
    return `Error when trying to read file : ${err}`;
  },
  errorReturningObject: function (err) {
    return `Error when trying to return a Visitor object: ${err}`;
  },

  errorVisitorAttributes: function (param, value, expectedValue) {
    return `Invalid Visitor class property: ${param} = ${value} , ${expectedValue}`;
  },

  errorFullName: function (fullName) {
    return `Invalid full name: ${fullName}`;
  },
};

const successMessages = {
  createdFile: function () {
    return `Data saved to JSON file successfully!`;
  },
};

const validations = [
  { param: "age", type: "integer", expectedValue: "Use an integer value" },
  {
    param: "dateOfVisit",
    type: "string",
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    expectedValue: "Use the correct format : YYYY-MM-DD",
  },
  {
    param: "timeOfVisit",
    type: "string",
    pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    expectedValue: "Use the correct format : hh:mm",
  },
  {
    param: "comments",
    type: "string",
    minLen: 4,
    expectedValue: "Use the correct format : comments must be of length 4",
  },
];

const regexObjects = {
  namePattern: /^([A-Za-z]{2,}\s[A-Za-z]{2,}(?:\s[A-Za-z]{2,})?)$/,
};

module.exports = { errorMessages, successMessages, validations, regexObjects };