class HttpNode {
  constructor(id,type){
    this.id=id;
    this.type=type;
    this.name="";
    this.x=100;
    this.y=100;
    this.wires=[];
  }

  addWire(){
    let wire=[];
    for (var i in arguments){
      wire.push(arguments[i]);
    }
    this.wires.push(wire);
  }
}

class HttpNodeIn extends HttpNode{
  constructor(id,url){
    super(id,"http in");
    this.url=url;
    this.method="get";
    this.upload=false;
    this.swaggerDoc="";
  }
}

class HttpNodeResponse extends HttpNode{
  constructor(id){
    super(id,"http response");
    this.statusCode="";
    this.headers={};
  }
}

class HttpNodeRequest extends HttpNode{
  constructor(id){
    super(id,"http request");
    this.method="GET";
    this.ret="txt";
    this.url="";
    this.tls="";
    this.proxy="";
    this.authType="basic";
  }
}

export {HttpNodeIn,HttpNodeResponse,HttpNodeRequest};
