const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Send JSON response with formatted books data
//   return res.send(JSON.stringify({books: books, message: "Book list retrieved successfully"}, null, 4));
// });

//GET books using Promise
public_users.get('/', (req, res) => {
    //Send JSON response with formatted books data
    new Promise((resolve, reject) => {
        //  const data = {message: "Success", status: 200};
        resolve(books);
    })
        .then((books) => res.send((JSON.stringify({
            books: books,
            message: "Books list retrieved successfully with Promise"
        }, null, 4))))

});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     //Write your code here
//     //send JSON response with book details
//     const isbn = req.params.isbn;
//     if (books[isbn]) {
//         return res.send(JSON.stringify(books[isbn], null, 4));
//     }
//     return res.status(404).json({message: "Book not found"});
// });

public_users.get('/isbn/:isbn', (req, res) => {

        const isbn = req.params.isbn;
        new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books); // Book exists, go to .then()
            } else {
                reject("Book not found"); // Book is missing, go to .catch()
            }
        })
            .then((book) => res.send((JSON.stringify(book[isbn], null, 4))))
            .catch(err => {
                res.status(500).json({message: "Book not found"});
            });
    }
)

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     const author = req.params.author;
//
//     let filtered_books = Object.values(books).filter(book => book.author === author);
//     if (filtered_books.length > 0) {
//         return res.send(JSON.stringify(filtered_books, null, 4));
//     }
//     return res.status(404).json({message: "No author with that name"});
// });

public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    let filtered_books = Object.values(books).filter(book => book.author === author);

    new Promise((resolve, reject) => {

        if (filtered_books.length > 0) {
            resolve(filtered_books)
        } else {
            reject("No books by author")
        }
    })
        .then((filtered_books) => res.send((JSON.stringify(filtered_books, null, 4))))
        .catch((error) => res.status(404).json({message: error}))
});


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//
//     const title = req.params.title;
//     let filtered_books = Object.values(books).filter(book => book.title === title);
//     if (filtered_books.length > 0) {
//         return res.send(JSON.stringify(filtered_books, null, 4));
//     }
//     return res.status(404).json({message: "No title with that name"});
// });


public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    let filtered_books = Object.values(books).filter(book => book.title === title);

    new Promise((resolve, reject) => {

        if (filtered_books.length > 0) {
            resolve(filtered_books)
        } else {
            reject("No books by that title")
        }
    })

        .then((filtered_books) => res.send((JSON.stringify(filtered_books, null, 4))))
        .catch((error) => res.status(404).json({message: error}))
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
