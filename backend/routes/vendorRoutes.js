const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { createEvent } = require('../controllers/vendorController');

const router = express.Router();

router.post('/events', authenticateToken, authorizeRoles('vendor'), createEvent);

module.exports = router;
