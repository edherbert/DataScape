(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
document.addEventListener('DOMContentLoaded', function() {
  //Setup and things
  require("src/Main");
});

});

require.register("src/DataGenerator/DataGenerator.js", function(exports, require, module) {
const TableParser = require('./TableParser');
const FieldGenerator = require('./FieldGenerator');
const TableLinker = require('./TableLinker');
const structureManager = require('../StructureManager');
const GeneratedDataPopup = require('../pages/GeneratedDataPopup');

function DataGenerator(pageManager){
  //Create new instances of the individual parts of the data generator.
  this.tableParser = new TableParser();
  this.fieldGenerator = new FieldGenerator();
  this.tableLinker = new TableLinker();
  this.generatedDataPopup = new GeneratedDataPopup();
  this.pageManager = pageManager;
}

DataGenerator.prototype = {
  constructor: DataGenerator,

  generateData: function(pageManager){
    //Pass the outputted data through the stages of the generator until the finished version is reached.
    let currentStructure = structureManager.getStructure();

    let parsedTables = this.tableParser.parseStructure(currentStructure);

    let generatedData = this.fieldGenerator.generateData(parsedTables);

    let linkedTables = this.tableLinker.linkTables(generatedData);

    return linkedTables;
  }
};

module.exports = DataGenerator;

});

require.register("src/DataGenerator/FieldGenerator.js", function(exports, require, module) {
const typeManager = require('../TypeManager/TypeManager');

function FieldGenerator(){

}

FieldGenerator.prototype = {
  generateData: function(parsedTables){
    //Go through each table and generate it's data

    for(t = 0; t < parsedTables.tables.length; t++){
      parsedTables.tables[t].data = [];

      //Traverse the list by types, rather than tables.
      //This will avoid having to jump around through memory as all the types can be batched together.
      for(f = 0; f < parsedTables.tables[t].typeOrder.length; f++){
        //Store the type so the lookup only has to happen once.
        let type = typeManager.getFieldType(parsedTables.tables[t].typeOrder[f]);
        //Generate it for the required ammount
        for(y = 0; y < parsedTables.tables[t].requiredAmmount; y++){
          //Generate the data.
          parsedTables.tables[t].data[y] = type.generate(parsedTables.tables[t].data[y]);
        }
      }
    }

    return parsedTables;
  }
};

module.exports = FieldGenerator;

});

require.register("src/DataGenerator/TableLinker.js", function(exports, require, module) {
function TableLinker(){

}

TableLinker.prototype = {
  linkTables: function(previous){
    for(t = 0; t < previous.tables.length; t++){
      //Go through all tables are create an intermediate place to store the finished data.
      previous.tables[t].done = [];
      //Go through the tables for the ammount of data that would be generated.
      for(i = 0; i < previous.tables[t].requiredAmmount; i++){
        //Temporary place to store the data before it's pushed.
        let temp = {};

        //Go over all the types in the table.
        for(x = 0; x < previous.tables[t].types.length; x++){
          let fieldType = previous.tables[t].types[x].fieldType;
          //If the value is a foreign key then assign it a value between the bounds.
          if(fieldType == "Foreign Key"){
            //Get the table that the foreign key references and get it's size.
            //Then generate a random number between that. This will be used as the foreign key.

            //temp[previous.tables[t].types[x].fieldName] = Math.floor(Math.random() * randomAmmount);
          }else{
            //Assign temp the generated value under it's desired name.
            //If a table has the same name for a field twice this will make it only appear once.
            temp[previous.tables[t].types[x].fieldName] = previous.tables[t].data[i][fieldType];
          }
        }
        //Push the new value into the json.
        previous.tables[t].done.push(temp);
      }
      //At this point the generated data can be deleted to conserve memory.
      delete previous.tables[t].data;
    }

    return previous;
  }
};

module.exports = TableLinker;

});

require.register("src/DataGenerator/TableParser.js", function(exports, require, module) {
const typeManager = require('../TypeManager/TypeManager');

function TableParser(){

}

TableParser.prototype = {
  constructor: TableParser,

  parseStructure: function(structure){
    for(t = 0; t < structure.tables.length; t++){
      requirements = [];
      //Go through the tables and make a list of the requirements.
      for(i = 0; i < structure.tables[t].types.length; i++){
        //Push as a string.
        requirements.push(""+structure.tables[t].types[i].fieldType);
      }

      for(i = 0; i < requirements.length; i++){
        //If the requirement is a normal field type (not a foreign Key).
        if(requirements[i] != "Foreign Key"){
          if(!this.checkIfListed(requirements[i])){
            //Go through the requirements and add them to the list.
            this.traverseRequirements(requirements[i]);
            this.done.push(requirements[i]);
          }
        }
      }

      structure.tables[t].typeOrder = this.done;

      //Reset the done list after use.
      this.done = [];
    }
    return structure;
  },
  done: [],

  traverseRequirements: function(requirements){
    //Recursively search the requirement tree until the leaf nodes are found.
    var newRequirements = typeManager.getRequirements(requirements);
    //Determine if there are any requirements to traverse.
    if(newRequirements.length <= 0){
      //console.log("Empty");
    }else{
      for(y = 0; y < newRequirements.length; y++){
        //Go through them. Check if any of them are undefined (null)
        if(newRequirements[y] == undefined) {
          console.log("undefined in the table parser.");
          continue;
        }
        //If it's not already in the list then add it.
        //If it's already in the list then don't bother traversing it either.
        if(!this.checkIfListed(newRequirements[y])){
          this.traverseRequirements(newRequirements[y]);
          this.done.push(newRequirements[y]);
        }
      }
    }
  },

  //Check if a requirement exists in the done list.
  checkIfListed: function(val){
    var exists = false;
    for(z = 0; z < this.done.length; z++){
      if(val == this.done[z]){
        exists = true;
        break;
      }
    }

    return exists;
  }
};

module.exports = TableParser;

});

require.register("src/FieldType.js", function(exports, require, module) {
function FieldType(){

}

FieldType.prototype = {
	Requirements: [],

	Generate: function(previous){
		return previous;
}
};

module.exports = FieldType;

});

require.register("src/Main.js", function(exports, require, module) {
const pageManager = require("./pages/PageManager");
const dataGenerator = require("./DataGenerator/DataGenerator")

//Start by showing the database selection view.
pageManager.showDatabaseSelectionView();

});

require.register("src/StorageManager.js", function(exports, require, module) {
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

});

