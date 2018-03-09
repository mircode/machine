HIERARCHICAL={
	hierarch:function(dataset,callback){
		while(true){
			// 配对
		    var pair=this.makepair(dataset);
		    // 删除配对成功的节点
		    dataset=dataset.filter(function(el){
		    	var flag=true;
		    	for(var i=0;i<pair.pair.length;i++){
		    		var item=pair.pair[i];
		    		if(el==item){
		    			flag=false;
		    			break;
		    		}
		    	}
			    return flag;
		    });
		      
			// 产生新的中心点
		    var newpoint={};
		    newpoint.x=(pair.pair[0].x+pair.pair[1].x)/2;
		    newpoint.y=(pair.pair[0].y+pair.pair[1].y)/2;
		    // 半径
		    newpoint.size=pair.distance/2;
		    if(pair.pair[0].size){
		      newpoint.size=newpoint.size+pair.pair[0].size;
		    }
		    if(pair.pair[1].size){
		      newpoint.size=newpoint.size+pair.pair[1].size;
		    }
		    
		    newpoint.children=[];
		    pair.pair.map(function(item) {
		      newpoint.children.push(item);
		    });
		    
		    dataset.push(newpoint);
		    callback(newpoint);
		    
		    // 返回树形结构
		    if(dataset.length==1){
		      return this.render(newpoint);
		    }
		}
	},
	makepair:function(dataset){
		var pair=null;
	  	var min=Number.MAX_VALUE;
	  	for(var i=0;i<dataset.length;i++){
	    	var p1=dataset[i];
	    	for(var j=i+1;j<dataset.length;j++){
	      		var p2=dataset[j];
	      		var d=Matrix.distance(p1,p2);
	      		if(d<min){
	        		min=d;
	        		pair=[p1,p2];
	      		}
	    	}
	  	}
	 	return {pair:pair,distance:min};
	},
	render:function(point){
		var self=this;
		var treedata={};
		treedata.name='('+Math.round(point.x)+','+Math.round(point.y)+')';
		treedata.children=[];
	    point.children && point.children.map(function(p){
	      treedata.children.push(self.render(p));
	    });
	    return treedata;
	}
}
