DECISION={
	decision:function(dataset){
		var options={
			trainingSet:dataset,
			categoryAttr:'label',
			ignoredAttributes:[]
		};
		var tree=new dt.DecisionTree(options);
		this.model=tree;
		return this.render(tree);
	},
	render:function(tree){
		var root={};
		root.name='root';
		root.label='gray';
		root.children=[];
		
		var decision=tree.root.attribute+tree.root.predicateName+tree.root.pivot;
		if(tree.root.match){
		    update(root,tree.root.match,decision);
		}
		if(tree.root.notMatch){
		    update(root,tree.root.notMatch,'not '+decision);
		}
		return root;
		
		function update(parent,child,decision) {
		  	var data={};
		  	data.name=decision;
		 	if(child.category){
		    	data.label=child.category;
		 	}else{
		    	decision=child.attribute+child.predicateName+child.pivot;
		    	data.children=[];
		    	if(child.match){
		      		update(data,child.match,decision);
		    	}
		    	if(child.notMatch){
		      		update(data,child.notMatch,'not '+decision);
		    	}
		  	}
		  	parent.children.push(data);
		}
	}
	
}
