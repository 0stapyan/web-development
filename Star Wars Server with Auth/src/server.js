const fastify = require('fastify')({ logger: true });
const path = require('path');
const auth = require('./auth');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

fastify.post('/auth', async (req, reply) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return reply.status(400).send({ error: 'Username and password are required' });
  }
  try {
    const token = await auth.authenticateUser(username, password);
    return reply.send({ token });
  } catch (err) {
    return reply.status(401).send({ error: err.message });
  }
});

fastify.addHook('onRequest', async (req, reply) => {
  if (req.routerPath === '/planets' || req.routerPath === '/characters') {
    try {
      await auth.verifyToken(req);
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized access' });
    }
  }
});

fastify.get('/planets', async (req, reply) => {
  return reply.send({ planets: ['Tatooine', 'Naboo', 'Coruscant'] });
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
