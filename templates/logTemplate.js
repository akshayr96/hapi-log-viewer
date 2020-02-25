const template = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Hapi Loggic</title>
		<style>
			body{
				background-color: #11111a;
				color: white;
				font-family: sans-serif;
			}
			#logs{
				max-width: 70em;
				margin: 0px auto;
				font-size: 14px;
				line-height: 1.5;
				background-color: #252539;
				padding: 20px;
			}
			button{
				transform: translateY(-50%);
				margin: 20px 0 109px 50%;
			}
		</style>
	</head>
	<body>
		<div id="logs"></div>
		<script>
			let page = 1
			let lineNumber = 1
			let getNextPagePending = false

			let patchCache = ''

			const generateEntryDiv = (entry) => {
				const logDiv = document.getElementById("logs")
				var entryDiv = document.createElement("div"); 
				var entryNode = document.createTextNode(lineNumber + ': ' + entry); 
				entryDiv.appendChild(entryNode);
				logDiv.appendChild(entryDiv)
				lineNumber = lineNumber + 1
			}

			const getNextPage = async () => {
				const response = await fetch('/chunk/' + page + '/')
				return await response.json()
			}

			const getLogs = async () => {
				try{
					getNextPagePending = true
					const logs = await getNextPage()
					logs.reverse().forEach((entry, i) => {
						if(i == logs.length -1){
							patchCache = entry
						}else{
							generateEntryDiv(i == 0 ? entry + patchCache : entry)
							if(i == 0) patcheCache = ''
						}
					})
					if(logs.length) page = page + 1
				}catch(error){
					console.error(error)
				}
				getNextPagePending = false
			}

			
			(()=>{
				window.onscroll = () => {
					if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
						if(!getNextPagePending){
							getLogs()
						}
					}
				};
			})()
			
			getLogs()
		</script>
	</body>
	</html>
`

module.exports = template