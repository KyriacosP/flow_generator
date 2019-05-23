import flowExample from '../resources/simpleNewCAF';
import fetch from 'node-fetch';
import {HttpNodeIn,HttpNodeResponse,HttpNodeRequest} from '../nodes/httpNodes';
import FunctionNode from '../nodes/functionNodes';
import Flow from '../nodes/flow';

class FlowsController {
  info(req, res) {
    return res.status(200).send({
      success: 'true',
      message: 'Hello World'
    });
  }

  generateFlow(req, res) {
    if(Object.keys(req.body).length === 0){
      return res.status(400).send({
        success: 'false',
        message: 'No CAF description provided'
      });
    } else {
      var f=new Flow("test dynamic");
      f.addNode(new HttpNodeIn(1,0,"/testEND"));
      f.addNode(new FunctionNode(2,0,"console.log(\"works\"); return msg;"))
      f.addNode(new HttpNodeResponse(3,0));
      console.log(typeof f);
      console.log(f);
      console.log(JSON.stringify(f));
      fetch('http://localhost:1880/flow', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(f)
      })
        .then(data=>data.json())
        .then(data=>console.log(data))
      return  res.status(200).send({
        success: 'true',
        message: 'CAF description provided successfully'
      });
    }
  }


}

const flowsController = new FlowsController();
export default flowsController;
