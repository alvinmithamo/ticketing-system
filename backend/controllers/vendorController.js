const createEvent = async (req, res) => {
    const { name, description, date, venue, price, available_tickets } = req.body;
    const vendor_id = req.user.id;
  
    try {
      const result = await pool.query(
        'INSERT INTO events (name, description, date, venue, price, available_tickets, vendor_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
        [name, description, date, venue, price, available_tickets, vendor_id]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { createEvent };
  
  const getVendorEvents = async (req, res) => {
    const vendor_id = req.user.id;
  
    try {
      const result = await pool.query(
        'SELECT * FROM events WHERE vendor_id = $1',
        [vendor_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { createEvent, getVendorEvents };
  