const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const app = express();

const port = 6800;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//@host @Port @Database
// mongoose
//   .connect("mongodb://localhost:27017/vidly")
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch(err => {
//     console.error("Could not connect to MongoDB", err);
//   });

const Schema = mongoose.Schema;

/* Genre -> Begin */

/* Schemas */
const genreSchema = new Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  }
});

const genreJoiSchema = {
  name: Joi.string()
    .min(5)
    .max(5)
    .required()
};

/* Models */
//@Genre -> Collection Name (Table)
const GenreModel = new mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  return Joi.validate(genre, genreJoiSchema);
}

/* CRUD Methods @handleException -> Dependency */
/* #Testing - start */
async function createGenre(name) {
  const genre = new GenreModel({
    name
  });

  try {
    const result = await genre.save();
    console.log(result);
  } catch (errors) {
    for (err in errors) {
      console.log(errors[err]);
    }
  }
}

/* #Comment
createGenre("Action");
createGenre("Comedy");
createGenre("Crime");
createGenre("Horror");
createGenre("Romance");
createGenre("Science fiction");
createGenre("Thriller");
*/

/* #Testing - end */

/* Genre -> End */

/* Customer -> Begin */

/* Routes */
app.get("/customer/:id", function(req, res) {
  getCustomer(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send("The customer with the given ID was not found.");
      else res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/customer", function(req, res) {
  getCustomers()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/customer", function(req, res) {
  const { error } = validateCustomer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  createCustomer(req.body)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/customer/:id", function(req, res) {
  const { error } = validateCustomer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  req.body.id = req.params.id;

  updateCustomer(req.body)
    .then(data => {
      if (!data)
        res.status(404).send("The customer with the given ID was not found.");
      else res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete("/customer/:id", function(req, res) {
  deleteCustomer(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send("The customer with the given ID was not found.");
      else res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

/* Schemas */
const customerSchema = Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
    required: true
  }
});

const customerJoiSchema = {
  name: Joi.string()
    .min(5)
    .max(255)
    .required(),
  isGold: Joi.boolean(),
  phone: Joi.string()
    .min(10)
    .max(10)
    .required()
};

/* Models */
//@Customer -> Collection Name (Table)
const CustomerModel = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  return Joi.validate(customer, customerJoiSchema);
}

/* CRUD Methods @handleException -> Dependency */
/* #Testing - start */
async function createCustomer({ name, isGold, phone }) {
  const customer = new CustomerModel({
    name,
    isGold,
    phone
  });

  let result;
  try {
    result = await customer.save();
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function getCustomers() {
  let result;
  try {
    result = await CustomerModel.find();
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function getCustomer(id) {
  let result;
  try {
    result = await CustomerModel.find({ _id: id });
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function updateCustomer({ id, name, isGold, phone }) {
  let result;
  try {
    result = await CustomerModel.findByIdAndUpdate(
      id,
      {
        name,
        isGold,
        phone
      },
      { new: true }
    ); //set new to true to get latest updated document
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function deleteCustomer(id) {
  let result;
  try {
    result = await CustomerModel.findByIdAndRemove(id);
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

/* #Comment
createCustomer({name: "sudeep", isGold: true, phone: "9876543212"} );
createCustomer({name: "indraj", isGold: false, phone: "9584672135"} );
*/

/* #Testing - end */

/* Customer -> End */

/* Movie -> Begin */

/* Routes */
app.get("/movie/:id", function(req, res) {
  getMovie(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send("The movie with the given ID was not found.");
      else res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/movie", function(req, res) {
  getMovies()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/movie", function(req, res) {
  const { error } = validateMovie(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  createMovie(req.body)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/movie/:id", function(req, res) {
  const { error } = validateMovie(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  req.body.id = req.params.id;

  updateMovie(req.body)
    .then(data => {
      if (data) {
        if (data.error) res.status(404).send(data.error);
        else res.status(200).send(data);
      } else if (!data)
        res.status(404).send("The movie with the given ID was not found.");
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete("/movie/:id", function(req, res) {
  deleteMovie(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send("The movie with the given ID was not found.");
      else res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

/* Schemas */
const movieSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }
});

const movieJoiSchema = {
  title: Joi.string()
    .min(5)
    .max(255)
    .required(),
  genreId: Joi.string().required(),
  numberInStock: Joi.number()
    .integer()
    .min(0)
    .max(255)
    .required(),
  dailyRentalRate: Joi.number()
    .integer()
    .min(0)
    .max(255)
    .required()
};

/* Models */
//@Movie -> Collection Name (Table)
const MovieModel = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  return Joi.validate(movie, movieJoiSchema);
}

/* CRUD Methods @handleException -> Dependency */
/* #Testing - start */

//@GenreModel -> Model -> Dependency
async function createMovie({ title, genreId, numberInStock, dailyRentalRate }) {
  let result;

  try {
    const genre = await GenreModel.findById(genreId);

    if (!genre) return "Invalid Genre";

    const movie = new MovieModel({
      title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock,
      dailyRentalRate
    });

    result = await movie.save();
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function getMovies() {
  let result;
  try {
    result = await MovieModel.find();
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function getMovie(id) {
  let result;
  try {
    result = await MovieModel.find({ _id: id });
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function updateMovie({
  id,
  title,
  genreId,
  numberInStock,
  dailyRentalRate
}) {
  let result;
  try {
    const genre = await GenreModel.findById(genreId);

    if (!genre) return { error: "Invalid Genre" };

    result = await MovieModel.findByIdAndUpdate(
      id,
      {
        title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock,
        dailyRentalRate
      },
      { new: true }
    ); //set new to true to get latest updated document
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

async function deleteMovie(id) {
  let result;
  try {
    result = await MovieModel.findByIdAndRemove(id);
  } catch (ex) {
    result = handleException(ex);
  }

  return result;
}

/* #Comment
createMovie({title: "Mission Impossible", genreId: "5c445755031cc12c8474adb0", numberInStock: 5, dailyRentalRate: 10});
createMovie({title: "Interstellar", genreId: "5c445755031cc12c8474adb5", numberInStock: 15, dailyRentalRate: 20});
*/

/* #Testing - end */

/* Movie -> End */

/* Utility */
function handleException(ex) {
  let result = [];

  for (field in ex.errors) {
    result.push(ex.errors[field].message);
  }

  return result.join(" -> ");
}

/* $Move to main */
process.on("SIGINT", async function() {
  try {
    await mongoose.connection.close();
    console.log("Disconnected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
