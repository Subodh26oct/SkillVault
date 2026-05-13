import { body, param, query } from 'express-validator';

// Auth Validators
export const authValidators = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and numbers'),
    
    body('role')
      .isIn(['student', 'instructor', 'admin'])
      .withMessage('Invalid role selected'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Bio cannot exceed 200 characters'),
    
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
  ],

  resetPassword: [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and numbers'),
    
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
};

// Course Validators
export const courseValidators = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 20, max: 1000 })
      .withMessage('Description must be between 20 and 1000 characters'),
    
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid course level'),
    
    body('thumbnail')
      .optional()
      .isURL()
      .withMessage('Thumbnail must be a valid URL'),
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 20, max: 1000 })
      .withMessage('Description must be between 20 and 1000 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
  ],

  createLecture: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    
    body('videoUrl')
      .isURL()
      .withMessage('Video URL must be valid'),
    
    body('duration')
      .isFloat({ min: 0.1 })
      .withMessage('Duration must be greater than 0'),
  ],
};

// Purchase Validators
export const purchaseValidators = {
  create: [
    body('courseId')
      .isMongoId()
      .withMessage('Invalid course ID'),
    
    body('paymentMethod')
      .isIn(['stripe', 'razorpay'])
      .withMessage('Invalid payment method'),
  ],

  verifyPayment: [
    body('razorpay_order_id')
      .notEmpty()
      .withMessage('Order ID is required'),
    
    body('razorpay_payment_id')
      .notEmpty()
      .withMessage('Payment ID is required'),
    
    body('razorpay_signature')
      .notEmpty()
      .withMessage('Signature is required'),
  ],
};

// Common Validators
export const commonValidators = {
  objectId: (paramName) =>
    param(paramName)
      .isMongoId()
      .withMessage(`Invalid ${paramName} format`),
  
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('Limit must be between 1 and 100'),
  ],
};

export default {
  authValidators,
  courseValidators,
  purchaseValidators,
  commonValidators,
};
