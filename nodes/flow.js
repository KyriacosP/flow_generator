class Flow{
  constructor(label){
    this.label=label;
    this.nodes=[];
  }

  addNode(node){
    if (this.nodes.length===0){
      this.nodes.push(node);
    }else{
      this.nodes[this.nodes.length-1].addWire(node.id);
      this.nodes.push(node);
    }
  }
}

export default Flow;
