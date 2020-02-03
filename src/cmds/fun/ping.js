module.exports.run = (message, args, lang) => {
	message.embeder.send(lang.title, lang.description.replace('{ping}', client.ping)  + 'ms')
}
exports.config = {
	name: 'ping',
	aliases: ['пинг'],
	cooldown: 1000
}