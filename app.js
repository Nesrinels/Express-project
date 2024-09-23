// Importing packages
const express = require("express");
const { connectToDb, getDb } = require("./db/db");
const { ObjectId } = require('mongodb');

const PORT = 8080;
const app = express(); // Express instance

// Connect to the database
let database = null;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });
    database = getDb(); // Initialize the database connection
  } else {
    console.log("Failed to connect to DB");
  }
});

// Middleware to parse incoming JSON data
app.use(express.json());

// Route to get client list
app.get("/client", (req, res) => {
  if (!database) {
    return res.status(500).json({ error: "Database not initialized" });
  }

  database.collection("client")
    .find()
    .sort({ name: 1 })  
    .toArray()
    .then((clients) => {  
      res.status(200).json(clients);  
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Sorry, the client list could not be retrieved" });
    });
});

// Route to add a new client
app.post("/client", (req, res) => {
  const newClient = req.body;  // Get the client data from the request body
  
  // Insert the new client into the "client" collection
  database.collection("client")
    .insertOne(newClient)
    .then((result) => {
      res.status(201).json({ _id: result.insertedId, ...newClient });  // Send the inserted document back with its MongoDB _id
    })
    .catch((err) => {
      console.error("Error inserting client:", err);
      res.status(500).json({ error: "Failed to add client" });
    });
});

// Route to get a specific client by custom id
app.get("/client/:id", (req, res) => {
  const id = parseInt(req.params.id);  // Convert the id from the URL to an integer

  database.collection("client") // Access the client collection
    .findOne({ id: id })  // Query the client by custom `id` field
    .then((client) => {
      if (client) {
        res.status(200).json(client);  // Send client data
      } else {
        res.status(404).json({ msg: "Client not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ msg: "Sorry, an error occurred while fetching the client" });
    });
});

// Route to get employees list
app.get("/employees", (req, res) => {
  if (!database) {
    return res.status(500).json({ error: "Database not initialized" });
  }

  database.collection("employees")
    .find()
    .sort({ salary: 1 })  
    .toArray()
    .then((employees) => {  
      res.status(200).json(employees);  
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Sorry, the employee list could not be retrieved" });
    });
});

// Route to get a specific employee by custom id
app.get("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);  // Convert the id from the URL to an integer

  database.collection("employees") // Access the employees collection
    .findOne({ id: id })  // Query the employee by custom `id` field
    .then((employee) => {
      if (employee) {
        res.status(200).json(employee);  // Send employee data
      } else {
        res.status(404).json({ msg: "Employee not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ msg: "Sorry, an error occurred while fetching the employee" });
    });
});

//book/id update(patch) route
app.put("/client/:id", (req, res) => {
  const update = req.body;

  if (ObjectId.isValid(req.params.id)) {
    const id = new ObjectId(req.params.id);
    database.collection("client")
      .updateOne({ _id: id }, { $set: update })
      .then((result) => {

        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't update document" });
      });
  }
});

//book/:id delete route
app.delete("/client/:id", (req, res) => {
  const id = new ObjectId(req.params.id);
  database.collection("client")
    .deleteOne({ _id: id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ msg: "Sorry, this book doesn't exist" });
    });
});
