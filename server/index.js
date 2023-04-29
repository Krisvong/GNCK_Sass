// Require the necessary dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");


// Set up middleware
app.use(cors());             // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());     // Enable JSON parsing for request bodies
require('dotenv').config();  // Load environment variables from a .env file if it exists

// Define routes for the application

//Welcome message route
app.get("/", (req, res) => {
    res.send("Welcome to our Todo API, where you can procrastinate in style!");
});

//Route to CREATE a new todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;  // Extract the 'description' field from the request body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);  // Insert a new row into the 'todo' table with the provided description and return the new row

        res.json(newTodo.rows[0]); // Return the new row in JSON format
        console.log(req.body);     // Log the request body to the console
    } catch (err) {
        console.error(err.message);  // If there's an error, log it to the console
    }
});
//Route to get READ all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo"); // Select all rows from the 'todo' table
        res.json(allTodos.rows); // Return the rows in JSON format
    } catch (err) {
        console.error(err.message); // If there's an error, log it to the console
    }
});
//Route to get READ a single todo by ID
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the 'id' parameter from the request URL
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
            id,
        ]); // Select the row with the matching ID from the 'todo' table

        res.json(todo.rows[0]); // Return the row in JSON format
    } catch (err) {
        console.error(err.message); // If there's an error, log it to the console
    }
});

//Route to UPDATE a todo by ID
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the 'id' parameter from the request URL
        const { description } = req.body; // Extract the 'description' field from the request body
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        ); // Update the row with the matching ID in the 'todo' table

        res.json("Todo was updated!"); // Return a success message in JSON format
    } catch (err) {
        console.error(err.message); // If there's an error, log it to the console
    }
});
//Route to DELETE a todo by ID
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params; // get the todo id from the request parameters
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id,
        ]); // delete the todo from the database with the given id

        res.json("Todo was deleted!"); // return a success message
    } catch (err) {
        console.log(err.message); // log any errors to the console
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Making a todo list on port: ${process.env.PORT} with the ALLSTARS Casey, Nick, Gregg, and Kristen`)
});