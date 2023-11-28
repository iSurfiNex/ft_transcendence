const historyFallback = require('connect-history-api-fallback');

module.exports = {
	server: {
		baseDir: "./", // ou spécifie le chemin vers ton dossier racine
	},
	files: [ "**/*" ],
	middleware: [historyFallback()], // Enable SPA routing
};
