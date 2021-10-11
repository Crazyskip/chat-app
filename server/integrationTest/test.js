const app = require("../index.js").app;
const mongoClient = require("../index.js").mongoClient;

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

let group_id;

describe("Server Test", () => {
  before(async () => {
    await mongoClient.connect();
    const dbName = "chat";
    const db = mongoClient.db(dbName);

    const newGroup = {
      name: "Test Group",
      id: -1,
      assistants: [3],
      members: [4, 5],
      channels: [
        {
          id: 1,
          name: "test",
          members: [4, 5],
          messages: [
            {
              user: 1,
              type: "message",
              content: "Hello from super admin",
              sent: new Date(),
            },
            {
              user: 4,
              type: "message",
              content: "Hello super admin",
              sent: new Date(),
            },
          ],
        },
        {
          id: 2,
          name: "test2",
          members: [4],
          messages: [
            {
              user: 1,
              type: "message",
              content: "Hello from super admin",
              sent: new Date(),
            },
            {
              user: 4,
              type: "message",
              content: "Hello super admin",
              sent: new Date(),
            },
          ],
        },
      ],
    };

    const groupsCollection = db.collection("groups");
    await groupsCollection.insertOne({ ...newGroup });

    const result = await groupsCollection.findOne({ id: -1 });
    group_id = result._id;
  });

  after(async () => {
    await mongoClient.connect();
    const dbName = "chat";
    const db = mongoClient.db(dbName);

    const groupsCollection = db.collection("groups");
    await groupsCollection.deleteOne({ id: -1 });
  });

  describe("get/api/users", () => {
    it("should GET all the users", (done) => {
      chai
        .request(app)
        .get("/api/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("users");
          res.body.users.should.be.a("array");
          done();
        });
    });
  });

  describe("get/api/groups", () => {
    it("should GET all the groups", (done) => {
      chai
        .request(app)
        .get("/api/groups")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("groups");
          res.body.groups.should.be.a("array");
          done();
        });
    });
  });

  describe("get/api/group/:id", () => {
    it("should GET group with id -1", (done) => {
      chai
        .request(app)
        .get(`/api/group/${group_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("group");
          res.body.group.should.have.property("id").eql(-1);
          done();
        });
    });
  });

  describe("put/api/group/:id", () => {
    it("should UPDATE group with id -1 from name 'Test Group' to 'Testing Group'", (done) => {
      chai
        .request(app)
        .put(`/api/group/${group_id}`)
        .send({
          name: "Testing Group",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("group");
          res.body.group.should.have.property("id").eql(-1);
          res.body.group.should.have.property("name").eql("Testing Group");
          done();
        });
    });
  });

  describe("get/api/group/:groupId/channel/:channelId", () => {
    it("should GET channel from group", (done) => {
      chai
        .request(app)
        .get(`/api/group/${group_id}/channel/1`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("channel");
          res.body.channel.should.have.property("id").eql(1);
          done();
        });
    });
  });

  describe("post/api/group/:groupId/channel", () => {
    it("should ADD channel to group", (done) => {
      chai
        .request(app)
        .post(`/api/group/${group_id}/channel`)
        .send({
          id: 3,
          name: "add test",
          members: [4, 5],
          messages: [],
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("channel");
          res.body.channel.should.have.property("id").eql(3);
          res.body.channel.should.have.property("name").eql("add test");
          res.body.channel.should.have.property("members").eql([4, 5]);
          res.body.channel.should.have.property("messages").eql([]);
          done();
        });
    });

    it("should not ADD channel to group", (done) => {
      chai
        .request(app)
        .post(`/api/group/${1}/channel`)
        .send({
          id: 3,
          name: "add test",
          members: [4, 5],
          messages: [],
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(false);
          done();
        });
    });
  });

  describe("put/api/group/:groupId/channel/:channelId", () => {
    it("should UPDATE channel from group with channel id 1 from name 'test' to 'testing' and members from [4, 5] to [4, 6]", (done) => {
      chai
        .request(app)
        .put(`/api/group/${group_id}/channel/1`)
        .send({
          channelName: "testing",
          channelMembers: [4, 6],
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("channel");
          res.body.channel.should.have.property("id").eql(1);
          res.body.channel.should.have.property("name").eql("testing");
          res.body.channel.should.have.property("members").eql([4, 6]);
          done();
        });
    });
  });

  describe("delete/api/group/:groupId/channel/:channelId", () => {
    it("should DELETE channel from group with channel id 1", (done) => {
      chai
        .request(app)
        .delete(`/api/group/${group_id}/channel/1`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(true);
          done();
        });
    });

    it("should not DELETE channel from group with channel id -1", (done) => {
      chai
        .request(app)
        .delete(`/api/group/${group_id}/channel/-1`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(false);
          done();
        });
    });
  });

  describe("delete/api/group/:id", () => {
    it("should DELETE group", (done) => {
      chai
        .request(app)
        .delete(`/api/group/${group_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(true);
          done();
        });
    });

    it("should not DELETE group", (done) => {
      chai
        .request(app)
        .delete(`/api/group/${1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eql(false);
          done();
        });
    });
  });
});