require.register("src/StructureManager.js", function(exports, require, module) {
function StructureManager(){
  this.structure = {};
}

StructureManager.prototype = {
  constructor: StructureManager,

  getStructure: function(){
    return this.structure
  },

  setStructure: function(s){
    this.structure = s;
  },

  getTableIndexById: function(id){
    //Get the table's array index from it's mxid.
    for(t = 0; t < this.structure.tables.length; t++){
      if(this.structure.tables[t].tableId == id){
        return t;
      }
    }
  },

  getTableById: function(id){
    //Return the table json by id.
    return this.structure.tables[this.getTableIndexById(id)];
  },

  replaceTable: function(id, table){
    //Override the table data with new data.
    this.structure.tables[this.getTableIndexById(id)] = table;
  },

  setTableTitle: function(id, title){
    this.structure.tables[this.getTableIndexById(id)].title = title;
  },

  setTableTypes: function(id, types){
    //Set the list of field types to use in this table.
    this.structure.tables[this.getTableIndexById(id)].types = types;
  },

  pushTable: function(table){
    //Add a new table json to the list.
    this.structure.tables.push(table);
  },

  setTablePosition: function(id, x, y){
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables[tableIndex].x = x;
    this.structure.tables[tableIndex].y = y;
  },

  setTableSize: function(id, width, height){
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables[tableIndex].width = width;
    this.structure.tables[tableIndex].height = height;
  },

  removeTable: function(id){
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables.splice(tableIndex, 1);
  },

  addEdge: function(source, target){
    //Create a new edge and add it to the list.
    let newEdge = {originTable: 0, destinationTable: 0, type: "One to many"};
    newEdge.originTable = this.getTableIndexById(source);
    newEdge.destinationTable = this.getTableIndexById(target);

    this.structure.connectors.push(newEdge);
  }
};

module.exports = new StructureManager();

});

require.register("src/TypeManager/FieldType.js", function(exports, require, module) {
function FieldType(){

}

FieldType.prototype = {
	Requirements: [],

	generate: function(previous){
		return previous;
}
};

module.exports = FieldType;

});

require.register("src/TypeManager/TypeManager.js", function(exports, require, module) {
const TestType = require('./types/TestType');
const FirstNameType = require('./types/FirstNameType');
const SecondNameType = require('./types/SecondNameType');
const GenderType = require('./types/GenderType');
const PostcodeType = require('./types/PostcodeType');
const RandomColourType = require('./types/RandomColourType'); //Reference/including from another class
const BooleanType = require('./types/BooleanType');
const EmailType = require('./types/EmailType');
const PhoneNumberType = require('./types/PhoneNumberType');
const TitleType = require('./types/TitleType');
const AgeType = require('./types/AgeType');
const CityType = require('./types/CityType');
const BornCountry = require('./types/BornCountry');
const ReligionType = require('./types/ReligionType');
const CountyType = require('./types/CountyType');
const CurrencyType = require('./types/CurrencyType');
const ShirtSizeType = require('./types/ShirtSizeType');
const MovieTitleType = require('./types/MovieTitleType');
const JobType = require('./types/JobType');
const LanguageType = require('./types/LanguageType');

function TypeManager(){
  //Create a new instance of each type.
  this.testType = new TestType();
  this.firstNameType = new FirstNameType();
  this.secondNameType = new SecondNameType();
  this.genderType = new GenderType();
  this.postcodeType = new PostcodeType();
  this.randomColourType = new RandomColourType();
  this.booleanType = new BooleanType();
  this.emailType = new EmailType();
  this.phoneNumberType = new PhoneNumberType();
  this.titleType = new TitleType();
  this.ageType = new AgeType();
  this.cityType = new CityType();
  this.bornCountryType = new BornCountry();
  this.religionType = new ReligionType();
  this.countyType = new CountyType();
  this.jobType = new JobType();
  this.currencyType = new CurrencyType();
  this.shirtSizeType = new ShirtSizeType();
  this.movieTitleType = new MovieTitleType();
  this.languageType = new LanguageType();

  //List the types so they can be retrieved later.
  this.typeNames = ["First Name", "Second Name", "Gender", "Postcode", "Random Colour", "Boolean", "Email",
  "Phone Number", "Title", "Age", "City", "Born Country", "Religion", "County",  "Shirt Size", "Movie Title", "Currency",
  "Job", "Language"
  ];
}

TypeManager.prototype = {
  getFieldType: function(fieldTypeName){
      switch(fieldTypeName){
        case "TestType":
          return this.testType;
          break;
        case "First Name":
          return this.firstNameType;
          break;
        case "Second Name":
          return this.secondNameType;
          break;
        case "Gender":
          return this.genderType;
          break;
        case "Postcode":
          return this.postcodeType;
          break;
		    case "Random Colour":
		      return this.randomColourType;
		      break;
		    case "Boolean":
			    return this.booleanType;
			    break;
        case "Email":
  			  return this.emailType;
  			  break;
        case "Phone Number":
          return this.phoneNumberType;
          break;
        case "Title":
  			  return this.titleType;
  			  break;
        case "Age":
          return this.ageType;
          break;
        case "City":
          return this.cityType;
          break;
        case "Born Country":
          return this.bornCountryType;
          break;
        case "Religion":
          return this.religionType;
          break;
        case "County":
          return this.countyType;
          break;
        case "Shirt Size":
          return this.shirtSizeType;
          break;
        case "Movie Title":
          return this.movieTitleType;
          break;
      	case "Currency":
          return this.currencyType;
          break;
      	case "Job":
          return this.jobType;
          break;
      	case "Language":
          return this.languageType;
          break;
        default:
          console.log("No type was found for " + fieldTypeName);
          break;
      }
  },

  getRequirements: function(fieldTypeName){
    return this.getFieldType(fieldTypeName).Requirements;
  },

  getTypesList: function(){
    return this.typeNames;
  }
};

module.exports = new TypeManager;

});

require.register("src/TypeManager/types/AgeType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function AgeType(){
}

AgeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: AgeType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = String(Math.floor(Math.random() * 60) + 15)
    current.Age = target;

    return current;
  }
});

module.exports = AgeType;

});

require.register("src/TypeManager/types/BooleanType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function BooleanType(){
}

BooleanType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: BooleanType,

  generate: function(previous){

	let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(Math.random() * 2 <= 1){
      target = "true";
    }else{
      target = "false";
    }
    current.Boolean = target;

    return current;
  }
});

module.exports = BooleanType;

});

require.register("src/TypeManager/types/BornCountry.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function CountryType(){
  this.country = ['England', 'Scoland', 'Ireland', 'Poland', 'India', 'Pakistan', 'Germany', 'South Africa', 'United State', 'Australia', 'China'];
}

CountryType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CountryType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.country[Math.floor(Math.random() * this.country.length)]
    current['Born Country'] = target;

    return current;
  }
});

module.exports = CountryType;

});

require.register("src/TypeManager/types/CityType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function CityType(){
  this.cities = ['Reading', 'London', 'Oxford', 'Cambridge', 'Portsmouth', 'Exeter', 'Plymouth', 'Brighton', 'Blackpool', 'Birmingham', 'Tiverton', 'Aberdeen', 'Swansea', 'Cardiff', 'Dorchester'];
}

CityType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CityType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.cities[Math.floor(Math.random() * this.cities.length)]
    current.City = target;

    return current;
  }
});

module.exports = CityType;

});

