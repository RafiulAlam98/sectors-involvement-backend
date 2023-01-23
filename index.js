const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlklf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("sectors-involvement-task");
    const sectorCollection = database.collection("sectors");
    const usersCollection = database.collection("users");

    //get all sectors
    app.get("/sectors", async (req, res) => {
      const result = await sectorCollection.find({}).toArray();
      res.send(result);
    });

    // post the users
    app.post("/users", async (req, res) => {
      const user = req.body;

      console.log(user);
      const result = await usersCollection.insertOne(user);

      res.send({ success: true });
    });

    // get all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    //  await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

    app.listen(port, () => {
      console.log(`listening from port ${port}`)
    })