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
