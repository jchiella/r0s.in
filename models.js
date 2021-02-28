const mongoose = require('mongoose');
const validator = require('validator');

const linkSchema = new mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    validate: [
      { validator: validator.isSlug, msg: 'Slug is not valid' },
      { validator: (s) => validator.isLength(s, 1, 20), msg: 'Slug must be no longer than 20 characters' }
    ],
  },
  url: {
    type: String,
    required: true,
    validate: [
      { validator: validator.isURL, msg: 'URL is not valid' },
    ],
  },
}, { timestamps: true });

const Link = mongoose.model('Link', linkSchema);

module.exports = {
  Link,
};