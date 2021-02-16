const fs = require('fs');

module.exports = {
    // outputDir: 'public',
    assetsDir: 'assets',
    devServer: {
        https: {
            key: fs.readFileSync('.certs/key.pem'),
            cert: fs.readFileSync('.certs/cert.pem')
        },
        port: 8080,
        
        
    },
  "transpileDependencies": [
    "vuetify"
    ]
}