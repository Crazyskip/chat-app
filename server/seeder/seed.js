const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const users = [
  { username: "super", email: "super@gmail.com", role: "super admin" },
  { username: "admin", email: "group@gmail.com", role: "group admin" },
  { username: "user3", email: "user3@gmail.com", role: "member" },
  { username: "user4", email: "user4@gmail.com", role: "member" },
  { username: "user5", email: "user5@gmail.com", role: "member" },
];

const groups = [
  {
    name: "Group 1",
    assistants: [3],
    members: [4, 5],
    channels: [
      {
        id: 1,
        name: "general",
        members: [4, 5],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
        ],
      },
      {
        id: 2,
        name: "secret",
        members: [4],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
        ],
      },
    ],
  },
  {
    name: "Group 2",
    assistants: [4],
    members: [3, 5, 6],
    channels: [
      {
        id: 1,
        name: "general",
        members: [4, 5, 6],
        messages: [
          { user: 1, message: "Welcome to general" },
          { user: 1, message: "Hello from super admin" },
          { user: 3, message: "Hello super admin" },
        ],
      },
      {
        id: 2,
        name: "assignment",
        members: [4, 6],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
          { user: 6, message: "I am user 6" },
        ],
      },
    ],
  },
];

async function seedUsers(db) {
  await db.collection("users").drop();
  const usersCollection = db.collection("users");
  await usersCollection.insertMany(users);

  console.log("Seeded Users");
}

async function seedGroups(db) {
  await db.collection("groups").drop();
  const groupsCollection = db.collection("groups");
  await groupsCollection.insertMany(groups);

  console.log("Seeded Groups");
}

async function seed() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("chat");

  await seedUsers(db);
  await seedGroups(db);

  client.close();
}

seed();