require.register("src/TypeManager/types/CountyType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function CountyType(){
  //this.cities = ['Reading', 'London', 'Oxford', 'Cambridge', 'Portsmouth', 'Exeter', 'Plymouth', 'Brighton', 'Blackpool', 'Birmingham', 'Tiverton', 'Aberdeen', 'Swansea', 'Cardiff', 'Dorchester'];
}

CountyType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CountyType,

  Requirements: ["City"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let city = previous.City;
    let target = "null";

    if (city == "Reading"){
      target = "Berkshire";
    }else if (city == "London") {
      target = "Greater London";
    }else if (city == "Oxford") {
      target = "Oxfordshire";
    }else if (city == "Cambridge") {
      target = "Cambridgeshire";
    }else if (city == "Portsmouth") {
      target = "Hampshire";
    }else if (city == "Plymouth" || city == "Exeter" || city == "Tiverton") {
      target = "Devon";
    }else if (city == "Brighton") {
      target = "East Sussex";
    }else if (city == "Blackpool") {
      target = "Lancashire";
    }else if (city == "Birmingham") {
      target = "Warwickshire";
    }else if (city == "Aberdeen") {
      target = "Aberdeenshire";
    }else if (city == "Swansea") {
      target = "West Glamorgan";
    }else if (city == "Cardiff") {
      target = "South Glamorgan";
    }else if (city == "Dorchester") {
      target = "Dorset";
    }

    current.County = target;

    return current;
  }
});

module.exports = CountyType;

});

require.register("src/TypeManager/types/CurrencyType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function CurrencyType(){
  this.currency = ['Baht', 'US Dollar', 'Yen', 'Korean Won', 'Pound', 'Euro', 'Rupee', 'Yuan'];
}

CurrencyType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CurrencyType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.currency[Math.floor(Math.random() * this.currency.length)]
    current.Currency = target;

    return current;
  }
});

module.exports = CurrencyType;

});

require.register("src/TypeManager/types/EmailType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function EmailType(){
	this.emailService = ['@gmail', '@yahoo', '@hotmail', '@outlook'];
  this.emailEnding = ['.com', '.co.uk'];
}

EmailType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: EmailType,

  Requirements: ["First Name", "Second Name"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let targetService = this.emailService[Math.floor(Math.random() * this.emailService.length)];
    let targetEnding = this.emailEnding[Math.floor(Math.random() * this.emailEnding.length)];
		//let anEmail = previous['First Name'] + previous.SecondName + this.targetService + this.targetEnding;
		let anEmail = previous['First Name'] + previous['Second Name'] + targetService + targetEnding;
    current.Email = anEmail;

    return current;
  }
});

module.exports = EmailType;

});

require.register("src/TypeManager/types/FirstNameType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function FirstNameType(){
  this.maleNames = ['Liam', 'Jacob', 'William', 'Ethan', 'Nathan', 'James', 'Alex'];
  this.femaleNames = ['Emma', 'Olivia', 'Sophie', 'Isabella', 'Abigail', 'Emily', 'Elizabeth', 'Ella', 'Shasdane'];
}

FirstNameType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: FirstNameType,

  Requirements: ["Gender"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(previous.Gender == "Male"){
      target = this.maleNames[Math.floor(Math.random() * this.maleNames.length)];
    }else{
      target = this.femaleNames[Math.floor(Math.random() * this.femaleNames.length)];
    }
    current['First Name'] = target;

    return current;
  }
});

module.exports = FirstNameType;

});

require.register("src/TypeManager/types/GenderType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function GenderType(){

}

GenderType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: GenderType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(Math.random() * 2 <= 1){
      target = "Male";
    }else{
      target = "Female";
    }
    current.Gender = target;

    return current;
  }
});

module.exports = GenderType;

});

require.register("src/TypeManager/types/JobType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function JobType(){
  this.jobs = [
  'Teacher', 
  'Doctor', 
  'Nurse', 
  'Designer', 
  'Web Developer', 
  'Sale', 
  'Product Engineer', 
  'Programmer',
  'Police'
  ];
}

JobType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: JobType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.jobs[Math.floor(Math.random() * this.jobs.length)]
    current.Job = target;

    return current;
  }
});

module.exports = JobType;

});

require.register("src/TypeManager/types/LanguageType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function LanguageType(){
  this.languages = ['Thai', 'English', 'Chinese', 'Korean', 'Japanese', 'French'];
}

LanguageType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: LanguageType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.languages[Math.floor(Math.random() * this.languages.length)];
    current.Language = target;

    return current;
  }
});

module.exports = LanguageType;

});

require.register("src/TypeManager/types/MovieTitleType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function MovieTitleType(){
  this.movieTitles = [
  'Harry Potter and the Deadly Hollow Part 2',
  'Black Panther',
  'Final Destination 1',
  'Jumanji',
  'Jurasic World',
  'Pasific Rim',
  'Transformers: The Last Knight',
  'X-Men Apocalype'
  ];
}

MovieTitleType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: MovieTitleType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let title = this.movieTitles[Math.floor(Math.random() * this.movieTitles.length)];
    current['Movie Title'] = title;

    return current;
  }
});

module.exports = MovieTitleType;

});

require.register("src/TypeManager/types/PhoneNumberType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function PhoneNumberType(){
}

PhoneNumberType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PhoneNumberType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = String(Math.floor(Math.random() * 1000000000) + 9999999999)
    current['Phone Number'] = "+44" + target;

    return current;
  }
});

module.exports = PhoneNumberType;

});

require.register("src/TypeManager/types/PostcodeType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function PostcodeType(){
    this.characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
}

PostcodeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PostcodeType,

  Requirements: ["City"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    let cityCode = previous.City.substring(0,2).toUpperCase();
    let randChar = this.characters[Math.floor(Math.random() * this.characters.length)];
    let randChars = randChar + randChar;
    let randNum = String(Math.floor(Math.random() * 9))

    target = cityCode + randNum + " " + randNum + randChars;

    current.Postcode = target;
    return current;
  }
});

module.exports = PostcodeType;

});

require.register("src/TypeManager/types/RandomColourType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function RandomColourType(){
	this.colour = ['Red', 'Yellow', 'Pink', 'Green'];
}

RandomColourType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: RandomColourType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.colour[Math.floor(Math.random() * this.colour.length)];

    current['Random Colour'] = target;
    return current;
  }
});

module.exports = RandomColourType;

// reference CMD for errors as it keeps a record of the changes made

});

;require.register("src/TypeManager/types/ReligionType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function ReligionType(){
  this.religions = ['Nonreligious', 'Prefer not to say', 'Christianity - Protestant', 'Christianity - Catholic', 'Islam', 'Hinduism', 'Chinese Traditional', 'Buddhism', 'Sikhism', 'Judaism', 'Shinto'];
}

ReligionType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: ReligionType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.religions[Math.floor(Math.random() * this.religions.length)]
    current.Religion = target;

    return current;
  }
});

module.exports = ReligionType;

});

require.register("src/TypeManager/types/SecondNameType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function SecondNameType(){
  this.secondNames = ['Jones', 'Taylor', 'Williams', 'Brown', 'Smith', 'Evans', 'Thomas', 'Wood'];
}

