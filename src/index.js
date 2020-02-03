const { Guild } = require('discord.js');
const path = require('path');
const moment = require('moment');
require('./utils/prototype.js')

const Kohai = require('./structures/Kohai.js');
global.kohai = new Kohai();
const { client, config } = kohai;
global.client = client;
global.config = config;

kohai.handler('events', (props, file, folder) => {
	if(!props.run)return;
	console.log('[event]', `[${folder}]`, path.basename(file, '.js'));
	client.on(folder, props.run)
})
kohai.handler('cmds', (props, file, folder) => {
	if(!props.config && !props.run)return;
	console.log('[cmds]', `[${folder}]`, path.basename(file, '.js'));
	props.config.category = folder
	kohai.commands.set(props.config.name.toLowerCase(), props);
	for(const alias of props.config.aliases) kohai.aliases.set(alias.toLowerCase(), kohai.commands.get(props.config.name.toLowerCase()));
})

kohai.cmdRun((props) => {
	const { cmd, message, args, command } = props;
	const lang = kohai.getLang(message.guild.db.lang) 
	if(cmd.config.access && !message.member.hasAccess(cmd.config.access)){
		message.embeder.sendWarn(lang.access.replace('{access}', cmd.config.access));
		return;
	}

	if(cmd.config.permissions){
		let perms = cmd.config.permissions.exclude(message.member.permissions.toArray())
		if(perms.length){
			message.embeder.sendWarn(lang.noPerms.replace('{perms}', perms));
			return;
		}
	}
	if(message.member.cooldowns.has(command)){
		message.embeder.sendWarn(lang.cooldown + 
		moment.validDurTime(message.member.cooldowns.get(command) - Date.now(), message.guild.db.lang))	;
		return;
	}
	
	cmd.run(message, args, lang.cmds[cmd.config.name]);

	if(cmd.config.cooldown) message.member.addCooldown(command, Date.now()+cmd.config.cooldown);
})

require(kohai.paths.structures + 'GuildMethods.js');
require(kohai.paths.structures + 'MemberMethods.js');
require(kohai.paths.structures + 'Embeder.js');
