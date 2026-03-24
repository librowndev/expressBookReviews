const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

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
public_users.get('/',function (req, res) {
  //Send JSON response with formatted books data
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify({books: books, message: "Book list retrieved successfully"}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //send JSON response with book details
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  let filtered_books = Object.values(books).filter(book => book.author === author);
  if (filtered_books.length > 0) {

   res.send(JSON.stringify(filtered_books, null, 4));
  }
  return res.status(300).json({message: "No author with that name"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title;
  let filtered_books = Object.values(books).filter(book => book.title === title);
  if (filtered_books.length > 0) {

    res.send(JSON.stringify(filtered_books, null, 4));
  }
  return res.status(300).json({message: "No title with that name"});

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //let filtered_books = Object.values(books).filter(book => book.isbn === isbn);
  let reviews = books[isbn].reviews
  if (reviews.length > 0) {
    return res.send((JSON.stringify(reviews)))
  }
  return res.status(300).json({message: "No reviews for this book"});

 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
