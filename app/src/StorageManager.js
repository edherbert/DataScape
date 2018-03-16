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

		//Go through the list and remove the database if it's found
		let found = false;
		for(t = 0; t < list.length; t++){
			if(list[t] == databaseName){
				list.splice(t, 1);
			}
		}

		//Set the list without the database to the current one.
		this.setDatabasesList(list);
	},

	retrieveDatabase: function(databaseName){
		//Go through the database. If it's found then return it.
		let retrieved = localStorage.getItem(databaseName);
		if(retrieved == null){
			console.log("Can't retrieve database " + databaseName + ".");
			return null;
		}else{
			//Return the database as a json.
			return JSON.parse(retrieved);
		}
	},

	//Create a database and add it to the list
	createDatabase: function(title){
		let list = this.getDatabasesList();
		list.push(title);
		//Push the new database's title to the list.
		this.setDatabasesList(list);

		//Create a database in storage.
		let bareDatabase = {
			tables: [],
			connectors: []
		};
		this.storeDatabase(title, bareDatabase);
	},

	renameDatabase: function(oldName, newName){
		//Renaming involves removing the old one and creating a new one.
		let oldDb = this.retrieveDatabase(oldName);
		let oldList = this.getDatabasesList();

		let found = false;
		for(t = 0; t < oldList.length; t++){
			if(oldList[t] == oldName){
				if(newName.match("^[a-zA-Z1-9_]+$")){
					found = true;

					//Set the new name over the old one if the new name contains no illegal characters.
					oldList[t] = newName;
				}
				break;
			}
		}

		//Check to see if that database exists in the databases list as well as if it's key can be found.
		if(oldDb == null || !found){
			alert("Cannot rename database as that database either does not exist, or contains illegal characters.");
			return false;
		}else{
			console.log("Renaming " + oldName + " to " + newName + ".");
			this.setDatabasesList(oldList);

			//Remove the old one and store the new one.
			localStorage.removeItem(oldName);
			this.storeDatabase(newName, oldDb);
		}
		return true;
	},

	setDatabasesList: function(list){
		//Set the list of database titles.
		localStorage.setItem("databasesList", JSON.stringify(list));
	},

	getDatabasesList: function(){
		//Return the list of databases from storage.
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
