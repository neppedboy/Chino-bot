const { RichEmbed, TextChannel, Message, User } = require('discord.js');


class Embeder{
	constructor(to){
		this.embed = new RichEmbed()
		.setColor('BLACK')
		.setFooter('Deity Senpai ~ <3')
		.setTimestamp();
		
		this.to = to.channel || to;
		if(to.channel) this.embed.setAuthor(to.author.username, to.author.displayAvatarURL);
	}
	justSend(color, title, description){
		return this.to.send(this.embed.setColor(color).setTitle(title).setDescription(description))
	}
	send(title, description){
		return this.justSend('GREEN', title, description);
	}
	sendWarn(description){
		return this.justSend('RED','Warn', description);
	}
}

const embeder = {get() { return new Embeder(this) }}

Object.defineProperties(User.prototype, { embeder })
Object.defineProperties(Message.prototype, { embeder })
Object.defineProperties(TextChannel.prototype, { embeder });