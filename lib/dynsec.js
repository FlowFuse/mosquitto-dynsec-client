const mqtt = require('async-mqtt')
const EventEmitter = require('events')

class DynSecClient extends EventEmitter {
    constructor (hostname, options) {
        super()
        this.inflight = false
        this.activeCommand = null
        this.queue = []
        this.hostname = hostname
        this.options = options
    }

    async connect() {
        this.client = await mqtt.connectAsync(this.hostname, this.options)
        this.client.on('error', (err) => this.emit('error', err))
        this.client.on('message', (topic, message) => {
            const json = JSON.parse(message.toString())
            const response = json.responses[0]
            if (response.error) {
                this.activeCommand.promise.reject(response.error)
            } else {
                this.activeCommand.promise.resolve(response.data)
            }
            this.inflight = false
            this.processCommand()
        })
        return this.client.subscribe('$CONTROL/dynamic-security/v1/response')
    }

    async disconnect() {
        await this.client.end()
    }

    async sendCommand (command, payload = {}) {
        const promise = new Deferred()
        this.queue.push({
            promise,
            func: async () => {
                await this.client.publish('$CONTROL/dynamic-security/v1', JSON.stringify({
                    "commands":[
                        {
                            "command": command,
                            ...payload
                        }
                    ]
                }))
            }
        })
        if (!this.inflight) {
            this.processCommand()
        }
        return promise
    }

    async processCommand () {
        if (!this.inflight && this.queue.length > 0) {
            this.inflight = true
            this.activeCommand = this.queue.shift()
            return this.activeCommand.func()
        }
    }

    async getAllOfType(type, options) {
        const batch = options.batch || 10
        let total = 0
        let items = []
        do {
            const result = await this[`list${type}`]({count: batch, offset: items.length})
            if (total === 0) {
                total = result.totalCount
            }
            items = items.concat(result[type.toLowerCase()])
        } while(items.length < total)
        return items
    }        
    async getAllClients(options = {}) {
        return this.getAllOfType('Clients', options)
    }
    async getAllRoles(options = {}) {
        return this.getAllOfType('Roles', options)
    }
    async getAllGroups(options = {}) {
        return this.getAllOfType('Groups', options)
    }

}

[
    'setDefaultACLAccess',
    'getDefaultACLAccess',
    'createClient',
    'deleteClient',
    'enableClient',
    'disableClient',
    'getClient',
    'listClients',
    'modifyClient',
    'setClientId',
    'setClientPassword',
    'addClientRole',
    'removeClientRole',
    'addGroupClient',
    'createGroup',
    'deleteGroup',
    'getGroup',
    'listGroups',
    'modifyGroup',
    'removeGroupClient',
    'addGroupRole',
    'removeGroupRole',
    'setAnonymousGroup',
    'getAnonymousGroup',
    'createRole',
    'getRole',
    'listRoles',
    'modifyRole',
    'deleteRole',
    'addRoleACL',
    'removeRoleACL'
].forEach(command => {
    DynSecClient.prototype[command] = async function(payload) {
        return this.sendCommand(command, payload)
    }
})


class Deferred {
    constructor() {
        return new Proxy(new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
            this.ID = Math.floor(Math.random()*1000)
        }), {
            get: (target, prop) => this[prop] || target[prop].bind(target),
        })
    }
}

module.exports = DynSecClient