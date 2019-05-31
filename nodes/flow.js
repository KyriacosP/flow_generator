import {HttpNodeIn,HttpNodeResponse,HttpNodeRequest} from '../nodes/httpNodes';
import FunctionNode from '../nodes/functionNodes';
import uniqid from 'uniqid';
import {generateDataSources,unique,arrayToObject,addResponses,generateSchema,addParamsAndPath,createEntryUrl,funcSetVar,funcPrepReq,funcStoreData,funcPrepRes} from '../nodes/flow.utils'

class Flow{
  //initialize NODERED flow
  constructor(label){
    this.label=label,
    this.nodes=[];
  }

  //adds new Node to flow
  addNode(node){
    if (this.nodes.length===0){
      this.nodes.push(node);
    }else{
      this.nodes[this.nodes.length-1].addWire(node.id);
      this.nodes.push(node);
    }
  }

  //creates a NODERED flow based on a provided custom or original method and the original API
  //also returns path property for new openapi spec
  createFromMethod(method,exposedAPI){
    let path={};
    let url="";
    let parameters=[];
    let schema={};
    let sources=[];
    // console.log(JSON.stringify(method,null,6));
    //check if the method is a complete method from the original api
    if(Object.prototype.hasOwnProperty.call(method, 'path')){
      //if method is a complete method from original api create a wrapper endpoint around that method
      url=createEntryUrl(method);
      this.addNode(new HttpNodeIn(uniqid(),url));
      this.addNode(new FunctionNode(uniqid(),funcSetVar()));
      this.addNode(new FunctionNode(uniqid(),funcPrepReq(exposedAPI.servers[0].url,method)));
      this.addNode(new HttpNodeRequest(uniqid()));
      this.addNode(new HttpNodeResponse(uniqid()));
      schema=method.responseSchema;
      sources=generateDataSources([method.operationId],exposedAPI);
    }
    else{
      //else if custom method find the parameters and methods that are involved
      let methodsUsed=[];
      for (let i in method.responseSchema){
        methodsUsed.push(method.responseSchema[i].partof);
        parameters=parameters.concat(method.responseSchema[i].parameters);
      }
      methodsUsed=[...new Set(methodsUsed)];
      sources=generateDataSources(methodsUsed,exposedAPI);
      parameters=unique(parameters);
      url=createEntryUrl(method,parameters);
      let methodsObject=arrayToObject(methodsUsed);
      methodsObject=addResponses(methodsObject,method.responseSchema);
      schema=generateSchema(methodsObject);
      methodsObject=addParamsAndPath(methodsObject,exposedAPI);
      //add entry point nodes
      this.addNode(new HttpNodeIn(uniqid(),url));
      this.addNode(new FunctionNode(uniqid(),funcSetVar()));
      //add external request nodes
      for (let i in methodsObject){
        this.addNode(new FunctionNode(uniqid(),funcPrepReq(exposedAPI.servers[0].url,methodsObject[i])));
        this.addNode(new HttpNodeRequest(uniqid()));
        this.addNode(new FunctionNode(uniqid(),funcStoreData(methodsObject[i])));
      }
      //add exit point noderedResponse]
      this.addNode(new FunctionNode(uniqid(),funcPrepRes()));
      this.addNode(new HttpNodeResponse(uniqid()));
    }
    path[url]={
      get:{
        summary:method.summary,
        description:method.description,
        operationId:method.operationId,
        parameters:method.parameters || parameters,
        responses:{
          200: {
            content:{
              'application/json':{
                schema:schema
              }
            }
          }
        },
        'x-data-sources':sources
      }
    }
    return(path);
  }
}

export default Flow;
