// Script de test pour vérifier NODE_ENV
console.log("=================================");
console.log("Test de configuration NODE_ENV");
console.log("=================================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("NEXT_PUBLIC_SOCKET_URL:", process.env.NEXT_PUBLIC_SOCKET_URL);
console.log("=================================");

// Import du config
const config = require("./src/app/lib/api/configServer");
console.log("Configuration chargée:");
console.log("URL_CONFIG:", config.URL_CONFIG);
console.log("=================================");
