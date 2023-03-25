const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
// let notes = require("./db/db.json");
let newNotes = {
  title,
  text,
  id: uniqid(),
};

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    // let newNotes = {
    //   title,
    //   text,
    //   id: uniqid(),
    // };
    const notesData = JSON.stringify(newNotes);

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }

      const note = JSON.parse(data);
      note.push(newNotes);

      fs.writeFile(`./db/db.json`, JSON.stringify(note), (err) =>
        err
          ? console.error(err)
          : console.log(
              `Notes for ${newNotes.title} has been written to JSON file`
            )
      );
      const response = {
        status: "success",
        body: newNotes,
      };
      console.log(response);
      res.status(200).json(response);
    });
  } else {
    res.json(`Please include title`);
  }
  console.log(req.body);
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }

    let notes = JSON.parse(data);

    notes = notes.filter((note) => note.id !== req.params.id);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete note" });
      }
      console.log(
        `Note with ID ${req.params.id} has been deleted from JSON file`
      );

      const response = {
        status: "success",
        message: `Note with ID ${req.params.id} has been deleted`,
      };
      console.log(response);
      res.status(200).json(response);
    });
  });
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
