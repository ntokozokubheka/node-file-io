const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");

const {
  validations,
  regexObjects,
  errorMessages,
} = require("./helper_objects.js");

const validateParameters = (...args) => {
  for (const { param, type, minLen, pattern, expectedValue } of validations) {
    const value = args[validations.findIndex((v) => v.param === param)];

    if (
      (type === "string" &&
        (typeof value !== "string" ||
          (minLen !== undefined && value.length < minLen))) ||
      (type === "integer" && !Number.isInteger(value)) ||
      (type === "string" && pattern && !pattern.test(value))
    ) {
      throw new Error(
        errorMessages.errorVisitorAttributes(value, param, expectedValue)
      );
    }
  }
};

const validateFullName = (fullName) => {
  const nameRegex = regexObjects.namePattern;

  if (!nameRegex.test(fullName)) {
    throw new Error(errorMessages.errorFullName(fullName));
  }
};

const handleFolder = (filePath) => {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    if (files.length === 0) {
      rimraf.sync(filePath);
    }
  }
};

const filePath = (fullName) => {
  const sanitizedFullName = fullName.toLowerCase().replace(/\s/g, "_");
  const folderPath = `visitors`;
  return path.join(folderPath, `visitor_${sanitizedFullName}.json`);
};

module.exports = {
  validateParameters,
  validateFullName,
  handleFolder,
  filePath,
};