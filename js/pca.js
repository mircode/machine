PCA={
	/**
	 * 计算PCA
	 */
	line:function(dataset,xrange){
		var PCA=ML.Stat.PCA;
		// 转换数据格式
		var datas=[];
		dataset.map(function(d){
			datas.push([d.x, d.y]);
		});
		// 计算PCA
		var pca=new PCA(datas);
		var model=pca.toJSON();
		// U 特征向量S 特征值
		// 斜率
		var alpha=Math.atan(model.U[0][1]/model.U[0][0]);
		// 与y轴交点
		var y0=model.means[1]-Math.tan(alpha)*model.means[0];
		// 与x最大取值范围交点
		var x0=Math.tan(alpha)*(xrange||180)+y0;
		var line=[{x:0,y:y0},{x:(xrange||180),y:x0}];
		return line;
	},
	/**
	 * 计算点到PAC特征向量的映射 
	 */
	project:function(dataset,line) {
		var res=[];
		var p1=line[0];
		var p2=line[1];
		
		dataset.map(function(point) {
			res.push([linear(p1,p2,point),point]);
		});
		return res;
		
		// 线性方程求解
		function linear(p1,p2,p3) {
			// 斜率
			var k=(p2.y-p1.y)/(p2.x-p1.x);
			// 截距
			var b=p1.y-k*p1.x;
			
			// 线性垂直求解
			var x=(k*(p3.y-b)+p3.x)/(k*k+1);
			var y=k*x+b;
			return {x:x,y:y };
		}
	}
}
