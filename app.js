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

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('welcome to r0sin!');
});

app.get('/:slug', (req, res) => {
  // Redirect to slug's url
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

app.get('/api/links/:slug', async (req, res) => {
  const link = await Link.findOne({ slug: req.params.slug });
  res.json(link);
});

app.post('/api/links', async (req, res) => {
  if (req.body.slug === undefined) {
    req.body.slug = nanoid(5);
  }
  await Link.create(req.body);
  res.status(201);
  res.send(await Link.findOne({ slug: req.body.slug }));
});

app.patch('/api/links/:slug', async (req, res) => {
  await Link.updateOne({ slug: req.params.slug }, { $set: req.body });
  res.status(200);
  res.send(await Link.findOne({ slug: req.params.slug }));
});

app.delete('/api/links/:slug', async (req, res) => {
  const deletedLink = await Link.findOne({ slug: req.params.slug });
  await Link.deleteOne({ slug: req.params.slug});
  res.status(200);
  res.send(deletedLink);
});


app.listen(process.env.PORT, () => {
  console.log(`So it begins! Listening on port ${process.env.PORT}`);
});