const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('welcome to r0sin!');
});

app.get('/:slug', (req, res) => {
  // Redirect to slug's url
});

/*
Url object:

{
  slug: 'xyzab',
  link: 'https://example.com',
  createdAt, updatedAt, _id,
}

GET /urls/:slug -> returns specific link information

POST /urls 
  -> creates a new randomized slug and returns it as json
  (body is { link: 'https://example.com' })
                        
  -> creates a new specific slug and returns it as json
  (body is { link: '...', slug: 'blabla' })

PATCH /urls/:slug -> updates fields in the specific slug
(body is fields to update)

DELETE /urls/:slug -> deletes specific slug
*/

app.get('/api/urls/:slug', (req, res) => {

});

app.post('/api/urls', (req, res) => {

});

app.patch('/api/urls/:slug', (req, res) => {

});

app.delete('/api/urls/:slug', (req, res) => {

});


app.listen(process.env.PORT, () => {
  console.log(`So it begins! Listening on port ${process.env.PORT}`);
});