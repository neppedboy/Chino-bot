const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require(path.join(process.cwd(), 'config.js'))

class Kohai{
	constructor(options = {}){
		this.commands = new Collection();
		this.aliases  = new Collection();
		this.client   = new Client();
		this.config   = config;
		let root      = path.join(process.cwd(), 'src/');
		this.paths    = {
			root,
			cmdFolders: path.join(root, 'cmds/'),
			eventFolders: path.join(root, 'events/'),
			utils: path.join(root, 'utils/'),
			structures: path.join(root, 'structures/'),
			languages: path.join(process.cwd(), 'languages/')
		}
		if(!options.token && config.token) this.client.login(config.token)
		if(options.token) this.client.login(options.token);
	}
	get utils(){
		let obj = new Object();
		let utilsFolder = fs.readdirSync(this.paths.utils)
		for(const util of utilsFolder) obj[path.basename(util, '.js')] = require(path.join(this.paths.utils, util));
		return obj
	}
	get langs(){
		return fs.readdirSync(this.paths.languages).map(i => i.split('.').slice(0,-1).join(''))
	}
	getLang(lang){
		if(!this.langs.includes(lang))throw new Error('lang: "' + lang + '" is not defined');
		return JSON.parse(fs.readFileSync(path.join(this.paths.languages, lang + '.json')).toString())
	}
	handler(type, fn){
		let typePath = type == 'events' ? 
		this.paths.eventFolders : type == 'cmds' ?
		this.paths.cmdFolders : new TypeError('first argument must be string \'cmds\' or \'events\'')

		const folders = fs.readdirSync(typePath);
		for(const folder of folders){
			const pathToFolder = path.join(typePath, folder)
			const files        = fs.readdirSync(pathToFolder);
			for(const file of files){
				const pathToFile = path.join(pathToFolder, file)
				const props      = require(pathToFile);
				fn(props, file, folder)
			}
		}
	}
	cmdRun(fn){
		this.client.on('message', message => {
			if(!message.guild || message.author.bot)return;
			const prefixes = [
				this.client.user.toString(),
				message.guild.db.prefix
			]
			const prefix = prefixes.find(i => message.content.trim().startsWith(i)) || null;
			if(prefix === null) return;
			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const command = args.shift().toLowerCase();
			const cmd = this.commands.get(command) || this.aliases.get(command);
			if(!cmd)return;
			fn({ message, prefix, command, args, cmd })
			
		})
	}
}
module.exports = Kohai