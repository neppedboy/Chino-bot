module.exports.run = async (message,args) => {	
	
	try{
		
		let output = eval(args.join(" "))
		let type = {}.toString.call(output).slice(8,-1)
		
		if (type == 'Promise') output = await output;
		
		message.channel.send(
		'typeof: ' + type +
		'\noutput: ' + output,
		{split:"\n", code:"js"});
		
	}catch(err){message.channel.send(err,{split:"\n", code:"js"})}
}
exports.config = {
	name: 'eval',
	aliases: [],
	access: 'developer'
}