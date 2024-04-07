const { Visitor, load } = require("../src/node_file_io.js");
const { handleFolder, filePath } = require("../src/helper_functions.js");
const fs = require("fs");
const {
  successMessages,
  errorMessages,
  validations,
} = require("../src/helper_objects.js");

describe("Visitor class", () => {
  let mockVisitorData;
  beforeEach(() => {
    consoleLogSpy = spyOn(console, "log");

    mockVisitorData = new Visitor(
      "Mock Visitor",
      23,
      "2023-10-05",
      "11:13",
      "He is a tall dude",
      "Joseph La Thatha"
    );
  });

  afterEach(() => {
    consoleLogSpy.and.callThrough();
    handleFolder("visitors");
  });

  describe("save method", () => {
    it("should create a JSON file for a user", async () => {
      spyOn(fs, "writeFile").and.callFake((_filePath, _data, callback) => {
        callback(null);
      });

      await mockVisitorData.save();

      const dateConversion = new Date(mockVisitorData.dateOfVisit);

      expect(fs.writeFile).toHaveBeenCalledOnceWith(
        filePath(mockVisitorData.fullName),
        JSON.stringify(
          {
            id: mockVisitorData.id,
            fullName: mockVisitorData.fullName,
            age: mockVisitorData.age,
            dateOfVisit: dateConversion,
            timeOfVisit: mockVisitorData.timeOfVisit,
            comments: mockVisitorData.comments,
            assistorName: mockVisitorData.assistorName,
          },
          null,
          2
        ),
        jasmine.any(Function)
      );

      expect(consoleLogSpy).toHaveBeenCalledOnceWith(
        successMessages.createdFile()
      );
    });

    it("should handle an invalid age", async () => {
      mockVisitorData.age = "0";
      const { param, expectedValue } = validations[0];
      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorVisitorAttributes("0", param, expectedValue)
      );
    });

    it("should handle an invalid time of visit", async () => {
      mockVisitorData.timeOfVisit = "0";
      const { param, expectedValue } = validations[2];
      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorVisitorAttributes("0", param, expectedValue)
      );
    });

    it("should handle invalid comments", async () => {
      mockVisitorData.comments = 0;
      const { param, expectedValue } = validations[3];
      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorVisitorAttributes(0, param, expectedValue)
      );
    });

    it("should handle an invalid full name", async () => {
      mockVisitorData.fullName = 0;

      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorFullName(0)
      );
    });

    it("should handle an invalid assistor name", async () => {
      mockVisitorData.assistorName = 0;

      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorFullName(0)
      );
    });

    it("should throw an error when failing to write a file", async () => {
      writeFileMock = jasmine.createSpy("writeFile");
      spyOn(fs, "writeFile").and.callFake(writeFileMock);
      const errMessage = "Cannot write file";

      writeFileMock.and.callFake((_path, _encoding, callback) => {
        callback(new Error(errMessage), null);
      });

      await expectAsync(mockVisitorData.save()).toBeRejectedWithError(
        errorMessages.errorCreatingFile(errMessage)
      );
    });
  });
});

describe("load function", () => {
  let fullName;
  beforeEach(() => {
    fullName = "John Doe";
  });
  it("should load a visitor from a JSON file", async () => {
    const readFileMock = jasmine
      .createSpy("readFile")
      .and.callFake((_path, _encoding, callback) => {
        callback(
          null,
          JSON.stringify({
            fullName: "John Doe",
            age: 30,
            dateOfVisit: "2022-01-01",
            timeOfVisit: "10:00 AM",
            comments: "Good visit",
            assistorName: "Mark Bafana",
            id: "123",
          })
        );
      });

    spyOn(fs, "readFile").and.callFake(readFileMock);

    await load(fullName);

    expect(readFileMock).toHaveBeenCalledWith(
      filePath(fullName),
      "utf8",
      jasmine.any(Function)
    );
  });

  it("should throw an error when the file is not found", async () => {
    const unexpectedErrorMessage = "Simulated error";
    const readFileMock = jasmine
      .createSpy("readFile")
      .and.callFake((_path, _encoding, callback) => {
        callback(new Error(unexpectedErrorMessage));
      });

    spyOn(fs, "readFile").and.callFake(readFileMock);

    await expectAsync(load("Ntokozo Kubheka")).toBeRejectedWithError(
      errorMessages.errorReadingFile(unexpectedErrorMessage)
    );
  });

  it("should throw an error if the full name argument is not valid", async () => {
    expect(() => load("Ntokozo")).toThrowError("Invalid full name: ntokozo");
  });
});