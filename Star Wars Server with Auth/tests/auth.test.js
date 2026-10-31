const { authenticateUser, verifyToken } = require('../src/auth');
const jwt = require('jsonwebtoken');

jest.mock('sqlite3', () => {
  const mockGet = jest.fn((query, params, callback) => {
    if (params[0] === 'user' && params[1] === 'pass') {
      callback(null, { id: 1, username: 'user' });
    } else {
      callback(null, null);
    }
  });

  const mockDb = { get: mockGet };
  return {
    verbose: () => ({ Database: jest.fn(() => mockDb) }),
  };
});

const SECRET_KEY = 'super-secret-key';

describe('Authentication Tests', () => {
  test('authenticateUser with valid credentials', (done) => {
    authenticateUser('user', 'pass', (err, token) => {
      expect(err).toBeNull();
      expect(token).not.toBeNull();
      const decoded = jwt.verify(token, SECRET_KEY);
      expect(decoded.username).toBe('user');
      done();
    });
  });

  test('authenticateUser with invalid credentials', (done) => {
    authenticateUser('invalid', 'credentials', (err, token) => {
      expect(err).toBeNull();
      expect(token).toBeNull();
      done();
    });
  });

  test('verifyToken with a valid token', () => {
    const validToken = jwt.sign({ id: 1, username: 'user' }, SECRET_KEY, { expiresIn: '1h' });
    const decoded = verifyToken(validToken);
    expect(decoded).not.toBeNull();
    expect(decoded.username).toBe('user');
  });

  test('verifyToken with an invalid token', () => {
    const invalidToken = 'invalid.token.value';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });
});
