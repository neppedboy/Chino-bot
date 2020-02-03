const ms = require('ms');
const { validDurTime } = require('moment');
module.exports.run = (message, args, lang) => {
	let member = message.mentions.members.first();
	if(!member)return message.embeder.sendWarn(lang.noMember);
	if(!member.isMuted)return message.embeder.sendWarn(lang.memberMuted)
	message.embeder.send(lang.unmute.title, 
	lang.unmute.description
	.replace('{member}', member.toString()))
	member.guildUnMute();
}
exports.config = {
	name: 'unmute',
	aliases: [],
	permissions: ['ADMINISTRATOR'],
	cooldown: 1000
}