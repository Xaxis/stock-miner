import re
import time
import json
import websocket
import requests
import threading
from datetime import datetime


###########################################################################
## Class DataProvider
###########################################################################
class DataProvider():
    def __init__(
            self,
            symbols,
            type = 'crypto',
            currency = 'USD',
            debug = False
    ):

        # Init params
        self.symbols = symbols
        self.type = type
        self.currency = currency
        self.debug = debug

        # Provider API key
        self.apiKeyPG = '_nnkbN3IuzOKDecrdiwKe5eLmU_dAzV1'

        # Provider socket URLs
        self.socketStocksURL = 'wss://socket.polygon.io/stocks'
        self.socketCryptoURL = 'wss://socket.polygon.io/crypto'

        # Provider REST URLs
        self.restPolygonURL = 'https://api.polygon.io/v1/'

        # Stream data
        self.stream_data_obj = {}
        self.stream_data_last = {}

        # Initialize websocket running task as its own thread to prevent blocking
        self.ws = None
        self.req_data = None
        self.GetStockStream(self.symbols, self.type)
        self.wst = threading.Thread(target=self.ws.run_forever)
        self.wst.daemon = True
        self.wst.start()



    #--- Initialize websocket and/or add subscription stream channels.
    def GetStockStream(self, symbols, type):

        # Build connection based on data type
        if type == 'stock':
            url = self.socketStocksURL
        elif type == 'crypto':
            url = self.socketCryptoURL

        # Build param string
        params = ""
        i = 0
        for stock in symbols:

            # Build blank stream data objects
            self.stream_data_obj[stock] = {}
            self.stream_data_last[stock] = {}

            # Build request params
            params += "XQ."+stock+'-'+self.currency
            if i < len(symbols)-1:
                params += ","
            i += 1

        # Build channel subscription request object
        self.req_data = {
            "action": "subscribe",
            "params": params
        }

        # Build the socket with its handlers and run
        if self.debug:
            websocket.enableTrace(True)

        # Only create websocket if it doesn't already exist
        if not self.ws:
            self.ws = websocket.WebSocketApp(
                "wss://socket.polygon.io/crypto",
                on_message  = lambda ws, message: self.OnSocketMessage(ws, message),
                on_error    = lambda ws, error: self.OnSocketError(ws, error),
                on_open     = lambda ws: self.OnSocketOpen(ws),
                on_close    = lambda ws: self.OnSocketClose(ws)
            )
        else:
            self.ws.send(json.dumps(self.req_data))



    #--- Unsubscribe from a list of stream channels.
    def RemoveStockStream(self, symbols):

        # Build param string
        params = ""
        i = 0
        for stock in symbols:
            params += "XQ."+stock+'-'+self.currency
            if i < len(symbols)-1:
                params += ","
            i += 1

        # Unsubscribe from stream channels
        self.ws.send(json.dumps({
            "action": "unsubscribe",
            "params": params
        }))

        # Delete data from stream object
        for stock in symbols:
            del self.stream_data_obj[stock]
            del self.stream_data_last[stock]



    #--- Close our websocket stream.
    def CloseStockStream(self):
        self.ws.keep_running = False



    #--- Socket on_open event handler
    def OnSocketOpen(self, ws):
        if self.debug:
            print('Websocket opened.')

        # Authenticate w/ API key on connection open
        ws.send(json.dumps({
            "action": "auth",
            "params": self.apiKeyPG
        }))

        # Subscribe to stream channels
        ws.send(json.dumps(self.req_data))



    #--- Socket on_message event handler
    def OnSocketMessage(self, ws, message):
        if self.debug:
            print(message)

        # The data properties we want access to
        props = ['bp', 'bs', 'ap', 'as', 't', 'x', 'r']

        # Parse data stream into accessible live data
        stream_arr = json.loads(message)
        for stock in stream_arr:

            # Build objects when message is returned data
            if not stock['ev'] == 'status':
                key = re.sub('-'+self.currency+'$', '', stock['pair'])
                stream_obj_live = self.stream_data_obj[key]
                stream_obj_last = self.stream_data_last[key]

                # Build stream data objects
                for prop in props:

                    # Update 'last' object with last recorded data
                    if prop in stream_obj_live:
                        stream_obj_last[prop] = stream_obj_live[prop]
                    else:
                        stream_obj_last[prop] = stock[prop]

                    # Update 'live' object with most recent data
                    stream_obj_live[prop] = stock[prop]



    #--- Socket on_error event handler
    def OnSocketError(self, ws, error):
        print('Websocket error: '+ error)



    #--- Socket on_close event handler
    def OnSocketClose(self, ws):
        if self.debug:
            print('Websocket closed.')



    #--- Performs a RESTful request and returns a JSON result.
    def GetStockRESTRequest(self, req_url):

        # Handle any timeouts or server problems
        try:
            response = requests.get(req_url, timeout=10)
            response.raise_for_status()
            result = response.json()
        except requests.exceptions.HTTPError as errh:
            print(errh)
            result = {'status': 'error'}
        except requests.exceptions.ConnectionError as errc:
            print(errc)
            result = {'status': 'error'}
        except requests.exceptions.Timeout as errt:
            print(errt)
            result = {'status': 'error'}
        except requests.exceptions.RequestException as err:
            print(err)
            result = {'status': 'error'}

        # Proceed with successful server return
        if not 'status' in result:
            if response.status_code == 200:
                result['status'] = 'success'
            else:
                result['status'] = 'success'

        # Return result object
        return result



    #--- Return a stock's Open/Close data via a REST API request.
    def GetStockRESTOpenClosed(self, property, type, symbol, date, currency='USD'):

        # Build URL based on trade type
        if type == 'crypto':
            req_url = self.restPolygonURL + 'open-close/crypto/' + symbol + '/' + currency + '/' + date
        else:
            req_url = self.restPolygonURL + 'open-close/' + symbol + '/' + currency + '/' + date
        req_url += '?unadjusted=false&apiKey=' + self.apiKeyPG

        # Make the request
        result = self.GetStockRESTRequest(req_url)
        result['symbol_only'] = symbol

        # Set the result as a property of the class object instead of returning
        self.stream_data_obj[symbol][property] = result



    #--- Creates a Python thread that runs in daemon mode by default. This is
    #--- useful for running non-blocking code.
    #@todo - May need to add auto thread kill capacity
    def ThreadRequest(self, func, args=[], daemon=True):
        if len(args) > 0:
            thread = threading.Thread(target=func, args=args)
        else:
            thread = threading.Thread(target=func)
        thread.daemon = daemon
        thread.start()
        return thread
