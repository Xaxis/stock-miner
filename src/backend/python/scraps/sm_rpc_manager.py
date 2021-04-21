import sys, json


###########################################################################
## Class RPCManager
##
## Handles parsing and serializing data to and from Node-Python requests.
###########################################################################
class RPCManager:
    def __init__(self, func):
        self.args = sys.argv[1:]
        self.func = func
        self.execute()

    # Execute function task with passed arguments
    def execute(self):
        result = {
            "data": self.func(*self.args)
        }
        print(json.dumps(result))
