class FunctionNode {
  constructor(id,func){
    this.id=id;
    this.type="function";
    this.name="";
    this.func=func;
    this.outputs=1;
    this.noerr=0;
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

export default FunctionNode;
