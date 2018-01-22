
from flask import request, abort, redirect

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from threading import Thread
import subprocess
import webview
import webbrowser

from core import app


@app.route('/browser')
def browser():
  webbrowser.open_new('http://localhost:8080')
  
  return redirect('/start')


if __name__ == '__main__':
  if app.config['ENVIRONMENT'] == 'DEVELOPMENT':
    # app.run(port=8080, threaded=True)

    thread = Thread(target=app.run, kwargs={'port': 8080, 'threaded': True, 'use_reloader': False})
    thread.daemon = True
    thread.start()

    thread = Thread(target=subprocess.run, args=(['grunt']))
    thread.daemon = True
    thread.start()

    webview.create_window('Class', 'http://localhost:8080/start')

  else:
    server = HTTPServer(WSGIContainer(app))
    server.listen(5000)
    IOLoop.instance().start()


