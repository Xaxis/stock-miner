from sm_rpc_manager import RPCManager
import robin_stocks.robinhood as r
import pyotp

def task_rh_login(username, password, token):
    totp = pyotp.TOTP(token).now()
    login_obj = r.login(username, password, mfa_code=totp)
    if login_obj['access_token']:
        return {
            "success": True
        }
    else:
        return {
            "success": False
        }

RPCManager(task_rh_login)