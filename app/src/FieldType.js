function FieldType(){

}

FieldType.prototype = {
	Requirements: [],

	Generate: function(previous){
		return previous;
}
};

module.exports = new FieldType;