SecondNameType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: SecondNameType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let secondName = this.secondNames[Math.floor(Math.random() * this.secondNames.length)];
    current['Second Name'] = secondName;

    return current;
  }
});

module.exports = SecondNameType;

});

require.register("src/TypeManager/types/ShirtSizeType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function ShirtSizeType(){
  this.shirtSizes = ['3S', '2S', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
}

ShirtSizeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: ShirtSizeType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.shirtSizes[Math.floor(Math.random() * this.shirtSizes.length)]
    current['Shirt Size'] = target;

    return current;
  }
});

module.exports = ShirtSizeType;

});

require.register("src/TypeManager/types/TestType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function TestType(){

}

TestType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: TestType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};
    current.Test = "This is a test";

    return current;
  }
});

module.exports = TestType;

});

require.register("src/TypeManager/types/TitleType.js", function(exports, require, module) {
const FieldType = require("../FieldType");

function TitleType(){
  this.maleTitles = ['Mr'];
  this.femaleTitles = ['Miss', 'Ms', 'Mrs'];
  this.uncommonTitlesMale = ['Dr', 'Sir'];
  this.uncommonTitlesFemale = ['Dr'];
}

TitleType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: TitleType,

  Requirements: ["Gender"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target;
    if(previous.Gender == "Male"){
      if(Math.floor(Math.random()*9) == 5){
        target = this.uncommonTitlesMale[Math.floor(Math.random() * this.uncommonTitlesMale.length)];
      }
      else{
        target = this.maleTitles[Math.floor(Math.random() * this.maleTitles.length)];
      }
    }else{
      if(Math.floor(Math.random()*9) == 5){
        target = this.uncommonTitlesFemale[Math.floor(Math.random() * this.uncommonTitlesFemale.length)];
      }
      else{
        target = this.femaleTitles[Math.floor(Math.random() * this.femaleTitles.length)];
      }
    }
    current.Title = target;

    return current;
  }
});

module.exports = TitleType;

});

require.register("src/pages/ConfirmDeletePopup.js", function(exports, require, module) {
const View = require('./View');
const Popup = require('./Popup');
const storageManager = require('../StorageManager');

function ConfirmDeletePopup(dbId, dbContainer){
  this.setup(dbId, dbContainer);
}

ConfirmDeletePopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: ConfirmDeletePopup,

  speed: 0.4,

  setup: function(dbId, dbContainer){
    Popup.prototype.setup.call(this);


    this.dbContainer = dbContainer
    this.confirmMessage = document.createElement('div');
    this.confirmMessage.innerHTML = "Are you sure you want to delete the " + dbId + " database?";

    this.confirmButton = document.createElement('div');
    this.confirmButton.id = "acceptDbButton";
    this.confirmButton.innerHTML = "Yes";

    this.cancelButton = document.createElement('div');
    this.cancelButton.id = "declineDbButton";
    this.cancelButton.innerHTML = "No";


    let that = this;
    this.confirmButton.onclick = function(e){
      //Actually delete the database.
      storageManager.removeDatabase(that.dbId);
      //Remove the child from the list
      that.dbContainer.parentElement.removeChild(that.dbContainer);
      that.popout();
    }

    this.cancelButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(this.confirmMessage);
    this.backgroundView.append(this.confirmButton);
    this.backgroundView.append(this.cancelButton);
  },

  popup: function(dbId, dbContainer){
    Popup.prototype.popup.call(this);
    this.dbId = dbId;
    this.dbContainer = dbContainer;

    this.confirmMessage.innerHTML = "Are you sure you want to delete the " + this.dbId + " database?";
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = ConfirmDeletePopup;

});

require.register("src/pages/DatabaseCreationPopup.js", function(exports, require, module) {
const View = require('./View');
const databaseEditPopup = require('./DatabaseEditPopup');
const storageManager = require('../StorageManager');
const Popup = require('./Popup');

function DatabaseCreationPopup(pageManager){
  this.pageManager = pageManager;
  this.setup();
}

DatabaseCreationPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseCreationPopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "What should the database be called?";

    this.databaseTitleInput = document.createElement('input');
    this.databaseTitleInput.id = "dbInput";

    let acceptDbButton = document.createElement('div');
    acceptDbButton.id = "acceptDbButton";
    acceptDbButton.innerHTML = "Confirm";

    let declineDbButton = document.createElement('div');
    declineDbButton.id = "declineDbButton";
    declineDbButton.innerHTML = "Cancel";

    let that = this;
    acceptDbButton.onclick = function(e){
      //Do a regex function to check if the title is valid.
      if(that.databaseTitleInput.value.match("^[a-zA-Z1-9_]+$")){
        //Add it to the list.
        that.dbSelectionView.addToList(that.databaseTitleInput.value);
        //Create the database in storage
        storageManager.createDatabase(that.databaseTitleInput.value);
        that.popout();
      }else{
        alert("Enter valid characters only please. Characters must be between a-z and A-Z.");
        that.popout();
      }
    }

    declineDbButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(acceptDbButton);
    this.backgroundView.append(declineDbButton);
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = DatabaseCreationPopup;

});

require.register("src/pages/DatabaseEditPopup.js", function(exports, require, module) {
const Popup = require('./Popup');
const storageManager = require('../StorageManager');
const ConfirmDeletePopup = require('./ConfirmDeletePopup');
//const pageManager = require('./PageManager');

function DatabaseEditPopup(pageManager){
  this.setup(pageManager);
}

DatabaseEditPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseEditPopup,

  speed: 0.4,

  setup: function(pageManager){
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "Database Title:";

    this.databaseTitleInput = document.createElement('input');
    this.databaseTitleInput.value = "";

    let deleteDatabaseButton = document.createElement('div');
    deleteDatabaseButton.id = "deleteDbButton";
    deleteDatabaseButton.innerHTML = "Delete Database";

    let that = this;
    deleteDatabaseButton.onclick = function(e){
      pageManager.popupConfirmDelete(that.dbId, that.dbContainer);
      that.popout();
    }

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(document.createElement('hr'));
    this.backgroundView.append(deleteDatabaseButton);
  },

  popup: function(dbId, dbContainer){
    Popup.prototype.popup.call(this);

    //Make the title's input equal to the database name.
    this.databaseTitleInput.value = dbId;

    //Store these values for later.
    this.dbId = dbId;
    this.dbContainer = dbContainer;
  },

  backgroundPressed: function(){
    this.popout();

    //If the storage manager can correctly update the database then rename it in the graphcs.
    if(storageManager.renameDatabase(this.dbId, this.databaseTitleInput.value)){
        this.dbContainer.innerHTML = this.databaseTitleInput.value;
    }
  }
});

module.exports = DatabaseEditPopup;

});

