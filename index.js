const fs = require('fs')
const LogTemplate = require('./templates/logTemplate')

const getLogs = async (path, index) => {
	return await new Promise((resolve) => {
		try{
			let page = 1
			const stream = fs.createReadStream(path)
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
	version: '1.0.0',
	register: async (server, options) => {
		const { logPath } = options
		server.route([{
			method: 'GET',
			path: '/logs',
			handler: async (request, h) => {
				return LogTemplate
			}
		},{
			method: 'GET',
			path: '/chunk/{index}/',
			handler: async (request, h) => {
				const { index = 0 } = request.params
				return await getLogs(logPath, index)
			}
		}]);
	}
}

module.exports = { HapiLogViewer }