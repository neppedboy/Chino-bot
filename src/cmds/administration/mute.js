const ms = require('ms');
const { validDurTime } = require('moment');
module.exports.run = (message, args, lang) => {
	let member = message.mentions.members.first();
	if(!member)return message.embeder.sendWarn(lang.noMember + lang.args);
	if(member.isMuted)return message.embeder.sendWarn(lang.memberMuted)
	if(!args[1])return message.embeder.sendWarn(lang.noTime + lang.args);
	let time = ms(args[1] || 0);
	let reason = args[2] ? args.slice(2).join(' ') : null;
	if(!time)return message.embeder.sendWarn(lang.noTime + lang.args);
	message.embeder.send(lang.mute.title, 
	lang.mute.description
	.replace('{member}', member.toString())
	.replace('{time}', validDurTime(time, message.guild.db.lang) + '\n\n**Причина**: ' + reason))
	member.guildMute(time);
}
exports.config = {
	name: 'mute',
	aliases: [],
	permissions: ['ADMINISTRATOR'],
	cooldown: 1000
}