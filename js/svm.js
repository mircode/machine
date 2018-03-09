SVM={
	kernels:[
		'linear',
		'gaussian',
		'exponential',
		'laplacian',
		'anova',
		'rational',
		'multiquadratic',
		'cauchy',
		'histogram'
	],
	svm:function(dataset,kernel,xrange,yrange){
		// 配置
		var options={
			C:1,
			tol:10e-4,
			maxPasses:20,
			maxIterations:10000,
			kernel:kernel||'linear',
			kernelOptions:{
				sigma:0.05
			}
		};
		var svm=new ML.SL.SVM(options);
	  	var features=[];
	  	var labels=[];

		dataset.map(function(p) {
			features.push([p.x,p.y]);
			if(p.label==0){
				labels.push(1);
			}else{
				labels.push(-1);
			}
		});
		
		// 训练SVM
		svm.train(features,labels);
		this.model=svm;
		
		var starts=[[0,0],[0,yrange],[0,0],[xrange,0]];
		var steps=[[1,0],[1,0],[0,1],[0,1]];
		var line=[];
		  
		for(var i=0;i<4;i++){
		    var point=starts[i];
		    var step=steps[i];
		    var res=null;
		    for(var j=0;j<xrange;j++){
		      	var predict=svm.predictOne(point);
		      	if(res===null){
		        	res=predict;
		      	}else if(res!=predict){
		        	line.push(point);
		        	break;
		      	} 
		      	point[0]=point[0]+step[0];
		      	point[1]=point[1]+step[1];
		    } 
		}
		line=line.map(p=>{return {x:p[0],y:p[1]};});
		return line;
	}
}
