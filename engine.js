// Tedge Game Framework
//

var GUID_ID = 0;
function NewGUID() {
	return "T-" + (GUID_ID++);
}
var VGUID_ID = 0;
function NewVGUID() {
	return "V-" + (VGUID_ID++);
}

//
class Event 
{
	clientUsable() { return false; }
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}
//
class ClientEvent
{
	clientUsable() { return true; }
}
//
Event.dispatcher = null;
Event.isHost = false;
//
Event.bind = function (dispatch, isHost) {
	if (isHost) Event.isHost = true;
	Event.dispatcher = dispatch;
};

Event.dispatch = function (event) {
	if (Event.dispatcher && event && (Event.isHost || event.clientUsable())) {
		Event.dispatcher.dispatch(event);
	}
}
//

//
class Entity 
{
	constructor(name, volatile) 
	{
		this.volatile = volatile || false;
		this.type = "Entity";
		this.name = name || "entity";
		this.guid = (this.volatile ? NewVGUID() : NewGUID());
		this.parent = null;
		this.children = [];
		this.matrix = mat4.create();
		if (!this.volatile) {
			Entity.ENTITIES[this.guid] = this;
		}
	}

	update(dt) {
		this.applyChildren("update", [dt]);
	}

	render() {
		this.applyChildren("render", []);
	}

	remove() {
		if (this.parent) {
			var index = this.parent.children.indexOf(child);
			if (index >= 0) {
				this.parent.children.splice(index, 1);
			}
			this.parent = null;
		}
		if (!this.volatile) {
			Entity.ENTITIES[this.guid] = undefined;
		}
	}

	addChild(child) {
		if (this.children.indexOf(child) < 0) {
			this.children.push(child);
		}
		child.parent = this;
	}

	find(guid) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.guid === guid) {
				return child;
			}
		}

		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			var found = child.applyChildren('find', [guid]);
			if (found) return found;
		}

		return null;
	}

	findType(type) {
		var results = [];

		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.type === type) {
				results.push(child);
			}
		}

		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			results = results.concat(child.applyChildren('findType', [type]));
		}

		return results;
	}

	applyChildren(func, args) {
		for (var i = 0; i < this.children.length; i++) 
		{
			var child = this.children[i];
			if (child) {
				if (child[func]) {
					child[func].apply(child, args || []);
				}
				if (child.applyChildren) {
					child.applyChildren(func, args);
				}
			}
		}
	}
}
//
Entity.ENTITIES = [];

//
class Game 
{
	constructor() 
	{
		Event.bind(this);
	}

	dispatch(event) 
	{
	}
}

//
var tedge = {};
tedge.Entity = Entity;
tedge.Event = Event;
tedge.ClientEvent = ClientEvent;
tedge.Game = Game;

