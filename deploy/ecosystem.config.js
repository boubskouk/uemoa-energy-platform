// Config PM2 pour le backend sur le VPS Hostinger
// Usage : pm2 start deploy/ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'uemoa-backend',
      cwd: __dirname + '/../backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: '../logs/backend-error.log',
      out_file: '../logs/backend-out.log',
      time: true
    }
  ]
}
