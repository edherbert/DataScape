var StorageManager = function (){

}

StorageManager.prototype = {
	//Create or override an existing database.
	//This will not add it to the list.
	storeDatabase: function(title, database){
		localStorage.setItem(title, JSON.stringify(database));
		console.log("Storing database " + title);
	},

	removeDatabase: function(databaseName){
		localStorage.removeItem(databaseName);
	},

	retrieveDatabase: function(databaseName){
		return JSON.parse(localStorage.getItem(databaseName));
	},

	//Create a database and add it to the list
	createDatabase: function(title){
		let list = this.getDatabasesList();
		//if(typeof list == "undefined") list = [];
		list.push(title);

		this.setDatabasesList(list);

		this.storeDatabase(title, {});
	},

	setDatabasesList: function(list){
		localStorage.setItem("databasesList", JSON.stringify(list));
	},

	getDatabasesList: function(){
		let list = localStorage.getItem("databasesList");
		if(list == "" || list == null) list = [];

		return JSON.parse(list);
	}
};

module.exports = new StorageManager();
