const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const SECRET_KEY = 'super-secret-key';
const db = new sqlite3.Database('./db.db');

function authenticateUser(username, password, callback) {
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        callback(err, null);
      } else if (row) {
        const token = jwt.sign({ id: row.id, username: row.username }, SECRET_KEY, { expiresIn: '1h' });
        callback(null, token);
      } else {
        callback(null, null);
      }
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = {
  authenticateUser,
  verifyToken,
};
