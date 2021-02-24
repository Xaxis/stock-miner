import os
import webview
from sm_data_provider import DataProvider

#@todo - This is only here for testing purposes for the time being!!! MUCH WORK TO DO!
dp = DataProvider(['BTC', 'LTC'], 'crypto', debug=False)

class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def get_stream_data(self):
        return dp.stream_data_obj


def get_entrypoint():
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))
    if exists('../gui/index.html'): # unfrozen development
        return '../gui/index.html'
    if exists('../Resources/gui/index.html'): # frozen py2app
        return '../Resources/gui/index.html'
    if exists('./gui/index.html'):
        return './gui/index.html'
    raise Exception('No index.html found')


if __name__ == '__main__':
    entry = get_entrypoint()
    window = webview.create_window('pywebview-react boilerplate', entry, js_api=Api())
    webview.start(debug=True)