require.register("src/pages/DatabaseSelectionView.js", function(exports, require, module) {
const View = require('./View');
const storageManager = require('../StorageManager');
const DatabaseCreationPopup = require('./DatabaseCreationPopup');

function DatabaseSelectionView(pageManager){
  this.pageManager = pageManager;
  this.container = document.getElementById("dataBaseSelectionView");

  //Create the list that'll contain the databases.
  this.list = document.createElement('ul');

  document.getElementById("dataBaseSelectionView").append(this.list);
  document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);

  this.updateList();
}

DatabaseSelectionView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: DatabaseSelectionView,

  createDatabase: function(){
    this.pageManager.popupDatabaseCreation(this);
  },

  addToList: function(dbTitle){
    let newDb = document.createElement('div');
    newDb.className = "DBEntry";
    newDb.innerHTML = dbTitle;

    let editDb = document.createElement('img');
    editDb.className = "DbEditButton";
    editDb.src = "test.png";

    let that = this;
    editDb.onclick = function(e){
      //Get a reference to the list container and pass it into the popup
      let dbContainer = e.target.parentElement.childNodes[0];

      that.pageManager.popupDatabaseEdit(dbContainer.innerHTML, dbContainer);
    }

    //Add a callback for when the button is clicked.
    newDb.onclick = this.databaseSelected.bind(this);

    let listItem = document.createElement('li');
    listItem.className = "DbSelectionList"
    listItem.append(newDb);

    listItem.append(editDb);

    this.list.appendChild(listItem);
  },

  databaseSelected: function(e){
    this.pageManager.showDiagramView(e.target.innerHTML);
  },

  updateList: function(){
    //Add the contents of the storage manager to the list
    let list = storageManager.getDatabasesList();

    for(t = 0; t < list.length; t++){
      this.addToList(list[t]);
    }
  }
});

module.exports = DatabaseSelectionView;

});

require.register("src/pages/DiagramView.js", function(exports, require, module) {
const View = require('./View');
const dataGenerator = require('../DataGenerator/DataGenerator')
const structureManager = require('../StructureManager')
const storageManager = require('../StorageManager')

function DiagramView(pageManager){
  this.container = document.getElementById("DiagramView");
  this.pageManager = pageManager;

  this.saveButton = document.getElementById("saveDatabaseButton");

  document.getElementById("createTableButton").onclick = this.createTableButton.bind(this);
  document.getElementById("returnToSelectionButton").onclick = this.returnToSelection.bind(this);
  document.getElementById("generateDataButton").onclick = this.generateDataButtonPressed.bind(this);
  this.saveButton.onclick = this.saveDatabasePressed.bind(this);

  this.setupMxGraph();
}

constructor: DiagramView,
DiagramView.prototype = Object.assign(Object.create(View.prototype), {
  //Used to determine whether the diagram should react to insertions and deletions or not.
  //If the diagram is being loaded then this would be set to false.
  ready: false,

  currentDbName: "",

  setupMxGraph: function(){
    //The image that appears when mousing over a table.
		mxConnectionHandler.prototype.connectImage = new mxImage('connector.gif', 16, 16);
    //Create the graph
    this.graph = new mxGraph(document.getElementById("DiagramContainer"));
    //Can the graph contain connectors (edges)
    this.graph.setConnectable(true);
    //Enable rubber band selection.
    this.rubberband = new mxRubberband(this.graph);
    //Store a reference to the parent. This is sort of like the root element.
    var parent = this.graph.getDefaultParent();

    //Allow cells to contain html tags.
    //These will then be interpreted as html, rather than as a label.
    this.graph.setHtmlLabels(true);
    //Don't create edges unless they're attached to something
    this.graph.setAllowDanglingEdges(false);

    //Styles for the table
    var tableStyle = new Object();
    //Hard edges
    tableStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    tableStyle[mxConstants.STYLE_OPACITY] = 0;
    //Allow the table to fill the entire thing.
    tableStyle[mxConstants.STYLE_OVERFLOW] = 'fill';
    //Don't let the user change the label.
    tableStyle[mxConstants.STYLE_EDITABLE] = 0;
    //Register this style in the stylesheet
    this.graph.getStylesheet().putCellStyle('TABLE_STYLE',tableStyle);

    //Same for edges
    var edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
    //Hard edges
    edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    edgeStyle[mxConstants.STYLE_EDGE] = "elbowEdgeStyle";
    edgeStyle[mxConstants.STYLE_STROKECOLOR] = "black";
    this.graph.getStylesheet().putCellStyle('EDGE_STYLE',edgeStyle);

    this.addCallbacks();
  },

  addCallbacks: function(){
    var that = this;
    var keyHandler = new mxKeyHandler(this.graph);
    //46 is the delete key.
    keyHandler.bindKey(46, function(evt)
    {
      if (that.graph.isEnabled())
      {
        //Remove the selected cells.
        that.graph.removeCells();
      }
    });

    //Double click to bring up the table editor popup.
    this.graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
      	var cell = evt.getProperty('cell');
        if(cell!=null && !cell.edge){
          that.pageManager.popupTableEditorView(cell.getId());
        }
    });

    this.graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt){
      console.log("Cell Added");
      //Change the colour of the save button.
      that.dirtySaveButton();

      if(evt.properties.cells[0].edge && that.ready){
        let edge = evt.properties.cells[0];
        //The added cell is an edge, so add it to the structure manager.
        //You don't have to do this for the tables as they are added on the button press.
        structureManager.addEdge(edge.source.id, edge.target.id);
      }
    });

    this.graph.addListener(mxEvent.CELLS_MOVED, function(sender, evt){
      console.log("Cell Moved");
      that.dirtySaveButton();

      for(t = 0; t < evt.properties.cells.length; t++){
        //Don't do anything if an edge is moved, as their position is dependant on the tables they're connected to.
        if(evt.properties.cells[t].edge) continue;

        //Register the move with the structure manager.
        structureManager.setTablePosition(evt.properties.cells[t].id, evt.properties.cells[t].geometry.x, evt.properties.cells[t].geometry.y);
      }
    });

    this.graph.addListener(mxEvent.CELLS_RESIZED, function(sender, evt){
      console.log("Cell Resized");
      that.dirtySaveButton();

      for(t = 0; t < evt.properties.cells.length; t++){
        if(evt.properties.cells[t].edge) continue; //Again, don't do the edges.

        structureManager.setTableSize(evt.properties.cells[t].id, evt.properties.cells[t].geometry.width, evt.properties.cells[t].geometry.height);
      }
    });

    this.graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt){
      console.log("Cell deleted");
      that.dirtySaveButton();

      if(that.ready){
        //Remove the cells from the structure manager.
        //They don't need to be removed from the diagram as they'll already be removed at this point.
        for(t = 0; t < evt.properties.cells.length; t++){
          if(evt.properties.cells[t].edge) continue;

          structureManager.removeTable(evt.properties.cells[t].id);
        }
      }
    });
  },

  createTableButton: function(){
    //Temporary data.
    let tableData = {title: "New table", requiredAmmount: 10, x: 100, y: 100, width: 200, height: 200, types: []};
    //Create the table and then set it's mxid.
    tableData.tableId = this.createTable(tableData);

    if(this.ready){
      //Add the table to the structure manager.
      structureManager.pushTable(tableData);
    }
  },

  createTable: function(e){
    //Add the table to the graph. This has nothing to do with the storage manager
    this.graph.getModel().beginUpdate();
    let table = this.graph.insertVertex(this.graph.getDefaultParent(), null, this.generateTableHTML(e), e.x, e.y, e.width, e.height, 'TABLE_STYLE');
    this.graph.getModel().endUpdate();

    return table.getId();
  },

  createEdge: function(e, source, target){
    //Create an edge and return it's mxid.
    this.graph.getModel().beginUpdate();
    let edge = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', this.graph.getModel().getCell(source), this.graph.getModel().getCell(target), 'EDGE_STYLE');
    this.graph.getModel().endUpdate();

    return edge.getId();
  },

  returnToSelection: function(){
    //Leave the diagram editor.
    this.pageManager.showDatabaseSelectionView();
  },

  generateDataButtonPressed: function(){
    //Callback for the data generation popup.
    this.pageManager.popupGeneratedData();
  },

  generateTableHTML: function(table){
    //Generate html code for a table based on it's values and then return it.
    var string = '';
    string += '<table>';
    string += '<tr><th>'+table.title+'</th></tr>';

    for(count = 0; count < table.types.length; count++){
      string += '<tr><td>'+table.types[count].fieldName+'</td></tr>';
    }

    string += '</table>';

    return string;
  },

  setGraphEnabled: function(enabled){
    this.graph.setEnabled(enabled);
  },

  updateTable: function(id){
    //Set the table html of a certain table.
    let cell = this.graph.getModel().getCell(id);

    this.graph.getModel().setValue(cell, this.generateTableHTML(structureManager.getTableById(id)));
    this.graph.refresh();
  },

  dirtySaveButton: function(){
    this.saveButton.style.backgroundColor = "#ED8291";
  },

  cleanSaveButton: function(){
    this.saveButton.style.backgroundColor = "#bcbcbc";
  },

  saveDatabasePressed: function(){
    //Save the database
    this.cleanSaveButton();

    //Update the storage manager.
    storageManager.saveDatabaseStructure(this.currentDbName);
  },

  show: function(dbName){
    //Make the diagram visible
    this.cleanSaveButton();
    this.currentDbName = dbName;
    this.container.style.visibility = "visible";
    this.setGraphEnabled(true);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), true);
  },

  hide: function(){
    this.container.style.visibility = "hidden";
    this.setGraphEnabled(false);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), false);
  },

  clearDiagram: function(){
    //Remove all the cells in the diagram.
    this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
  }
});

