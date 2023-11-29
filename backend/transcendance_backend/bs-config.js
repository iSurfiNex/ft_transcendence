const historyFallback = require('connect-history-api-fallback');

module.exports = {
	server: {
		baseDir: "./static/", // ou spécifie le chemin vers ton dossier racine
	},
	files: [ "**/*" ],
	middleware: [historyFallback()], // Enable SPA routing
};
