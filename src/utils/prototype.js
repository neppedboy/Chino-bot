let moment = require('moment');

moment.validDurTime = (time, trans = 'en-EN') => {
	let lang = kohai.getLang(trans).validDurTime || {}
	if(time < 1000) time = 1000
	time = parseInt(time/1000);
	let str = [];
	if(time >= 60*60*24) str.push('D ' + lang.day);
	if(time >= 60*60) str.push('H ' + lang.hour);
	if(time >= 60) str.push('m ' + lang.min);
	if(time >= 1) str.push('s ' + lang.sec);
	return moment(moment.duration('0:0:'+time)._data).format(str.join('. '));
}
Array.prototype.random = function() {
	return this[Math.floor(Math.random() * arr.length)]
}
Object.prototype.forEach = function(fn) {
	if(typeof fn != 'function')throw new TypeError('First argument must be a function.')
	for(const [key, val] of this) fn(val, key, this)
}
Array.prototype.exclude = function(array){
	if(!(array instanceof Array))throw new TypeError('First argument must be a array')
	return this.filter(i => !array.includes(i))
} 
/*
async function request(url){
	return new Promise((resolve, reject) => {
		const req = require(url.split(':')[0]).get(res => {
			if(res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(`Status Code: ${res.statusCode}`));
			
			const data = []
			res.on('data', chunk => { data.push(chunk) })
			res.on('end', () => resolve(Buffer.concat(data).toString()));
		})
		req.on('error', reject);
		req.end();
	})
}
console.log(request('https://www.google.com/').catch(console.error))
*/