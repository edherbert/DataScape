const structureManager = require('./StructureManager');

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

		let list = this.getDatabasesList();

		let found = false;
		for(t = 0; t < list.length; t++){
			if(list[t] == databaseName){
				list.splice(t, 1);
			}
		}

		this.setDatabasesList(list);
	},

	retrieveDatabase: function(databaseName){
		let retrieved = localStorage.getItem(databaseName);
		if(retrieved == null){
			console.log("Can't retrieve database " + databaseName + ".");
			return null;
		}else{
			return JSON.parse(retrieved);
		}
	},

	//Create a database and add it to the list
	createDatabase: function(title){
		let list = this.getDatabasesList();
		//if(typeof list == "undefined") list = [];
		list.push(title);

		this.setDatabasesList(list);

		let bareDatabase = {
			tables: [],
			connectors: []
		};
		this.storeDatabase(title, bareDatabase);
	},

	renameDatabase: function(oldName, newName){
		let oldDb = this.retrieveDatabase(oldName);
		let oldList = this.getDatabasesList();

		let found = false;
		for(t = 0; t < oldList.length; t++){
			if(oldList[t] == oldName){
				found = true;

				oldList[t] = newName;
				break;
			}
		}

		//Check to see if that database exists in the databases list as well as if it's key can be found.
		if(oldDb == null || !found){
			alert("Cannot rename database as that database does not exist.");
			return false;
		}else{
			console.log("Renaming " + oldName + " to " + newName + ".");
			this.setDatabasesList(oldList);

			localStorage.removeItem(oldName);
			this.storeDatabase(newName, oldDb);
		}
		return true;
	},

	setDatabasesList: function(list){
		localStorage.setItem("databasesList", JSON.stringify(list));
	},

	getDatabasesList: function(){
		let list = localStorage.getItem("databasesList");
		if(list == "" || list == null){
			list = [];
		}

		//If the list cannot be parsed then return an empty array.
		try{
			list = JSON.parse(list);
		}catch(e){
			list = [];
		}

		return list;
	},

	saveDatabaseStructure: function(dbName){
		this.storeDatabase(dbName, structureManager.getStructure());
	}
};

module.exports = new StorageManager();
