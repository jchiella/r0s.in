const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

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
});

app.get('/:slug', async (req, res) => {
  try {
    const { url } = await Link.findOne({ slug: req.params.slug });
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

/*
GET /links/:slug -> returns specific link information

POST /links 
  -> creates a new randomized slug and returns it as json
  (body is { url: 'https://example.com' })
                        
  -> creates a new specific slug and returns it as json
  (body is { url: '...', slug: 'blabla' })

PATCH /links/:slug -> updates fields in the specific slug
(body is fields to update)

DELETE /links/:slug -> deletes specific slug
*/

app.get('/api/links/:slug', async (req, res, next) => {
  try {
    const link = await Link.findOne({ slug: req.params.slug });
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

    await Link.create(req.body);
    res.status(201);
    res.send(await Link.findOne({ slug: req.body.slug }));
  } catch (err) {
    next(err);
  } 
});

app.patch('/api/links/:slug', async (req, res) => {
  try {
    await Link.updateOne({ slug: req.params.slug }, { $set: req.body });
    res.status(200);
    res.send(await Link.findOne({ slug: req.params.slug }));
  } catch (err) {
    next(err);
  }
});

app.delete('/api/links/:slug', async (req, res) => {
  try {
    const deletedLink = await Link.findOne({ slug: req.params.slug });
    await Link.deleteOne({ slug: req.params.slug});
    res.status(200);
    res.send(deletedLink);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.json({ error: err.toString() });
});


app.listen(process.env.PORT, () => {
  console.log(`So it begins! Listening on port ${process.env.PORT}`);
});