const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

exports.up = async (pgm) => {
  // Check if users already exist to prevent duplicates
  const existingAdmin = await pgm.db.query("SELECT id FROM users WHERE username = 'admin' AND deleted_at IS NULL");
  const existingStaff = await pgm.db.query("SELECT id FROM users WHERE username = 'staff' AND deleted_at IS NULL");

  if (existingAdmin.rows.length === 0) {
    const adminId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await pgm.db.query(`
      INSERT INTO users (id, username, password, fullname, role) 
      VALUES ($1, $2, $3, $4, $5)
    `, [adminId, 'admin', hashedPassword, 'System Administrator', 'admin']);
    
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists, skipping...');
  }

  if (existingStaff.rows.length === 0) {
    const staffId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash('Staff123!', 10);
    
    await pgm.db.query(`
      INSERT INTO users (id, username, password, fullname, role) 
      VALUES ($1, $2, $3, $4, $5)
    `, [staffId, 'staff', hashedPassword, 'Medical Staff', 'staff']);
    
    console.log('Staff user created successfully');
  } else {
    console.log('Staff user already exists, skipping...');
  }
};

exports.down = async (pgm) => {
  // Remove seeded users
  await pgm.db.query("DELETE FROM users WHERE username IN ('admin', 'staff')");
  console.log('Seeded users removed');
};
