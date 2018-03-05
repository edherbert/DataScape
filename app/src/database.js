

/*var Database = {
	table: function (tableName) {
		var table = Object.create(Table)
		table.name = tableName
		return table
	}
}
*/
/*
var Table = {
	name: '',
	insert: function(record) {
		var currentData = this.get()
		currentData.record.push(record)
		localStorage.setItem(this.name, JSON.stringify(currentData))
	},
	get: function () {
		var a = localStorage.getItem(this.name)
		if (a == null) {
			return {record : []}
		}
		return JSON.parse(a)
	},
	remove: function (id) {
		var currentData = this.get()
		currentData.record.splice(id)
		localStorage.setItem(this.name, JSON.stringify(currentData))
	}
}
*/



var Database = function (){

}

Database.prototype.table = function (tableName) {
	//var table = Object.create(Table)
	var table = new Table(tableName)
	//table.name = tableName
	return table
}





var Table = function (tableName){
	// constructor
	this.name = tableName
}

Table.prototype.insert = function (record) {
	var currentData = this.get()
	currentData.record.push(record)
	localStorage.setItem(this.name, JSON.stringify(currentData))
}

Table.prototype.get = function () {
	var a = localStorage.getItem(this.name)
	if (a == null) {
		return {record : []}
	}
	return JSON.parse(a)
}

Table.prototype.remove = function (id) {
	var currentData = this.get()
	currentData.record.splice(id)
	localStorage.setItem(this.name, JSON.stringify(currentData))
}


//Module = Module ? {} : Module
if (typeof Module === 'undefined') {
	Module = {}
}
Module.exports = new Database
