//a file containing utils for Flow class

//returns an array of unique objects based on name and in properties
function unique(array) {
  var arr = [];
  for(var i = 0; i < array.length; i++) {
    if(!arr.some(x=>x.name===array[i].name&&x.in===array[i].in)) {
      arr.push(array[i]);
    }
  }
  return arr;
}

//transforms an array to object using array.reduce()
function arrayToObject(array){
  return array.reduce((obj,item)=>{
    obj[item]={
      responses:[],
      parameters:[],
      path:""
    };
    return obj;
  },{});
}

//adds responses to meth object deleting unnecessary properties
function addResponses(meth,resp){
  for(let i in meth){
    for(let j in resp){
      if(resp[j].partof===i){
        delete resp[j].parameters;
        delete resp[j].partof;
        delete resp[j].parentId;
        delete resp[j].tableData;
        meth[i].responses.push(resp[j]);
      }
    }
  }
  return meth;
}

//generates schema property of openapi spec
function generateSchema(meth){
  let schema={
    type:"object",
    properties:{}
  }
  for(let i in meth){
    for(let j in meth[i].responses){
      schema.properties[meth[i].responses[j].name]={
        type:meth[i].responses[j].type
      };
    };
  };
  return schema;
}

//adds params and path to meth object
function addParamsAndPath(meth,exposedAPI){
  for(let i in exposedAPI.paths){
    if(Object.prototype.hasOwnProperty.call(meth,exposedAPI.paths[i].get.operationId)){
      meth[exposedAPI.paths[i].get.operationId].path=i;
      meth[exposedAPI.paths[i].get.operationId].parameters=exposedAPI.paths[i].get.parameters;
    }
  }
  return meth;
}

//creates the url of the Http input node
function createEntryUrl(meth,parameters){
  let par=parameters || meth.parameters;
  let url="/"+meth.operationId;
  for(let i in par){
    if(par[i].in==='path'){
      url+="/:"+par[i].name;
    }
  }
  return url;
}

//returns the code for the first function node
function funcSetVar(){
  return (
    `var res={};
    flow.set("res",res);
    for(var i in msg.req.query){
      msg[i]=msg.req.query[i];
    }
    return msg;`
  );
}

//creates the code for the prepare request function node
function funcPrepReq(baseurl,meth){
  let url=baseurl+meth.path+"?";
  for(let i in meth.parameters){
    if(meth.parameters[i].in==="query"){
      url+=meth.parameters[i].name+"={{{"+meth.parameters[i].name+"}}}&";
    }
  }
  return (
    `msg.url='${url}';
    for(var i in msg.req.params){
      msg.url=msg.url.replace('{'+i+'}',msg.req.params[i]);
    }
    return msg;`
  );
}

//creates the code for the storedata function node after a request to the original api has been made
function funcStoreData(meth){
  let res=``;
  if(!meth.responses[0].path.includes("Array")){
    for(let i in meth.responses){
      res+=`_.set(res,"${meth.responses[i].path}",_.get(msg.payload,"${meth.responses[i].path}"));\n`;
    }
  }else{
    res+=`res.array=[];
    for(let i in msg.payload){
      res.array[i]={};\n`;
    for(let i in meth.responses){
      res+=`_.set(res.array[i],"${meth.responses[i].path.replace('Array.','')}",_.get(msg.payload[i],"${meth.responses[i].path.replace('Array.','')}"));\n`;
    }
    res+=`}\n`;
  }
  return (
    `var _ = global.get('lodash');
    msg.payload=JSON.parse(msg.payload);
    var res=flow.get("res");
    ${res}
    flow.set("res",res);
    return msg;`
  );
}

//returns the code for the final function node
function funcPrepRes(){
  return (
    `var res=flow.get("res");
    msg.payload=res;
    return msg;`
  );
}

//generate x-data-sources property of openapi spec
function generateDataSources(methUsed,exposedAPI){
  let sources=[];
  for(let i in exposedAPI.paths){
    if(methUsed.includes(exposedAPI.paths[i].get.operationId)){
      sources=sources.concat(exposedAPI.paths[i].get["x-data-sources"]);
    }
  }
  sources=[...new Set(sources)];
  return sources;
}

export {generateDataSources,unique,arrayToObject,addResponses,generateSchema,addParamsAndPath,createEntryUrl,funcSetVar,funcPrepReq,funcStoreData,funcPrepRes};
