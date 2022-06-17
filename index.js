const DynSecClient = require('./lib/dynsec')

module.exports = {
    DynSecClient
}

// ;(async function() {
//     const dynsecClient = new DynSecClient()
//     try {
//         dynsecClient.on('error', function(err) {console.log(err)})
//         await dynsecClient.connect('mqtt://localhost:4880', {
//             username: 'admin',
//             password: 'q1w2e3r4'
//         })
    


//         // let result = await dynsecClient.getDefaultACLAccess()
//         // console.log(result)
//         // result = await dynsecClient.deleteClient({ username: 'foo' })
//         // console.log(result)
//         // result = await dynsecClient.createClient({ username: 'foo', password: '123' })
//         // console.log(result)
//         // dynsecClient.getDefaultACLAccess().then( r => console.log('gda', r))
//         // dynsecClient.deleteClient({ username: 'foo' }).then( r => console.log('dc', r)).catch(err => { console.log('dc',err)})
//         // dynsecClient.createClient({ username: 'foo', password: '123' }).then( r => console.log('cc', r)).catch(err => { console.log('cc',err)})
//         // dynsecClient.createClient({ username: 'foo', password: '123' }).then( r => console.log('cc2', r)).catch(err => { console.log('cc2',err)})
//         // dynsecClient.deleteClient({ username: 'foo' }).then( r => console.log('dc2', r)).catch(err => { console.log('dc2', err)})
        
//         // for (var i=0;i<100;i++) {
//         //     await dynsecClient.createClient({ username: `foo${i}`, password: '123' })
//         // }


//         let result = await dynsecClient.getAllGroups()
//         console.log(result)

//     } catch(err) {
//         console.log(err)
//     }
//     await dynsecClient.disconnect()
// })()



