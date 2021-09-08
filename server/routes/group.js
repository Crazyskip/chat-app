var express = require("express");
var router = express.Router();

const dataFunctions = require("../dataFunctions");
const data = dataFunctions.getData();

// New group
router.post("/", function (req, res) {
  const newGroup = { ...req.body };

  data.groups.push(newGroup);

  dataFunctions.updateDataFile(data);

  res.send({ group: newGroup });
});

router
  .route("/:id")
  // Get group
  .get(function (req, res) {
    const groupID = Number(req.params.id);

    res.send({ group: data.groups.find((group) => group.id === groupID) });
  })
  // Update group
  .put(function (req, res) {
    const groupIndex = data.groups.findIndex(
      (group) => group.id === Number(req.params.id)
    );

    if (groupIndex === -1) return res.status(404).json({});

    const updatedGroup = { ...req.body };
    data.groups[groupIndex] = updatedGroup;

    dataFunctions.updateDataFile(data);

    res.send({ group: updatedGroup });
  })
  // Delete group
  .delete(function (req, res) {
    const groupIndex = data.groups.findIndex(
      (group) => group.id === Number(req.params.id)
    );

    if (groupIndex === -1) return res.send({ success: false });

    data.groups.splice(groupIndex, 1);

    dataFunctions.updateDataFile(data);

    res.send({ success: true });
  });

// New group channel
router.post("/:groupID/channel/:channelID", function (req, res) {
  const groupIndex = data.groups.findIndex(
    (group) => group.id === Number(req.params.groupID)
  );

  const channelIndex = data.groups[groupIndex].channels.findIndex(
    (channel) => channel.id === Number(req.params.channelID)
  );

  if (groupIndex === -1 || channelIndex === -1) {
    return res.send({ success: false });
  }

  const newMessage = { user: req.body.userID, message: req.body.message };

  data.groups[groupIndex].channels[channelIndex].messages.push(newMessage);

  dataFunctions.updateDataFile(data);

  res.send({ success: true, message: newMessage });
});

module.exports = router;
