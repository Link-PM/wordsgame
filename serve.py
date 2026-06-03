"""开发用静态服务器：禁用缓存，避免改了代码浏览器还用旧文件。
用法： python serve.py [端口]   （默认 8090）
生产部署在 GitHub Pages，不用这个。
"""
import http.server
import socketserver
import sys

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


NoCacheHandler.extensions_map[".js"] = "text/javascript"
NoCacheHandler.extensions_map[".mjs"] = "text/javascript"

with socketserver.TCPServer(("127.0.0.1", port), NoCacheHandler) as httpd:
    print(f"serving (no-cache) on http://127.0.0.1:{port}")
    httpd.serve_forever()
