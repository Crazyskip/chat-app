var express = require("express");
var cors = require("cors");
var app = express();
var http = require("http").Server(app);
var path = require("path");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../dist/chat-app/")));

let server = http.listen(3000, function () {
  let port = server.address().port;
  console.log(`Server listening on port: ${port}`);
});

// Handle backend routes
require("./routes/api.js")(app, path);

// Handle frontend routes
app.all("*", function (req, res) {
  res
    .status(200)
    .sendFile(`/`, { root: path.join(__dirname, "../dist/chat-app/") });
});
