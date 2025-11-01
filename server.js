// import booksData from '../Amana-Bookstore-Express-API/data/books.json' with { type: 'json' };
// import reviewsData from './data/reviews.json' with { type: 'json' };
// import express from 'express';

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Extract the books array from the imported data
// // If your JSON is { "books": [...] }, use: const books = booksData.books;
// // If your JSON is just [...], use: const books = booksData;
// const books = Array.isArray(booksData) ? booksData : booksData.books;
// const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews;

// // Define port
// const PORT = process.env.PORT || 3000;

// // Test route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Welcome to Amana Bookstore API',
//     endpoints: {
//       allBooks: '/api/books',
//       topRated: '/api/books/top-rated',
//       featured: '/api/books/tag',
//       bookById: '/api/books/:id',
//       booksByDate: '/api/books/date?start=YYYY-MM-DD&end=YYYY-MM-DD'
//     }
//   });
// });

// // GET route to retrieve all books
// app.get('/api/books', (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       count: books.length,
//       data: books
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving books',
//       error: error.message
//     });
//   }
// });

// // GET route by date (MUST come before /:id route)
// app.get('/api/books/date', (req, res) => {
//   try {
//     const start_date = new Date(req.query.start);
//     const end_date = new Date(req.query.end);
//     console.log('Filtering books from', start_date, 'to', end_date);
    
//     // Validate dates
//     if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid date format. Use YYYY-MM-DD'
//       });
//     }
    
//     const filteredBooks = books.filter(book => {
//       const pubDate = new Date(book.datePublished);
//       console.log('Checking book:', book.title, 'published on', pubDate);
//       return pubDate >= start_date && pubDate <= end_date;
//     });

//     res.status(200).json({
//       success: true,
//       count: filteredBooks.length,
//       data: filteredBooks
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error filtering books by date',
//       error: error.message
//     });
//   }
// });

// app.get('/api/books/top-rated', (req, res) => {
//   try {
//     const topRatedBooks = books.map
//     (book => {const score = book.rating * book.reviewCount; return { ...book, score }; });
//     topRatedBooks.sort((a, b) => b.score - a.score); // Sort in descending order
//     console.log('Top rated books calculated');
//     res.status(200).json({
//       success: true,
//       count: 10,
//       data: topRatedBooks.slice(0, 10)
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving top-rated books',
//       error: error.message
//     });
//   }
// });

// app.get('/api/books/tag', (req, res) => {
//   try {
//     const bookFeaturedTag = books.filter(book => book.featured === true);
//     res.status(200).json({
//       success: true,
//       data: bookFeaturedTag
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving featured books',
//       error: error.message
//     });
//   }
// });


// app.get('/api/reviews/:id', (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const review = reviews.filter(r => r.bookId === bookId || r.bookId === parseInt(bookId));
//     if (review) {
//       res.status(200).json({
//         success: true,
//         data: review
//       });
//     } else {
//       res.status(404).json({
//         success: false, 
//         message: `Review for book with id ${bookId} not found`
//       });
//     }
//   } catch (error) {
//     res.status(500).json({        
//       success: false,
//       message: 'Error retrieving review',
//       error: error.message
//     });
//   }
// });


    
// // GET route by ID
// app.get('/api/books/:id', (req, res) => {
//   try {
//     const bookId = req.params.id;
    
//     // Try both string and number comparison
//     const book = books.find(b => b.id === bookId || b.id === parseInt(bookId));

//     if (book) {
//       res.status(200).json({
//         success: true,
//         data: book
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: `Book with id ${bookId} not found`
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving book',
//       error: error.message
//     });
//   }
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Visit http://localhost:${PORT} to test`);
// });


import booksData from '../Amana-Bookstore-Express-API/data/books.json' with { type: 'json' };
import reviewsData from './data/reviews.json' with { type: 'json' };
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Extract the books array from the imported data
let books = Array.isArray(booksData) ? booksData : booksData.books;
let reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews;

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(process.cwd(), 'logging/log.txt'), { flags: 'a' });

// Morgan middleware for logging
app.use(morgan('combined', { stream: logStream }));
app.use(morgan('dev')); // Also log to console

// Authentication middleware (Bonus Challenge)
const authenticateUser = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // List of valid API keys (in production, store these securely!)
  const validApiKeys = ['your-secret-api-key-123', 'admin-key-456'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required. Please include x-api-key header.'
    });
  }
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key. Access denied.'
    });
  }
  
  // User is authenticated, proceed to next middleware/route
  next();
};

