const express = require('express');
const { getEvents } = require('../controllers/userController');

const router = express.Router();

router.get('/events', getEvents);

module.exports = router;


const { authenticateToken } = require('../middleware/authMiddleware');
const { getEvents, bookTicket } = require('../controllers/userController');

router.post('/book', authenticateToken, bookTicket);

router.get('/bookings', authenticateToken, getBookingHistory);
