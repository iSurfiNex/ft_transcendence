from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

class CORSRequestHandler(SimpleHTTPRequestHandler):
	def end_headers(self):
		self.send_header('Access-Control-Allow-Origin', '*')
		super().end_headers()

if __name__ == "__main__":
	PORT = 8000
	with TCPServer(("", PORT), CORSRequestHandler) as httpd:
		print(f"Serving at http://localhost:{PORT}")
		httpd.serve_forever()
