const express = require("express");
const server = express();

const Hobbits = require("./hobbits/hobbits-model.js");



server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoic2FtIiwiaWF0IjoxNTE2MjM5MDIyfQ.xtnOCJt3KTvbOPZFDPnggh4iw5v41rnMGGtmsCczrEY" });
});

server.get("/hobbits", (req, res) => {

  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id",  async (req, res) => {
  const hobbit = await Hobbits.getById(req.params.id);
  res.status(200).json(hobbit);
});

server.post("/hobbits", async (req, res) => {
  if(req.body.name) {
    if(typeof req.body.name != 'string') {
      res.status(401).json({message:'name string değil!'});
    } else {
      const hobbit = await Hobbits.insert(req.body);
      res.status(201).json(hobbit);
    }
  } else {
    res.status(401).json({message:'name bilgisi eksik.'});
  }
});

server.delete("/hobbits/:id", (req, res) => {
  res.end()
});

server.put("/hobbits/:id", (req, res) => {
  res.end()
});

module.exports = server;
