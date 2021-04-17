from sm_rpc_manager import RPCManager
# import robin_stocks as r
import pyotp

def task_rh_login(username, password, token):
    return True

RPCManager(task_rh_login)