// Define port
const PORT = process.env.PORT || 3000;

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Amana Bookstore API',
    endpoints: {
      allBooks: '/api/books',
      topRated: '/api/books/top-rated',
      featured: '/api/books/tag',
      bookById: '/api/books/:id',
      booksByDate: '/api/books/date?start=YYYY-MM-DD&end=YYYY-MM-DD',
      bookReviews: '/api/reviews/:id',
      addBook: 'POST /api/books',
      addReview: 'POST /api/reviews'
    }
  });
});

// ==================== GET ROUTES ====================

// GET route to retrieve all books
app.get('/api/books', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving books',
      error: error.message
    });
  }
});

// GET route by date
app.get('/api/books/date', (req, res) => {
  try {
    const start_date = new Date(req.query.start);
    const end_date = new Date(req.query.end);
    
    if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    const filteredBooks = books.filter(book => {
      const pubDate = new Date(book.datePublished);
      return pubDate >= start_date && pubDate <= end_date;
    });

    res.status(200).json({
      success: true,
      count: filteredBooks.length,
      data: filteredBooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering books by date',
      error: error.message
    });
  }
});

// GET route for top-rated books
app.get('/api/books/top-rated', (req, res) => {
  try {
    const topRatedBooks = books.map(book => {
      const score = book.rating * book.reviewCount;
      return { ...book, score };
    });
    topRatedBooks.sort((a, b) => b.score - a.score);
    
    res.status(200).json({
      success: true,
      count: 10,
      data: topRatedBooks.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving top-rated books',
      error: error.message
    });
  }
});

// GET route for featured books
app.get('/api/books/tag', (req, res) => {
  try {
    const featuredBooks = books.filter(book => book.featured === true);
    
    if (featuredBooks.length > 0) {
      res.status(200).json({
        success: true,
        count: featuredBooks.length,
        data: featuredBooks
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No featured books found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving featured books',
      error: error.message
    });
  }
});

// GET route for book reviews by book ID
app.get('/api/reviews/:id', (req, res) => {
  try {
    const bookId = req.params.id;
    const bookReviews = reviews.filter(r => r.bookId === bookId.toString());
    
    if (bookReviews.length > 0) {
      res.status(200).json({
        success: true,
        count: bookReviews.length,
        data: bookReviews
      });
    } else {
      res.status(404).json({
        success: false, 
        message: `No reviews found for book with id ${bookId}`
      });
    }
  } catch (error) {
    res.status(500).json({        
      success: false,
      message: 'Error retrieving reviews',
      error: error.message
    });
  }
});

// GET route by ID (MUST be last among /api/books routes)
app.get('/api/books/:id', (req, res) => {
  try {
    const bookId = req.params.id;
    const book = books.find(b => b.id === bookId || b.id === parseInt(bookId));

    if (book) {
      res.status(200).json({
        success: true,
        data: book
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Book with id ${bookId} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving book',
      error: error.message
    });
  }
});

// ==================== POST ROUTES ====================

// POST route to add a new book (with authentication)
app.post('/api/books', authenticateUser, (req, res) => {
  try {
    const { title, author, isbn, price, rating, reviewCount, datePublished, featured } = req.body;
    
    // Validate required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, author, and isbn are required'
      });
    }
    
    // Check if ISBN already exists
    const existingBook = books.find(book => book.isbn === isbn);
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }
    
    // Generate new ID
    const newId = books.length > 0 
      ? Math.max(...books.map(b => parseInt(b.id) || 0)) + 1 
      : 1;
    
    // Create new book object
    const newBook = {
      id: newId.toString(),
      title,
      author,
      isbn,
      price: price || 0,
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      datePublished: datePublished || new Date().toISOString().split('T')[0],
      featured: featured || false
    };
    
    // Add to books array
    books.push(newBook);
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding book',
      error: error.message
    });
  }
});

// POST route to add a new review (with authentication)
app.post('/api/reviews', authenticateUser, (req, res) => {
  try {
    const {bookId, author, rating, title,comment,timestamp,verified } = req.body;
    
    // Validate required fields
    if (!bookId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookId, and rating are required'
      });
    }
    
    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if book exists
    const book = books.find(b => b.id === bookId || b.id === parseInt(bookId));
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with id ${bookId} not found`
      });
    }
    
    // Generate new review ID
    const newReviewId = reviews.length + 1;
    
    const author_ = author || 'Anonymous';

    // Create new review object
    const newReview = {
      id: "review-" +newReviewId.toString(),
      bookId: bookId.toString(),
      author: author_,
      title: title || '',
      rating: parseFloat(rating),
      comment: comment || '',
      timestamp: new Date().toISOString().split('T')[0],
      verified: verified || false
    };
    
    // Add to reviews array
    reviews.push(newReview);
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test`);
  console.log(`Logs are being written to log.txt`);
});