'use strict';

const path = require('path');
const fs = require('fs');
const modelConfigfile = __dirname + '/server/model-config.json';



module.exports =  function model(configuration) {



// Replace users model name in model config file with new model name

let modelconfigJson = fs.readFileSync(modelConfigfile);
//let modelconfigData = JSON.parse(modelconfigJson); 
var modelconfigData = JSON.parse(modelconfigJson);
var confname= configuration.name
if(modelconfigData.users){
modelconfigData[confname] = modelconfigData.users;
delete modelconfigData['users']; // or use => delete test['blue'];
 modelconfigData[confname] = {"dataSource":"mongo","public":true};

}
else{
  var getmodelKey = Object.keys(modelconfigData).pop();
 // console.log(getmodelKey);
if(getmodelKey !== 'Role')
{
  delete modelconfigData[getmodelKey]; 
}
 modelconfigData[confname] = {"dataSource":"mongo","public":true};
}

fs.writeFileSync(modelConfigfile, JSON.stringify(modelconfigData)); 


function fromDir(startPath,filter,callback){

  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)){
      console.log("no dir ",startPath);
      return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
      var filename=path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
          fromDir(filename,filter,callback); //recurse
      }
      else if (filter.test(filename)) callback(filename);
  };
};

fromDir(__dirname +'/common/models/',/\.json$/,function(filename){
  // console.log('-- found: ',filename);
  // Rename model file name with new model name
fs.rename(filename,  __dirname +'/common/models/'+configuration.name+'.json', function(err) {
  if ( err ) console.log('ERROR: ' + err);
const modelfile = __dirname +'/common/models/'+configuration.name+'.json';
let modelJson = fs.readFileSync(modelfile);
let modelData = JSON.parse(modelJson); 
modelData.name = configuration.name; 
modelData.properties = configuration.properties; 
fs.writeFileSync(modelfile, JSON.stringify(modelData));
// console.log('successfully model json file rename to '+configuration.name+'.json')

fromDir(__dirname +'/common/models/',/\.js$/,function(js_file){
 // console.log('-- found: ',js_file);
fs.rename(js_file,  __dirname +'/common/models/'+configuration.name+'.js', function(err) {
 // console.log('successfully model js file rename to '+configuration.name+'.js')

});
});

}); 

});

return modelconfigData;


  };

