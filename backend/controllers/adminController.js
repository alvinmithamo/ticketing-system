const getAllUsers = async (req, res) => {
    try {
      const result = await pool.query('SELECT id, email, role FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { getAllUsers };
  