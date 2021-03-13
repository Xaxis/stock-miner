const {DBManager} = require('../sm_db_manager.js')
let DBM = new DBManager()
DBM.drop_tables()
DBM.build_tables()