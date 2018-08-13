'use strict';

const fs = require('fs');
const datasourcefile = __dirname + '/server/datasources.json';


module.exports =  function datasource(configuration) {
let databaseJson = fs.readFileSync(datasourcefile); 
let data = JSON.parse(databaseJson); 
data.mongo = configuration.options; 
fs.writeFileSync(datasourcefile, JSON.stringify(data)); 
return data;
  };
