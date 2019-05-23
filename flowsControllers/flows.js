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
      return  res.status(200).send({
        success: 'true',
        message: 'CAF description provided successfully'
      });
    }
  }


}

const flowsController = new FlowsController();
export default flowsController;
