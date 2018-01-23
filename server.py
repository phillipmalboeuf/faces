
from flask import request, abort, redirect

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from threading import Thread
import subprocess
import webview
import webbrowser
import sys

from core import app


@app.route('/browser')
def browser():
  webbrowser.open_new('http://localhost:8080')
  
  return redirect('/start')


if __name__ == '__main__':
  if app.config['ENVIRONMENT'] == 'DEVELOPMENT':
    # app.run(port=8080, threaded=True)

    server = Thread(target=app.run, kwargs={'port': 8080, 'threaded': True, 'use_reloader': False})
    server.daemon = True
    server.start()

    grunt = Thread(target=subprocess.run, args=([app.path + '/node_modules/grunt/bin/grunt']), kwargs={'cwd': sys._MEIPASS})
    grunt.daemon = True
    grunt.start()

    webview.create_window('Class', 'http://localhost:8080/start')

  else:
    server = HTTPServer(WSGIContainer(app))
    server.listen(5000)
    IOLoop.instance().start()


