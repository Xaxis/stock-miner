const WebSocket = require('ws')
const {v4: uuidv4} = require('node-uuid')

/**
 * WebSocketServer manages the initialization of the websocket used by this
 * application to stream data from the DataProvider to the frontend of the
 * app.
 *
 * WebSocketServer requires access to DBManager, DataProvider, and DataTransducer
 * instances.
 */
class WebSocketServer {

    constructor(DBManager, DataProvider, DataTransducer) {
        this.DB = DBManager
        this.DP = DataProvider
        this.DT = DataTransducer
        this.WSS = null
        this.WSS_CLIENTS = {}
        this.CONNECTION_OBJECT = null
        this.TASK_INTERVAL = null
        this.TASK_INTERVAL_PAUSED = true
        this.PROFILE = null
        this.TABLEID = null
        this.DB.get_config()
            .then((config) => {
                if (config) {
                    this.init_wss(config.polling_frequency)
                } else {
                    this.init_wss(3000)
                }
            })
    }

    /**
     * Initialize the websocket connection, handlers, and task interval.
     */
    init_wss = (polling_frequency) => {
        this.WSS = new WebSocket.Server({port: 2223})

        // Build handlers on WebSocket connection
        this.WSS.on('connection', (cobj) => {
            this.CONNECTION_OBJECT = cobj
            cobj._clientID = uuidv4()
            cobj._error = false
            this.WSS_CLIENTS[cobj._clientID] = cobj
            console.log('SM: WebSocket: Connected: New WebSocket connection from client. ID: ', cobj._clientID)

            // Handle client disconnects
            cobj.on('close', () => {
                delete this.WSS_CLIENTS[cobj._clientID]
                this.TASK_INTERVAL_PAUSED = true
                console.log('SM: WebSocket: Closed: WebSocket client connection closed. ID: ', cobj._clientID)
            })

            // Handle and redirect action requests from the client
            cobj.on('message', (msg) => {
                let msg_obj = JSON.parse(msg)
                switch (msg_obj.action) {

                    // Set active profile/unpause interval
                    case 'get-data-for-profile':
                        this.PROFILE = msg_obj.data.profile
                        this.TABLEID = msg_obj.data.tableid
                        this.TASK_INTERVAL_PAUSED = false
                        break
                }
            })

            // Initialize "polling" interval for data stream handling
            this.reset_task_interval(polling_frequency)
        })
    }

    /**
     * The main interval loop responsible for sending stream data to the client.
     */
    init_task_interval = (period) => {
        let self = this
        this.TASK_INTERVAL = setInterval(() => {
            if (!this.TASK_INTERVAL_PAUSED) {
                try {
                    if (!this.CONNECTION_OBJECT._error) {
                        if (this.PROFILE && this.CONNECTION_OBJECT.readyState === 1) {
                            this.DT.get_data_stream_for_profile(this.TABLEID, this.PROFILE)
                                .then((stream_data) => {
                                    self.CONNECTION_OBJECT.send(JSON.stringify(stream_data))
                                })
                        }
                    }
                } catch (error) {
                    this.CONNECTION_OBJECT._error = true
                    console.log('SM: WebSocket: Error: ', error)
                }
            }
        }, period)
    }

    /**
     * Resets the task interval.
     */
    reset_task_interval = (period) => {
        clearInterval(this.TASK_INTERVAL)
        this.init_task_interval(period)
    }
}

module.exports = {
    WebSocketServer: WebSocketServer
}