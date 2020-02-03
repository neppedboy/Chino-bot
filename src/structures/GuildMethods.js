const { Json } = kohai.utils;
const { Guild, Collection } = require('discord.js');
const json = new Json({
	cwd: './src/database/guilds.json'
})

class GuildDB{
	constructor(guild){
		Object.defineProperty(this, 'guild', { value: guild });
		
		let db = json.get(guild.id) || {}
		
		this.prefix = db.prefix || config.prefix;
		this.muteRoleID = db.muteRoleID || null;
		this.lang = db.lang || 'ru-RU' 
		
		if(!json.has(guild.id)) json.add(guild.id, this);
	}
	save(){
		json.save(this.guild.id, this);
	}
}

Object.defineProperties(Guild.prototype, {
	"db": {
		get(){
			if(!this._db) Object.defineProperty(this, '_db', { value: new GuildDB(this) });
			return this._db
		}
	},
	"muteRole": {
		get(){
			return this.roles.get(this.db.muteRoleID)
		}
	},
	"membersDB": {
		get(){
			let collection = new Collection();
			this.members.forEach((e, i) => collection.set(i, e.db))
			return collection
		}
	},
	"createMuteRole": {
		value: async function createMuteRole(){
			let role = await this.createRole({ name: 'muted' });
			for(const channel of this.channels) await channel[1].overwritePermissions(role, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
				SPEAK: false
			})
			this.db.muteRoleID = role.id;
			this.db.save();
			return role;
		}
	}
})