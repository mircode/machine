KNN={
	/**
	 * 从dataset中选出距cur最近的k个点
	 */
	knn:function(cur,dateset,k){
		var res=[];
		dateset.map(function(target) {
		    var dist={};
		    dist.p=target;
		    dist.d=Matrix.distance(cur,target.coordinates);
		    res.push(dist);
		});
		res.sort(function(p1,p2){
			return p1.d-p2.d;
		});
	  	return res.slice(0,k);
	},
	/**
	 * 投票选出所属归类
	 */
	vote:function(knn){
		var res={};
		knn.map(function(item) {
			if(!res[item.p.label]){
				res[item.p.label]=0;
			}else{
				res[item.p.label]++;	
			}
	  	});
	  	var val=-1;
	  	var label=-1;
		for(var k in res){
			if(res[k]>val){
				val=res[k];
				label=k;
			}
		}
	  	return label;
	}
}
