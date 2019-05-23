class HttpNode {
  constructor(id,type,z){
    this.id=id;
    this.type=type;
    this.z=z;
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
  constructor(id,z,url){
    super(id,"http in",z);
    this.url=url;
    this.method="get";
    this.upload=false;
    this.swaggerDoc="";
  }
}

class HttpNodeResponse extends HttpNode{
  constructor(id,z){
    super(id,"http response",z);
    this.statusCode="";
    this.headers={};
  }
}

class HttpNodeRequest extends HttpNode{
  constructor(id,z){
    super(id,"http request",z);
    this.method="GET";
    this.ret="txt";
    this.url="";
    this.tls="";
    this.proxy="";
    this.authType="basic";
  }
}

export {HttpNodeIn,HttpNodeResponse,HttpNodeRequest};
