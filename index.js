const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Environments variable
const port = process.env.PORT || 5000;
const userId = process.env.DB_USERID;
const pass = process.env.DB_PASSWORD;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mellifluous-granita-1dd017.netlify.app",
    ],
    credentials: "true",
  })
);
app.use(express.json());

app.get("/", (reg, res) => {
  res.send("Hello Server is started");
});
app.listen(port, () => {
  console.log(`App in listening in ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${userId}:${pass}@cluster0.myyqyo8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const database = client.db("taskManager");
    const taskCollection = database.collection("task");

    app.get("/allTask", async (req, res) => {
      console.log("called packages");
      const taskInfo = taskCollection.find();
      const result = await taskInfo.toArray();
      res.send(result);
    });

    // POST APIS
    app.post("/addTask", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });

    //PUT API
    app.put("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      console.log(updatedData);
      const query = { _id: new ObjectId(id) };
      const insertOptional = { upsert: true };
      const updatedTask = {
        $set: {
          title: updatedData.title,
          deadline: updatedData.deadline,
          priority: updatedData.priority,
          description: updatedData.description,
          description: updatedData.description,
          status: updatedData.status,
        },
      };
      const result = await taskCollection.updateOne(
        query,
        updatedTask,
        insertOptional
      );
      res.send(result);
    });

    //Delete API

    app.delete("/deleteTask/:id", async (req, res) => {
      const mealId = req.params.id;
      const query = { _id: new ObjectId(mealId) };
      console.log(query);
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
