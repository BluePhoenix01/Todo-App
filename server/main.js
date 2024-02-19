import express from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = 6969;
const db = new sqlite3.Database(process.env.DATABASE_URL);

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, text TEXT, completed INTEGER)"
  );
});

app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    }
    res.json(rows.map((row) => ({ id: row.id, text: row.text, completed: !!row.completed })));
  });
});

app.post("/todos", (req, res) => {
  console.log(req.body);
  const { text, completed } = req.body;
  if (!text) {
    res.status(400).send("Text is required");
  }
  if (typeof completed !== "boolean") {
    res.status(400).send("Completed must be a boolean");
  }
  db.run(
    "INSERT INTO todos (text, completed) VALUES (?, ?)",
    [text, completed],
    (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
      db.get("SELECT LAST_INSERT_ROWID() AS id", (err, row) => {
        if (err) {
          res.status(500).send(err.message);
        }
        res.json({id: row.id, text, completed });
      })
    }
  );
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  console.log(req.body);
  if (!text) {
    res.status(400).send("Text is required");
  }
  if (typeof completed !== "boolean") {
    res.status(400).send("Completed must be a boolean");
  }
  db.run(
    "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
    [text, completed, id],
    (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
      res.json({ text, completed });
    }
  )

})

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    }
    res.sendStatus(200);
    console.log("deleted");
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
