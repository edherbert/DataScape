

var Table = function (tableName){
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



if (typeof Module === 'undefined') {
	Module = {}
}
Module.exports = new Database
