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
    current.MovieTitle = title;

    return current;
  }
});

module.exports = MovieTitleType;
