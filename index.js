var backwardsStream = require('fs-backwards-stream')
const LogTemplate = require('./templates/logTemplate')

const getLogs = async (path, index) => {
	return await new Promise((resolve) => {
		try{
			let page = 1
			const stream = backwardsStream(path, { block: 3072 })
				.on('data', (chunk) => {
					if(page == index){
						chunk = chunk.toString().split('\n')
						stream.destroy()
						resolve(chunk)
					}else {
						page  = page + 1
					}
				})
				.on('end', () => resolve([]))
				.on('error', () => resolve([]))
		}catch(error){
			console.error(error)
			resolve([])
		}
	})
}

const HapiLogViewer = {
	name: 'HapiLogViewer',
	version: '1.0.2',
	register: async (server, options) => {
		const { hapiLogViewer: { logPath, disable } } = options
		if(!disable){
			server.route([{
				method: 'GET',
				path: '/logs',
				config: {
					auth: false
				},
				handler: async (request, h) => {
					request.skipAccessLog = true
					return LogTemplate
				}
			},{
				method: 'GET',
				path: '/chunk/{index}/',
				config: {
					auth: false
				},
				handler: async (request, h) => {
					request.skipAccessLog = true
					const { index = 0 } = request.params
					return await getLogs(logPath, index)
				}
			}]);
		}
	}
}

module.exports = { HapiLogViewer }