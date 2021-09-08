const fs = require("fs");
const data = require("./data.json");

module.exports = {
  // Return data from json file
  getData: function () {
    return data;
  },

  // Update data in json file
  updateDataFile: function (newData) {
    fs.writeFile("data.json", JSON.stringify(newData), function (error) {
      if (error) console.log(error);
    });
  },
};
