import fetch from 'node-fetch';
import {HttpNodeIn,HttpNodeResponse,HttpNodeRequest} from '../nodes/httpNodes';
import FunctionNode from '../nodes/functionNodes';
import Flow from '../nodes/flow';
import Ajv from 'ajv';
import {blueprintSchema,blueprintSchemaExposedAPI} from '../schemas'

class FlowsController {
  //endpoint implementation for / and /info
  //return status and msg descriping functionality
  info(req, res) {
    return res.status(200).send({
      success: 'true',
      msg: 'Rest API for generating NODE-RED flows\nBuild for and works only with Method_manipulation FronEnd!'
    });
  }

  //endpoint implementation for /generate
  //creates NODERED flows and posts them to NODERED
  //returns status and openapi spec
  async generateFlow(req, res) {
    if(Object.keys(req.body).length === 0){
      return res.status(400).send({
        success: 'false',
        msg: 'No CAF description provided'
      });
    } else {
      //openapi spec initialization
      let newOpenAPi={};
      newOpenAPi.EXPOSED_API={
        openapi:"3.0.2",
        info:{
          title:"CAF API",
          description:"Generated with method_manipulation and flow_generator",
          version:"1.0.0"
        },
        servers:[
          {
            description:"NODERED server",
            url:"http://localhost:1880"
          }
        ],
        paths:{}
      };
      // console.log(JSON.stringify(req.body.methods,null,4));

      //flows creation and posts
      let {methods, exposedAPI}=req.body;
      let noderedResponse=[];
      for(var i in methods){
        //initialize flow
        let f=new Flow(methods[i].operationId);
        //create flow from method
        let path=f.createFromMethod(methods[i],exposedAPI);
        newOpenAPi.EXPOSED_API.paths[Object.keys(path)[0]]=path[Object.keys(path)[0]];
        console.log(f);
        // post flow to NODERED
        await fetch('http://localhost:1880/flow', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(f)
        })
        .then(res=>{
          if(!res.ok){
            throw Error(res.json());
          }
          return res;
        })
        .then(data=>data.json())
        .then(data=>noderedResponse.push(data))
        .catch(error =>noderedResponse.push(error));
      }
      let ajv=new Ajv();
      let valid=ajv.validate(blueprintSchemaExposedAPI,newOpenAPi);
      console.log(valid);
      return res.status(200).send({
          success: 'true',
          msg: 'CAF description provided successfully',
          noderedResponse:noderedResponse,
          openapiSpec:newOpenAPi
      })
    }
  }

  //endpoint implementation for /forward
  //receives an apoenapi spec and validates it against a JSON schema
  //returns status and msg
  forward(req, res) {
    if(Object.keys(req.body).length === 0){
      return res.status(400).send({
        success: 'false',
        msg: 'No CAF description provided'
      });
    } else {
      let ajv=new Ajv();
      let valid=ajv.validate(blueprintSchema,req.body);
      if (!valid) console.log(ajv.errors);
      return res.status(200).send({
        success: 'true',
        msg: 'CAF description forwarded successfully'
      })
    }
  }
}


const flowsController = new FlowsController();
export default flowsController;
