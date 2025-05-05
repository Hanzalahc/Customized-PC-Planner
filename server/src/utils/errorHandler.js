const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const errors = error.errors || [];

  res.status(status).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;
