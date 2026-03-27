const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here

    const isbn = req.params.isbn;
    const reviewContent = req.query.review; // Review text from URL

    // Check if session exists and has username
    if (!req.session || !req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({message: "User not logged in"});
    }

    const username = req.session.authorization.username; // User from session


    if (books[isbn]) {
        let book = books[isbn];

        // Add or modify: Use username as key to update specific user review
        book.reviews[username] = reviewContent;

        return res.status(200).json({
            message: "Review successfully posted/updated",
            reviews: book.reviews
        });
    }

    return res.status(404).json({message: "ISBN not found"});

    //return res.status(300).json({message: "Yet to be implemented"});
});

//Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here

    const isbn = req.params.isbn;
    //const reviewContent = req.query.review; // Review text from URL
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({message: "ISBN not found."});
    }

    // Check if session exists and has username
    if (!req.session || !req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({message: "User not logged in"});
    }

    const username = req.session.authorization.username; // User from session

    if (!book.reviews || !(username in book.reviews)) {
        return res.status(403).json({
            message: "You can only delete your own review"
        });
    }

    delete (book.reviews[username])

    return res.status(200).json({message: "Review deleted successfully", reviews: book.reviews})

    // return res.status(404).json({ message: "ISBN not found" });

    // return res.status(300).json({message: "Yet to be implemented"});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
