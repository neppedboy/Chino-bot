const path = require('path');
const fs = require('fs');
const { Collection } = require('discord.js')
class Json{
	constructor({ cwd } = {}){
		if(typeof cwd != 'string')throw new TypeError('property \'cwd\' must be a String');
		
		if(!fs.existsSync(cwd)) fs.writeFileSync(cwd, '[]');
		let file = fs.readFileSync(cwd, 'utf8');
		this.data = !file.length ? (fs.writeFileSync(cwd, '[]'), new Collection()) : new Collection(JSON.parse(file));
		this.cwd = cwd;
	}
	save(k, v){
		if(this.has(k)) this.data.set(k, v);
		fs.writeFileSync(this.cwd, JSON.stringify([...this.data.entries()], null, 2));
	}
	has(k){
		return this.data.has(k)
	}
	get(k){
		return this.data.get(k)
	}
	add(k, v){
		this.data.set(k, v);
		this.save();
	}
	remove(k){
		this.data.delete(k);
		this.save();
	}
	
}
module.exports = Json