# Liquid Mongo Data Loader

A NPM package to dynamically load MongoDB data into Liquid templates.

## Installation

```bash
npm install liquid-mongo-data-loader
```

## Usage

Here's an example of how to use this package:

```javascript	
const express = require('express');
const mongoose = require('mongoose');
const { Liquid } = require('liquidjs');
const dotenv = require('dotenv').config();
const path = require('path');

// Load liquid-mongo-data-loader
const dataLoader = require('liquid-mongoose-data-loader');

//Routes
const renderPage = require('./routes/renderPage');

// Initialize express
const app = express();

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    console.log('http://localhost:5000');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Load Liquid engine
const engine = new Liquid({
    root: './views',
    extname: '.liquid',
    dynamicPartials: true,
});

// Load models and custom Liquid tags
DataLoader(engine, {
  modelsPath: './models'
});

app.engine('liquid', engine.express()); // register liquid engine
app.set('views', './views');    // specify the views directory
app.set('view engine', 'liquid');   // register the template engine

// Routes
app.use('/', renderPage);
```

## API

### `liquidMongoDataLoader(engine, options)`

Loads models and custom Liquid tags.

## Parameters
* `engine` : Instance of LiquidJS.
* `options` : Object containing the path to the models.

## Example

```javascript
dataLoader(engine, {
  modelsPath: './models'
});
```
## Model Naming
The module expects the model names to be in lowercase when referenced in the templates. For example, if you have a model named Book, you should reference it as book in your Liquid template.

### Example
Assuming you have a `Book` model defined in models/Book.js

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    year: Number
});

module.exports = mongoose.model('Book', bookSchema);
```
In your Liquid template, you would reference this model as book:

```liquid
{% load model: 'book', key: 'all_books' %}
```
This is because the module converts model names to lowercase to match Mongoose's default behavior of naming collections in lowercase.

## Tag Parameters

Examples :
```liquid
{% load model: 'book', key: 'all_books' %}
{% load model: 'book', item: '1984', findOne: 'title', key: 'specific_book' %}
{% load model: 'book', item: 'George Orwell', findOne: 'author', key: 'author_books' %}
```

### `model`
Specifies the name of the Mongoose model to use. The module converts the model name to lowercase to match Mongoose's default behavior. For example, if you have a model named `Book`, you should reference it as `book` in your Liquid template.

### `item`
Specifies the value to search for in the model. The module uses this value to search for a specific item in the model.

### `findOne`
Specifies the field to search for in the model. The module uses this field to search for items by a specific field. (in this case, the title or author field)

### `key`
Specifies the key to use when storing the results of the query. The key is used to reference the results in the template.

## Template example
### Rendering a template

Given a template index.liquid:

```liquid

{% load model: 'book', key: 'all_books' %}
{% load model: 'book', item: '1984', findOne: 'title', key: 'specific_book' %}
{% load model: 'book', item: 'George Orwell', findOne: 'author', key: 'author_books' %}


<section>
        <h2>All Books</h2>
        <ul>
            {% for book in all_books %}
            <li>{{ book.title }} by {{ book.author }}: {{ book.year }}</li>
            {% endfor %}
        </ul>
    </section>
    <section>
        <h2>Specific Book</h2>
    <ul>
        {% for book in specific_book %}
            {% if book %}
                <li>{{ book.title }} by {{ book.author }}: {{ book.year }}</li>
            {% else %}
                <li>No book found.</li>
            {% endif %}
        {% endfor %}
    </ul>
    </section>
    <section>
        <h2>Books by George Orwell</h2>
        <ul>
            {% for book in author_books %}
                {% if book %}
                    <li>{{ book.title }} by {{ book.author }}: {{ book.year }}</li>
                    {% else %}
                    <li>No books by George Orwell found.</li>
                {% endif %}
            {% endfor %}
        </ul>
    </section>
    <section>
        <h2>Books from 1949</h2>
        <ul>
            {% if book_year and book_year.size > 0 %}
                {% for book in book_year %}
                    <li>{{ book.title }} by {{ book.author }}: {{ book.year }}</li>
                {% else %}
                    <li>No book from 1949 found.</li>
                {% endfor %}
            {% else %}
                <li>No book from 1949 found.</li>
            {% endif %}
         </ul>
    </section>
```