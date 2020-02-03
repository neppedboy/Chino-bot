const { inspect } = require("util");
module.exports.run = async(message,args) => { 

	clean = (str) => str.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
	
	try {
		
		let output = eval(args.join(" "));
		let type = {}.toString.call(output).slice(8,-1)
		if (type == 'Promise') output = await output;
		
		output = inspect(output, { depth: 0, maxArrayLength: null });
		output = clean(output);
		
		message.channel.send(
		'typeof: ' + type +
		'\noutput: ' + output,
		{split:"\n", code:"js"});
		
	}catch(err){
		console.log(err.stack)
		message.channel.send(err, {code:"js"})
	}

}
exports.config = {
	name: 'objectEval',
	aliases: ['oeval'],
	access: 'developer'
}