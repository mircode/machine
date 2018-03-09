LOGISTIC={
	logistic:function(dataset){
		var X=dataset.map(p=>[1,p.x,p.y]);
		var y=dataset.map(p=>p.label);
		X=math.matrix(X);
		y=math.matrix(y);

		// 获取x的最大值和最小值
	  	var extent=d3.extent(dataset,p=>p.x);
	    var m=math.subset(math.size(X),math.index(0));
	    
	    var alpha=0.0004;
	    var theta=math.matrix([-24,0.5,0.2]);
	
	  	var line=null;
	  	var self=this;
	  	for(var i=0;i<1000;i++){
		    var h=math.multiply(X,theta).map(z=>self.sigmoid(z));
		    var grad=self.gradient(m,y,h,X);
		    theta=theta.map((t,i)=>t-alpha*math.subset(grad, math.index(i)));
		    var theta0=math.subset(theta,math.index(0));
		    var theta1=math.subset(theta,math.index(1));
		    var theta2=math.subset(theta,math.index(2));
		    line=[{
			        x:extent[0],
			        y:-1/theta2*(theta1*extent[0]+theta0)
		        },{
			        x:extent[1],
			        y:-1/theta2*(theta1*(extent[1]*0.95)+theta0)
		      	}];
	  	}
	  	return line;
	},
	sigmoid:function(z){
	  var s=1/(1+Math.pow(Math.E,-z));
	  return s;
	},
	gradient:function(m,y,h,X){
	  var grad=math.multiply(h.map((h,i)=>h-math.subset(y,math.index(i))),X).map(d=>1/m*d);
	  return grad;
	}
}
