function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // JWT authentication error
        return res.status(401).json({ message: "The user is not authorized" });
    }

    if (err.name === 'ValidationError') {
        // Validation error
        return res.status(400).json({ message: "Validation error occurred" }); // Changed status to 400 for validation errors
    }

    // Default to 500 server error
    return res.status(500).json({ message: "An unexpected error occurred", error: err });
}

module.exports = errorHandler;
