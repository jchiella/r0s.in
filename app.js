const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const validator = require('validator');

const { Link } = require('./models');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use(express.static('public'));

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.get('/:slug', async (req, res, next) => {
  try {
    const { url } = await Link.findOne({ slug: req.params.slug }).orFail();
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

app.get('/api/links/:slug', async (req, res, next) => {
  try {
    const link = await Link.findOne({ slug: req.params.slug }).orFail();
    res.json(link);
  } catch (err) {
    next(err);
  }
});

app.post('/api/links', async (req, res, next) => {
  try {
    if (req.body.slug === undefined) {
      req.body.slug = nanoid(5);
    }

    res
      .status(201)
      .json(await Link.create(req.body));
  } catch (err) {
    next(err);
  } 0
});

app.patch('/api/links/:slug', async (req, res, next) => {
  try {
    res
      .status(200)
      .json(await Link.findOneAndUpdate(
        { slug: req.params.slug },
        { $set: req.body },
        { new: true, runValidators: true },
    ).orFail());
  } catch (err) {
    next(err);
  }
});

app.delete('/api/links/:slug', async (req, res, next) => {
  try {
    res
      .status(200)
      .json(await Link.findOneAndDelete({ slug: req.params.slug}).orFail());
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400);
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    res.status(404);
  } else {
    res.status(500);
  }
  res.json({ error: err.toString() });
});


app.listen(process.env.PORT, () => {
  console.log(`So it begins! Listening on port ${process.env.PORT}`);
});