module.exports = DiagramView;

});

require.register("src/pages/ForeignKeySelectionPopup.js", function(exports, require, module) {
const Popup = require('./Popup');
const structureManager = require('../StructureManager');

function ForeignKeySelectionPopup(pageManager){
  this.setup(pageManager);
}

ForeignKeySelectionPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: ForeignKeySelectionPopup,

  listObjects: [],

  setup: function(pageManager){
    this.pageManager = pageManager;
    Popup.prototype.setup.call(this);

    let title = document.createElement('div');
    title.innerHTML = "Select a table";
    title.style.fontSize = "15pt";

    this.backgroundView.append(title);
  },

  popup: function(tableId, editPopup){
    //Remove all the elements that are already in the popup based on the list.
    for(t = 0; t < this.listObjects.length; t++){
      this.listObjects[t].parentNode.removeChild(this.listObjects[t]);
    }
    //Set the list to empty after they've been removed.
    this.listObjects = [];

    Popup.prototype.popup.call(this);

    //Re-add the elements based on the structure.
    let structure = structureManager.getStructure();

    for(t = 0; t < structure.tables.length; t++){
      //Don't include the currently edited table into the list.
      if(structure.tables[t].tableId == tableId) continue;

      let elem = document.createElement('div');
      elem.className = "tableEntry";
      elem.innerHTML = structure.tables[t].title;

      let s = t;
      let that = this;
      elem.onclick = function(){
        that.popout();

        //Add the entry to the list
        editPopup.newRow("", "Foreign Key", true, structure.tables[s].tableId);
      };

      this.backgroundView.append(elem);

      this.listObjects.push(elem);
    }
  },

  backgroundPressed: function(){
    this.popout();
  }
});

module.exports = ForeignKeySelectionPopup;

});

require.register("src/pages/GeneratedDataPopup.js", function(exports, require, module) {
const View = require('./View');
const storageManager = require('../StorageManager');
const Popup = require('./Popup');

function GeneratedDataPopup(pageManager){
  this.pageManager = pageManager;
  this.setup();
}

GeneratedDataPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: GeneratedDataPopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    let generatedDataTitle = document.createElement('div');
    generatedDataTitle.innerHTML = "Generated Data:";
    generatedDataTitle.id = "generatedDataTitle"; //set up the title element for data popup
    generatedDataTitle.style['font-size'] = "15pt";
    generatedDataTitle.style['margin-bottom'] = "0.5em";

    this.dataDisplay = document.createElement('div');
    this.dataDisplay.id = "dataDisplay";  //set up the data display element for data popup

    let closeButton = document.createElement('div');
    closeButton.id = "declineDbButton"; //set up the close button element for data popup
    closeButton.innerHTML = "Close";

    closeButton.style['margin-top'] = "1em";

    let that = this;
    closeButton.onclick = function(e){  //when close button is clicked, close the popup
      that.popout();
    }

    this.backgroundView.style.width = "70%";

    this.backgroundView.append(generatedDataTitle);
    this.backgroundView.append(this.dataDisplay); //append elements to the index.html
    this.backgroundView.append(closeButton);
  },

  popup: function(data){
    Popup.prototype.popup.call(this);
    let outputData = "";
    for(t = 0; t < data.tables.length; t++){
      for(i = 0; i < data.tables[t].done.length; i++){
        outputData += JSON.stringify(data.tables[t].done[i]); //convert the generated data JSON object into a string
        outputData += "<br>";
      }
    }
    outputData = outputData.split('{').join('').split('}').join('').split('"').join(' '); //remove unwanted characters
    this.dataDisplay.innerHTML = outputData;
  },

  backgroundPressed: function(){
    this.popout();   //when the user clicks away from the popup, close the popup
  }

});

module.exports = GeneratedDataPopup;

});

