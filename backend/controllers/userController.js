const pool = require('../db');

const getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, date, venue, price, available_tickets FROM events WHERE is_active = true'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEvents };


const bookTicket = async (req, res) => {
    const { event_id, quantity } = req.body;
    const user_id = req.user.id;
  
    try {
      // Check if tickets are available
      const eventResult = await pool.query(
        'SELECT available_tickets FROM events WHERE id = $1 AND is_active = true',
        [event_id]
      );
      if (eventResult.rows.length === 0) {
        return res.status(404).json({ message: 'Event not found or inactive' });
      }
  
      const availableTickets = eventResult.rows[0].available_tickets;
      if (quantity > availableTickets) {
        return res.status(400).json({ message: 'Not enough tickets available' });
      }
  
      // Deduct tickets and insert booking
      await pool.query('BEGIN');
  
      await pool.query(
        'INSERT INTO bookings (user_id, event_id, quantity, status) VALUES ($1, $2, $3, $4)',
        [user_id, event_id, quantity, 'CONFIRMED']
      );
  
      await pool.query(
        'UPDATE events SET available_tickets = available_tickets - $1 WHERE id = $2',
        [quantity, event_id]
      );
  
      await pool.query('COMMIT');
      res.status(201).json({ message: 'Ticket booked successfully' });
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    }

    try {
        const eventResult = await pool.query(
          'SELECT id, name, available_tickets, vendor_id FROM events WHERE id = $1 AND is_active = true',
          [event_id]
        );
    
        if (eventResult.rows.length === 0) {
          return res.status(404).json({ message: 'Event not found or inactive' });
        }
    
        const event = eventResult.rows[0];
        if (quantity > event.available_tickets) {
          return res.status(400).json({ message: 'Not enough tickets available' });
        }
    
        await pool.query('BEGIN');
    
        await pool.query(
          'INSERT INTO bookings (user_id, event_id, quantity, status) VALUES ($1, $2, $3, $4)',
          [user_id, event_id, quantity, 'CONFIRMED']
        );
    
        await pool.query(
          'UPDATE events SET available_tickets = available_tickets - $1 WHERE id = $2',
          [quantity, event_id]
        );
        // Send notification to user
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [user_id]);
    const userEmail = userResult.rows[0].email;
    await sendEmail({
      email: userEmail,
      subject: 'Ticket Booking Confirmation',
      message: `You have successfully booked ${quantity} tickets for the event: ${event.name}.`,
    });

    // Send notification to vendor
    const vendorResult = await pool.query('SELECT email FROM users WHERE id = $1', [event.vendor_id]);
    const vendorEmail = vendorResult.rows[0].email;
    await sendEmail({
      email: vendorEmail,
      subject: 'New Booking Alert',
      message: `A user has booked ${quantity} tickets for your event: ${event.name}.`,
    });

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Ticket booked successfully, notifications sent!' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

  
  module.exports = { getEvents, bookTicket };
  

  const getBookingHistory = async (req, res) => {
    const user_id = req.user.id;
  
    try {
      const result = await pool.query(
        'SELECT b.id, e.name AS event_name, b.quantity, b.status, b.created_at FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.user_id = $1',
        [user_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  
  module.exports = { getEvents, bookTicket, getBookingHistory };
  
  