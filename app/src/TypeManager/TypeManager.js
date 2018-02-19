function TypeManager(){

}

TypeManager.prototype = {
  types: ["first name", "surname"],
	Generate: function(previous){
		return previous;
  }
};

module.exports = new TypeManager;
