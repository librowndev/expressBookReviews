const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Added back per user request

public_users.post("/register", (req, res) => {
    const {username, password} = req.body;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// // Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   return res.send(JSON.stringify({books: books, message: "Book list retrieved successfully"}, null, 4));
// });

// Internal route to return raw books data for axios to call (to avoid recursion)

public_users.get('/allbooks', (req, res) => {
    res.status(200).json(books);
});

// Task 10: Get the book list available in the shop using Axios with async callback (then)
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/allbooks')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book list", error: error.message });
        });
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = req.params.isbn;
//     if (books[isbn]) {
//         return res.send(JSON.stringify(books[isbn], null, 4));
//     }
//     return res.status(404).json({message: "Book not found"});
// });

// Internal route for ISBN to avoid recursion
public_users.get('/internal/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    if (books[isbn]) {
        res.status(200).json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 11: Get book details based on ISBN using Axios and Promises (then)
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    axios.get(`http://localhost:5000/internal/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: error.response ? error.response.data.message : error.message });
        });
});


// Internal route for Author to avoid recursion
public_users.get('/internal/author/:author', (req, res) => {
    const { author } = req.params;
    let filtered_books = Object.values(books).filter(book => book.author === author);
    if (filtered_books.length > 0) {
        res.status(200).json(filtered_books);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 12: Get book details based on author using Axios and Async/Await
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/internal/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: error.response ? error.response.data.message : error.message });
    }
});



// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     let filtered_books = Object.values(books).filter(book => book.title === title);
//     if (filtered_books.length > 0) {
//         return res.send(JSON.stringify(filtered_books, null, 4));
//     }
//     return res.status(404).json({message: "No title with that name"});
// });

// Internal route for Title to avoid recursion
public_users.get('/internal/title/:title', (req, res) => {
    const { title } = req.params;
    let filtered_books = Object.values(books).filter(book => book.title === title);
    if (filtered_books.length > 0) {
        res.status(200).json(filtered_books);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 13: Get all books based on title using Axios and Async/Await
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/internal/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: error.response ? error.response.data.message : error.message });
    }
});

//  Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        if (Object.keys(book.reviews).length > 0) {
            return res.send(JSON.stringify(book.reviews, null, 4));
        } else {
            return res.status(404).json({message: "No reviews for this book"});
        }
        return res.send(JSON.stringify(book.reviews, null, 4));
    }
    return res.status(404).json({message: "Book not found"});
});


module.exports.general = public_users;
