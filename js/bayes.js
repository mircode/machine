BAYES={
	bayes:function(dataset){
		var features=[];
		var labels=[];
		dataset.map(function(p) {
		    features.push([p.x,p.y]);
		    labels.push(p.label);
		});
		
		var bayes=new ML.SL.NaiveBayes();
		bayes.train(features,labels);
		this.model=bayes;
		return bayes;
	}
}
