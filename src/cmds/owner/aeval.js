const { inspect } = require("util");
module.exports.run = async(message,args) => { 
	try {
		let output = eval('(async() => ('+args.join(" ")+'))()');
		let type = {}.toString.call(output).slice(8,-1)
		if (type == 'Promise') output = await output, type = {}.toString.call(output).slice(8,-1);
		
		output = inspect(output, { depth: 0, maxArrayLength: null });
		output = clean(output);
		
		message.channel.send(
		'typeof: ' + type +
		'\noutput: ' + output,
		{split:"\n", code:"js"});
		
	}catch(err){message.channel.send(err, {code:"js"})}
	
	function clean(str){
		return str
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203))
	}
}
exports.config = {
	name: 'asyncEval', 
	aliases: ['aeval'],
	access: 'developer'
}