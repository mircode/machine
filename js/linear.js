LINEAR={
	/**
	 * 拟合线性方程 
	 */
	line:function(dataset,xrange){
		var PCA=ML.Stat.PCA;
		// 转换数据格式
		var datas=[];
		dataset.map(function(d){
			datas.push([d.x, d.y]);
		});
		var linear=ss.linearRegressionLine(ss.linearRegression(datas));
		var line=[{x:0,y:linear(0)},{x:(xrange||180),y:linear(xrange||180)}];
		this.linear=linear;
		return line;
	},
	/**
	 * 计算点到线性方程的距离
	 */
	project:function(dataset) {
		var res=[];
		var self=this;
		dataset.map(function(point) {
			var p1=point;
      		var p2={x:p1.x,y:self.linear(p1.x)}
			res.push([p1,p2]);
		});
		return res;
	}
}
