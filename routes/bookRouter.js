const express = require('express');

function routes(Book) {
    //routing handler instance
    const bookRouter = express.Router();

    //Handles get and post request of books
    bookRouter.route('/books')
        //If post request is called to api, take the request body and save it to the database (create new book object using request body)
        .post((req, res) => {
            const book = new Book(req.body);

            book.save();
            return res.json(book); //return the book so user can see what was inputted
        })

        //If get request is called send back what the query asked for
        .get((req, res) => {
            const query = {}; //instance of query
            
            //If genre parameter is called, set query to the requested genre for filtering later
            if(req.query.genre) {
                query.genre = req.query.genre; //NOTE: query represents URL stuff while params represents stuff given in raw input
            }

            //In all the books, return user had requested for (determined by query)
            Book.find(query, (err, books) => {
                if(err) {
                    return res.send(err); //error handling
                } 
                return res.status(201).json(books); //return success message when books are successfully outputted
            });
        });

    //Middleware for requests via singular id
    bookRouter.use('/books/:bookId', (req, res, next) => {
        //find the book by ID
        Book.findById(req.params.bookId, (err, book) => {
            if (err) {
            return res.send(err); //if book doesn't exist, send back error
            }
            if(book) {
                req.book = book; //if book does exist, save it to the request's book
                return next(); //move forward in code
            }

            return res.sendStatus(404); //error handling
        });
    });

    //handling for requests that send after middleware
    bookRouter.route('/books/:bookId')
        //get request for book
        .get((req, res) => res.json(req.book))

        //if put request is sent, destructure book parameter
        .put((req, res) => {
            const { book } = req;

            //update all parts of book with the new request
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;

            //replace the new book
            req.book.save((err) => {
                if(err) {
                    return res.send(err); //error handling
                }
                return res.json(book);
            });
        })

        //patch request (put but only one line)
        .patch((req, res) => {
            const { book } = req; //destructure book parameter
            
            //delete weird id from request
            if (req.body._id) {
                delete req.body._id;
            }

            //save the key value pair and save the book by key to the new value
            Object.entries(req.body).forEach((item) => {
                const key = item[0];
                const value = item[1];
                book[key] = value;
            });

            //save results
            req.book.save((err) => {
                if(err) {
                    return res.send(err); //error handling
                }
                return res.json(book);
            });
        })

        //delete request
        .delete((req, res) => {
            //delete book
            req.book.remove((err) => {
                if(err) {
                    return res.send(err); //error handling
                }

                return res.sendStatus(204);
            })
        })

    return bookRouter; //return all routes for use
}

//exports
module.exports = routes;