require.register("src/pages/PageManager.js", function(exports, require, module) {
const TestView = require('./TestView');
const DiagramView = require('./DiagramView');
const DataBaseSelectionView = require('./DatabaseSelectionView');
const TableEditorView = require('./TableEditorView');
const dateGenerator = require('../DataGenerator/DataGenerator');
const structureManager = require('../StructureManager');
const storageManager = require('../StorageManager');
const DatabaseCreationPopup = require('./DatabaseCreationPopup');
const TypeSelectionPopup = require('./TypeSelectionPopup');
const DatabaseEditPopup = require('./DatabaseEditPopup');
const ConfirmDeletePopup = require('./ConfirmDeletePopup');
const ForeignKeySelectionPopup = require('./ForeignKeySelectionPopup');
const GeneratedDataPopup = require('./GeneratedDataPopup');
const DataGenerator = require('../DataGenerator/DataGenerator');

function PageManager(){
  //Create new instances of the views it has to manage
  this.testView = new TestView();
  this.diagramView = new DiagramView(this);
  this.dataBaseSelectionView = new DataBaseSelectionView(this);
  this.tableEditorView = new TableEditorView(this);
  this.databaseCreationPopup = new DatabaseCreationPopup(this);
  this.typeSelectionPopup = new TypeSelectionPopup(this);
  this.databaseEditPopup = new DatabaseEditPopup(this);
  this.confirmDeletePopup = new ConfirmDeletePopup(this);
  this.foreignKeySelectionPopup = new ForeignKeySelectionPopup(this);
  this.generatedDataPopup = new GeneratedDataPopup(this);

  //The data generator is created and stored by the page manager.
  this.dataGenerator = new DataGenerator(this);
}

PageManager.prototype = {
  constructor: PageManager,

  showTestView: function(){
    this.testView.show();
  },

  showDiagramView: function(dbName){
    //If no database could be loaded then don't show the view.
    if(!this.loadDatabase(dbName)) {
      alert("There was a problem loading this database.");
      return;
    }
    this.dataBaseSelectionView.hide();
    this.diagramView.show(dbName);
  },

  showDatabaseSelectionView: function(){
    this.diagramView.hide();
    this.dataBaseSelectionView.show();
  },

  popupTableEditorView: function(id){
    //Disable editing the graph when it's not active.
    this.diagramView.setGraphEnabled(false);
    this.tableEditorView.popup(id);
  },

  popoutTableSelection: function(){
    //Re-enable graph editing.
    this.diagramView.setGraphEnabled(true);
    this.diagramView.updateTable(this.tableEditorView.currentId);
    this.tableEditorView.popout();
  },

  popupTypeSelection: function(typeContainer){
    this.typeSelectionPopup.popup(typeContainer);
  },

  popoutTypeSelection: function(){
    this.typeSelectionPopup.popout();
  },

  loadDatabase: function(title){
    //Load the database into the diagram
    //Set the diagram to not ready (meaning it won't process events when tables are added, as here they're not being added by the user).
    this.diagramView.ready = false;
    //Get the database from storage and check it exists.
    let db = storageManager.retrieveDatabase(title);
    if(db == null) return false;

    //Remove everything from the current diagram.
    this.diagramView.clearDiagram();

    //Add the tables.
    for(i = 0; i < db.tables.length; i++){
      db.tables[i].tableId = this.diagramView.createTable(db.tables[i]);
    }

    //Add the current tables to the structure manager.
    //This is so the edges can be added correctly (they need tables with mxids to reference).
    structureManager.setStructure(db);

    //Go through the connectors
    for(t = 0; t < db.connectors.length; t++){
      //Determine the start and destination tables.
      let start = db.tables[db.connectors[t].originTable].tableId;
      let target = db.tables[db.connectors[t].destinationTable].tableId;

      //Get the diagram view to create these edges.
      db.connectors[t].connectorId = this.diagramView.createEdge(db.connectors[t], start, target);
    }

    //Make the diagram view accept events again.
    this.diagramView.ready = true;
    structureManager.setStructure(db);

    return true;
  },

  popupDatabaseEdit: function(dbId, dbContainer){
    this.databaseEditPopup.popup(dbId, dbContainer);
  },

  popupDatabaseCreation: function(dbSelectionView){
    //This is so it knows which view to reference.
    this.databaseCreationPopup.dbSelectionView = dbSelectionView;
    this.databaseCreationPopup.popup(this);
  },

  popupConfirmDelete: function(dbId, dbContainer){
   this.confirmDeletePopup.popup(dbId, dbContainer);
  },

  createDataGenerator: function(){
    this.dataGenerator.generateData(this);
  },

  popupGeneratedData: function(generatedData){
    //Generate the data and then present it to the user
    let data = this.dataGenerator.generateData();
    this.generatedDataPopup.popup(data);
  },

  popupForeignKeySelection: function(tableId, editPopup){
    this.foreignKeySelectionPopup.popup(tableId, editPopup);
  },

  dirtyDiagramSaveButton: function(){
    this.diagramView.dirtySaveButton();
  },

};

module.exports = new PageManager();

});

require.register("src/pages/Popup.js", function(exports, require, module) {
function Popup(){
  this.setup();
}

Popup.prototype = {
  //How long the animation takes to complete.
  speed: 0.2,

  setup: function(){
    //Create the base of what makes a popup
    //The background view
    //The actual container
    this.container = document.createElement('div');
    this.container.className = "popup";

    let that = this;
    this.container.onclick = function(e){
      if(e.target == that.container) that.backgroundPressed();
    };

    this.backgroundView = document.createElement('div');
    this.backgroundView.className = "popupBackground";

    this.container.appendChild(this.backgroundView);
    document.body.appendChild(this.container);
  },

  popup: function(){
    this.container.style.visibility = "visible";
    this.container.style.animation = "fadeIn "+this.speed+"s";
  },

  popout: function(){
    this.container.style.animation = "fadeOut "+this.speed+"s";

    var that = this;
    //After the time it takes the animation to complete, hide the popup fully.
    setTimeout(function(){
      that.container.style.visibility = "hidden";
    }, this.speed * 1000);
  },

  //A stub function to be overriden
  backgroundPressed: function(){
  },
};

module.exports = Popup;

});

