const errorMiddleware = (err, req, res, next) => {
    console.error(err.message); // Log the error (you can implement a logger in production)
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
  
    return res.status(500).json({ message: 'Server Error' });
  };
  
  module.exports = errorMiddleware;
  