# Mosquitto Dynamic Security Client

This module provides a wrapper for controlling the Mosquitto Dynamic Security plugin.

It implements all of the commands provided by the plugin described [here](https://github.com/eclipse/mosquitto/tree/master/plugins/dynamic-security).

### Example

```
const { DynSecClient } = require('@flowforge/mosquitto-dynsec-client')
const dynsecClient = new DynSecClient()

dynsecClient.on('error', function(err) {console.log(err)})
await dynsecClient.connect('mqtt://localhost:1880', {
    username: 'admin',
    password: 'password'
})

await dynsecClient.createClient({ username: 'foo', password: '123' })

```