require.register("src/pages/TableEditorView.js", function(exports, require, module) {
const View = require('./View');
const structureManager = require('../StructureManager');

function TableEditorView(pageManager){
  this.pageManager = pageManager;

  this.container = document.getElementById("TableEditorView");
  this.tableContainer = document.getElementById("TableEditorTableContainer");
  this.tableTitleInput = document.getElementById("tableTitleField");

  let that = this;
  //If something is typed in the title input then run the change made method.
  this.tableTitleInput.oninput = function(){
    that.changeMade();
  };

  //The id of the table being edited.
  this.currentId = 0;

  //A list of the boxes so that they can be accessed later
  this.nameBoxes = [];
  this.typeBoxes = [];

  //Create the base of the table, the headers are added during the clear
  this.table = document.createElement('table');
  this.tableContainer.append(this.table);

  this.clearRows();

  this.container.onclick = this.backgroundPressed.bind(this);
  document.getElementById("newRowButton").onclick = this.newRowButtonPressed.bind(this);
  document.getElementById("addForeignKeyButton").onclick = this.ForeignKeyButtonPressed.bind(this);
}

TableEditorView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TableEditorView,
  speed: 0.2,

  //Make the view appear as a popup, rather than as something that fills the entire screen.
  popup: function(id){
    this.currentId = id;
    //Get the current table from the structure manager.
    let table = structureManager.getTableById(id);
    if(!table) return;

    //Add the rows to the editor
    this.setupRows(table.types);
    this.tableTitleInput.value = table.title;

    this.show();
    this.container.style.animation = "fadeIn "+this.speed+"s";
  },

  setupRows: function(fieldTypes){
    //Remove the old rows
    this.clearRows();
    for(r = 0; r < fieldTypes.length; r++){
      let foreignKey = false;
      //Go through the entries and add the rows accordingly.
      if(fieldTypes[r].fieldType == "Foreign Key") foreignKey = true;
      this.newRow(fieldTypes[r].fieldName, fieldTypes[r].fieldType, foreignKey);
    }
  },

  clearRows: function(){
    //Remove everything from the container
    while (this.table.firstChild) {
      this.table.removeChild(this.table.firstChild);
    }

    //Create a new table (as the old one was removed) and add it to the container.
    var heading = document.createElement('tr');
    var heading1 = document.createElement('th');
    heading1.innerHTML = "Field Name";
    var heading2 = document.createElement('th');
    heading2.innerHTML = "Field Type";

    heading.append(heading1);
    heading.append(heading2);
    this.table.append(heading);
  },

  newRow: function(name, fieldType, foreignKey, tableId){
    //Create the components that'll go in the new rows.
    var row = document.createElement('tr');
    var first = document.createElement('td');
    var second = document.createElement('td');

    var third = document.createElement('td');
    //Create the cross button.
    let image = document.createElement('img');
    image.src = "cross.png";
    image.className = "FieldRemoveCross";
    third.append(image);

    let nameInput = document.createElement('input');
    nameInput.value = name;
    first.append(nameInput);

    let typeButton = document.createElement('div');
    typeButton.innerHTML = fieldType;
    typeButton.className = "FieldTypeButton";
    second.append(typeButton);

    //Make the row look different if it contains a foreign key
    let that = this;
    if(!foreignKey){
      typeButton.onclick = function(e){
        that.pageManager.popupTypeSelection(e.target);
      }
    }else{
      typeButton.tableId = tableId;
      typeButton.style['background-color'] = "#82D47F";
      typeButton.style['cursor'] = "default";
    }

    image.onclick = function(e){
      //Get the parent's parent of the clicked element (the row) and remove it.
      let targetRow = e.target.parentElement.parentElement;
      that.table.removeChild(targetRow);

      //Remove it from the name and type boxes.
      for(t = 0; t < that.nameBoxes.length; t++){
        //Check if the name box's row is the same as the one to delete.
        if(that.nameBoxes[t].parentElement.parentElement == targetRow){
          that.nameBoxes.splice(t, 1);
          that.typeBoxes.splice(t, 1);
          break;
        }
      }
      that.changeMade();
    }

    //Add the components to the row and then append it.
    this.nameBoxes.push(nameInput);
    this.typeBoxes.push(typeButton);

    row.append(first);
    row.append(second);
    row.append(third);
    this.table.append(row);
  },

  updateStructureManager: function(){
    //Temporary data that's added to by the loop.
    let tempTable = [];

    //Go through the name boxes and add their data to the structure manager.
    for(t = 0; t < this.nameBoxes.length; t++){
      let data = {fieldName: this.nameBoxes[t].value, fieldType: this.typeBoxes[t].innerHTML};

      //If it's a foreign key include the id.
      if(this.typeBoxes[t].innerHTML == "Foreign Key"){
        data.tableId = this.typeBoxes[t].tableId;
      }
      tempTable.push(data);
    }

    //Set the data in the structure manager.
    structureManager.setTableTitle(this.currentId, this.tableTitleInput.value);
    structureManager.setTableTypes(this.currentId, tempTable);
  },

  popout: function(){
    this.currentId = 0;
    this.container.style.animation = "fadeOut "+this.speed+"s";

    this.nameBoxes = [];
    this.typeBoxes = [];

    //Hide after the ammount of time the animation takes. This is just so the user can actually see the animation.
    var that = this;
    setTimeout(function(){
      that.hide();
    }, this.speed * 1000);
  },

  backgroundPressed: function(e){
    //Make the event not fire on a child of the background.
    if(e.target != this.container) return;

    //Update the structure manager when the popup is closed.
    this.updateStructureManager();
    this.pageManager.popoutTableSelection();
  },

  newRowButtonPressed: function(){
    //Create a blank row that isn't a foreign key.
    this.newRow("", "Field Type", false);
    this.changeMade();
  },

  ForeignKeyButtonPressed: function(){
    this.pageManager.popupForeignKeySelection(this.currentId, this);
    this.changeMade();
  },

  changeMade: function(){
    this.pageManager.dirtyDiagramSaveButton();
  }
});

module.exports = TableEditorView;

});

require.register("src/pages/TestView.js", function(exports, require, module) {
const View = require('./View');

function TestView(){
  this.container = document.getElementById("testView");

  //Call a callback function on press.
  document.getElementById("testButton").onclick = this.buttonPressed.bind(this);
}

TestView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TestView,

  buttonPressed: function(){
    this.hide();

    //You need to store a reference to is because the scope for setTimeout is different.
    var that = this;
    setTimeout(function(){
      that.show();
    }, 2000);
  }
});

module.exports = TestView;

});

require.register("src/pages/TypeSelectionPopup.js", function(exports, require, module) {
const Popup = require('./Popup');
const typeManager = require('../TypeManager/TypeManager');

function TypeSelectionPopup(pageManager){
  this.pageManager = pageManager;

  this.setup();
}

TypeSelectionPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  setup: function(){
    Popup.prototype.setup.call(this);

    let title = document.createElement('div');
    title.innerHTML = "Select a Field Type";

    let container = document.createElement('div');
    container.id = "fieldTypeContainer";

    //Get a list of the available field types
    let list = typeManager.getTypesList();

    //Iterate over the list and add them to the container.
    for(t = 0; t < list.length; t++){
      let item = document.createElement('div');
      item.innerHTML = list[t];
      item.id = "TypeListItem";

      let row = Math.floor(t / 3);
      let column = t % 3;

      //Use a css grid to position the items.
      item.style['grid-row'] = row;
      item.style['grid-column'] = column;

      let that = this;
      item.onclick = function(e){
        //Set the name of the type as the lable of the container.
        that.typeContainer.innerHTML = e.target.innerHTML;

        that.pageManager.popoutTypeSelection();
        that.pageManager.dirtyDiagramSaveButton();
      }

      container.append(item);
    }

    //AA-D80073

    this.backgroundView.append(title);
    this.backgroundView.append(container);
  },

  popup: function(typeContainer){
    Popup.prototype.popup.call(this);
    this.typeContainer = typeContainer;
  },

  backgroundPressed: function(){
    this.pageManager.popoutTypeSelection();
  }
});

module.exports = TypeSelectionPopup;

});

require.register("src/pages/View.js", function(exports, require, module) {
function View(){
  this.container = 0;
}

View.prototype = {
  constructor: View,

  //These two functions are also run by popups
  hide: function(){
    this.container.style.visibility = "hidden";
  },

  show: function(){
    this.container.style.visibility = "visible";
  },
};

module.exports = View;

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map