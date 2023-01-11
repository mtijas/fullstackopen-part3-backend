const express = require("express");
const morgan = require("morgan");

const PORT = 3001;

const app = express();
app.use(express.json());

morgan.token("postdata", (request, response) => { 
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :postdata"));
//app.use(morgan("tiny"));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/info", (request, response) => {
  const timestamp = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${timestamp}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    response.status(404).end();
    return;
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({ error: "name missing" });
  }
  if (!request.body.number) {
    return response.status(400).json({ error: "number missing" });
  }
  if (persons.find((person) => person.name.toLowerCase() === request.body.name.toLowerCase())) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number
  }

  persons = persons.concat(person);
  response.json(person);
});

function generateId() {
  return Math.floor(Math.random() * 999999999) + 1;
}

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
