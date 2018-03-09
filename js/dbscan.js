DBSCAN={
	eps:10,       // 扫描半径圈
	minpts:2,     // 半径圈内包含的点数
	init:function(dataset){
		this.label=-1;
		dataset.map(function(point) {
		    point.visited=false;
		    point.el.style('fill','#ccc');
		});
	},
	/**
	 * 扫描到一个点触发一次回调 
	 */
	dbscan:function(dataset,callback){
		this.init(dataset);
		var length=2000;
		var self=this;
		for(var i=0;i<length;i++){
			var unvisit=this.unvisit(dataset);
			if(unvisit.length==0)  break;
			var cur=unvisit[0];
			
			// 查找临近的点
			var nears=this.getnears(dataset,cur);
			if(nears.length<this.minpts){
			  continue;
			}
			
			// 找到新类
			this.label++;
			
			var cluster=[];
			
			// 标识当前点
			cur.visited=true;
			cur.label=this.label;
			cluster.push(cur);
			callback(cur);
			
			
			// 标识临近点
			nears.map(function(near) {
				near.visited=true;
				near.label=self.label;
				cluster.push(near);
				callback(near);
			});
			
			var unvisit=this.unvisit(unvisit);
			// 递归查找新的临近点
			this.search(unvisit,cluster,callback);
		}
	},
	unvisit:function(dataset){
		var res=dataset.filter(function(point) {
			return point.visited==false;
		});
		return res;
	},
	getnears:function(dataset,point){
		var res=[];
		var self=this;
		dataset.map(function(item) {
		    if(item!==point){
		      var distance=Matrix.distance(item,point);
		      if(distance<self.eps) {
		        res.push(item);
		      }
		    }
		});
		return res;
	},
	// 递归搜索距离cluster最近的点
	search:function(unvisit,cluster,callback){
		var need=false;
		var self=this;
		unvisit.map(function(point) {
		    var distance=self.clusterdistance(cluster,point);
		    if(distance<self.eps) {
			    point.visited=true;
				point.label=self.label;
				cluster.push(point);
				callback(point);
			    need=true;
		    }
		});
		if(need){
			var unvisit=this.unvisit(unvisit);
		    self.search(unvisit,cluster,callback);
		}
	},
	// 距离cluster最近的点point
	clusterdistance:function(cluster,point) {
		var distances=[];
	  	cluster.map(function(item) {
	    	var distance=Matrix.distance(item,point);
	   		distances.push(distance);
	  	});
	  	return Math.min.apply(Math,distances);
	}
}
