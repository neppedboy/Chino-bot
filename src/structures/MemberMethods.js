const { Json } = kohai.utils;
const { GuildMember, Collection } = require('discord.js')
const json = new Json({
	cwd: './src/database/members.json'
})

class MemberDB{
	constructor(member){
		Object.defineProperty(this, '_key', { value: member.guild.id + '.' + member.id});
		Object.defineProperty(this, 'member', { value: member });
		
		let db = json.get(this._key) || {};
		
		this.xp = db.xp || 0;
		this.lvl = db.lvl || 1;
		this.muteTime = db.muteTime || null;
		
		if(!json.has(this._key)) json.add(this._key, this)
	}
	save(){
		json.save(this._key, this)
	}
}

Object.defineProperties(GuildMember.prototype, {
	"db": {
		get(){
			if(!this._db) Object.defineProperty(this, '_db', { value: new MemberDB(this) });
			return this._db
		}
	},
	"cooldowns": {
		get(){
			if(!this._cooldowns) Object.defineProperty(this, '_cooldowns', { value: new Collection(), configurable: true });
			return this._cooldowns;
		}
	},
	"access": {
		get(){
			return config.developers.includes(this.id) ?
			'developer' : config.owners.includes(this.id) ?
			'owner' : this.guild.owner.id == this.id ?
			'guildowner' : 'everyone';
		}
	},
	"hasAccess": {
		value: function hasAccess(access){
			return config.accesses.get(this.access) >= config.accesses.get(access)
		}
	},
	"addCooldown": {
		value: function addCooldown(name, time){
			if(typeof name != 'string')throw new TypeError('cooldown name must be a string');
			if(typeof time != 'number')throw new TypeError('cooldown time must be a number');
			this.cooldowns.set(name, time);
			setTimeout(() => this.cooldowns.delete(name), time - Date.now());
		}
	},
	"isMuted": {
		get(){
			return this.db.muteTime > Date.now();
		}
	},
	"guildUnMute": {
		value: async function guildUnMute(){
			let role = this.guild.muteRole || await this.guild.createMuteRole();
			this.db.muteTime = null;
			this.removeRole(role.id);
			this.db.save();
		}
	},
	"guildMute": {
		value: async function guildMute(time){
			let role = this.guild.muteRole || await this.guild.createMuteRole();
			this.db.muteTime = Date.now() + time;
			if(!this.roles.has(role.id))this.addRole(role);
			setTimeout(() => this.guildUnMute(), time);
			this.db.save();
		}
	}
})