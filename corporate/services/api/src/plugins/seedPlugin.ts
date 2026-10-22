import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

/**
 * SeedPlugin — Enterprise-grade, idempotent admin user seeding.
 *
 * Executes inside the `onReady` hook (after all plugins are registered and
 * the Mongoose connection is established). Uses `findOneAndUpdate` with
 * `upsert: true` — the Mongoose-recommended pattern for idempotent writes.
 *
 * Safe to run on EVERY application start across ALL environments:
 *   ✅ Dev     — local MongoDB via Docker
 *   ✅ Staging — MongoDB Atlas (cloud)
 *   ✅ Prod    — MongoDB Atlas (cloud)
 *
 * The Mongoose `pre('save')` password-hashing hook is intentionally bypassed
 * here — bcrypt.hash is called directly to control the salt rounds and avoid
 * double-hashing on `findOneAndUpdate`.
 *
 * Required env vars (declared in envConfig.ts schema):
 *   - ADMIN_USER_SEED   : desired admin username
 *   - ADMIN_EMAIL_SEED  : desired admin email
 *   - ADMIN_PASS_SEED   : plain-text password (bcrypt-hashed at seed time)
 */
const SeedPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  const { ADMIN_USER_SEED, ADMIN_EMAIL_SEED, ADMIN_PASS_SEED } = server.config;

  server.addHook('onReady', async () => {
    try {
      const { User } = server.models;

      const email = ADMIN_EMAIL_SEED.toLowerCase().trim();
      const username = ADMIN_USER_SEED.trim();

      server.log.info('🌱 [SeedPlugin] Checking for admin user...');

      const hashedPassword = await bcrypt.hash(ADMIN_PASS_SEED, 10);

      // findOneAndUpdate with upsert: true is the Mongoose-recommended pattern
      // for idempotent seed operations. It performs a single atomic round-trip:
      //   - If no admin exists → inserts a new document ($setOnInsert).
      //   - If an admin already exists → no-op (filter matches, $setOnInsert is skipped).
      // includeResultMetadata allows us to distinguish insert vs. no-op for logging.
      const result = await User.findOneAndUpdate(
        { role: 'admin' },
        {
          $setOnInsert: {
            email,
            username,
            password: hashedPassword,
            icon: 'quati',
            role: 'admin',
            loginAttempts: 0,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          includeResultMetadata: true,
        },
      ).exec();

      if (result.lastErrorObject?.updatedExisting === false) {
        server.log.info('✅ [SeedPlugin] Admin user seeded successfully.');
      } else {
        server.log.info('🌱 [SeedPlugin] Admin user already exists. Skipping seed.');
      }
    } catch (err) {
      // Non-fatal: log and continue — the server must remain available.
      // An admin can be provisioned manually via the database if seeding fails.
      server.log.error(err, '❌ [SeedPlugin] Failed to seed admin user.');
    }
  });
};

export default fp(SeedPlugin, {
  name: 'seed-plugin',
  // Declared dependency ensures Fastify loads mongoose-plugin first,
  // guaranteeing server.models is decorated before onReady fires.
  dependencies: ['mongoose-plugin'],
});
