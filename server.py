
from flask import request, abort, redirect

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

from core import app


@app.route('/browser')
def browser():
  import webbrowser
  webbrowser.open_new('http://localhost:8080')
  
  return redirect('/start')


if __name__ == '__main__':
  if app.config['ENVIRONMENT'] == 'DEVELOPMENT':
    app.run(port=8080, threaded=True)

    # from threading import Thread
    # import subprocess
    # import webview
    # import sys

    # server = Thread(target=app.run, kwargs={'port': 8080, 'threaded': True, 'use_reloader': False})
    # server.daemon = True
    # server.start()

    # grunt = subprocess.Popen([f'./node_modules/grunt-cli/bin/grunt', f'--path={app.path}/'],
    #   cwd=(sys._MEIPASS if hasattr(sys, '_MEIPASS') else app.path))

    # webview.create_window('Class', 'http://localhost:8080/start')

    # grunt.kill()



  else:
    server = HTTPServer(WSGIContainer(app))
    server.listen(5000)
    IOLoop.instance().start()


