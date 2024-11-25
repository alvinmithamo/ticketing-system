const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);

module.exports = router;
