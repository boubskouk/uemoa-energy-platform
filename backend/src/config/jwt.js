module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret_key',
  expiresIn: process.env.JWT_EXPIRE || '7d',

  // Options JWT
  options: {
    issuer: 'UEMOA Energy Platform',
    audience: 'uemoa-energy-users'
  }
};
