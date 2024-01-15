const historyFallback = require('connect-history-api-fallback');

module.exports = {
	server: {
		baseDir: "./static/", // ou spécifie le chemin vers ton dossier racine
	},
	files: [ "**/*" ],
	notify: false,
	middleware: [historyFallback()], // Enable SPA routing
};