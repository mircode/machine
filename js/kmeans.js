KMEANS={
	/**
	 * 随机初始化k个中心点
	 */
	init:function(k,xrange,yrange){
		var res=[];
		for(var i=0;i<k;i++){
		    var p={};
		    p.x=Math.round(Math.random()*xrange);
		    p.y=Math.round(Math.random()*yrange);
		    res.push(p);
		}
		return res;
	},
	/**
	 * 根据每个点到中心点的距离标识dataset中的点
	 */
	label:function(dataset,centers){
		dataset.map(function(point) {
			var label=-1;
		    var distance=Number.MAX_VALUE;
		    for(var i=0;i<centers.length;i++){
			    var lab=centers[i].label;
			    var dist=Matrix.distance(point,centers[i]);
		      	if(dist<distance){
		      		label=lab;
		      		distance=dist;
		      	}
		    }
		    point.label=label;
		});
		return dataset;
	},
	/**
	 * 根据新的dataset,计算新的中心点
	 */
	update:function(dataset,centers){
		var groups={};
		for(var i=0;i<dataset.length;i++){
			var label=dataset[i].label;
			if(!groups[label]){
				groups[label]=[];
			}
			groups[label].push(dataset[i]);
		}
		for(var label in groups){
			var x=0;
			var y=0;
			var length=groups[label].length;
			for(var i=0;i<length;i++){
				var point=groups[label][i];
		        x+=point.x;
		        y+=point.y;
			}
			x=x/length;
			y=y/length;
			
			centers[label].x = x;
		    centers[label].y = y;
		}
		return centers;
	},
	/**
	 * 检测是否收敛
	 */
	check:function(old,centers){
		if(!(old && centers)){
			return false;
		}
		for(var i=0;i<old.length;i++){
			if((old[i].x!=centers[i].x)||(old[i].y!=centers[i].y)){
				return false;
			}
		}
		return true;
	}
}
