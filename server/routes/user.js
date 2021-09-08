var express = require("express");
var router = express.Router();

const dataFunctions = require("../dataFunctions");
const data = dataFunctions.getData();

// New user
router.post("/", function (req, res) {
  const newUser = { ...req.body };

  data.users.push(newUser);

  dataFunctions.updateDataFile(data);

  res.send({ user: newUser });
});

router
  .route("/:userID")
  // Update user
  .put(function (req, res) {
    const userIndex = data.users.findIndex(
      (user) => user.id === Number(req.params.userID)
    );

    if (userIndex === -1) return res.status(404).json({});

    const updatedUser = { ...req.body };
    data.users[userIndex] = updatedUser;

    dataFunctions.updateDataFile(data);

    res.send({ user: updatedUser });
  })
  // Delete user
  .delete(function (req, res) {
    const userIndex = data.users.findIndex(
      (user) => user.id === Number(req.params.userID)
    );

    if (userIndex === -1) return res.status(404).json({});

    data.users.splice(userIndex, 1);

    dataFunctions.updateDataFile(data);

    res.send({ success: true });
  });

module.exports = router;
