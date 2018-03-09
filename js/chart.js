/**
 * D3封装
 */
!function($){
	// 绘图
	var D3={
		colors:d3.scaleOrdinal(d3.schemeCategory10), // 颜色集合
		line:function(svg,p1,p2,color){
			var line=svg.append('line')
					    .attr('x1',p1.x)
					    .attr('y1',p1.y)
					    .attr('x2',p2.x)
					    .attr('y2',p2.y)
					    .classed('line',true);
			color && line.style('stroke',color);
			return line;
		},
		circle:function(svg,p,r,color){
		    var circle=svg.append('circle')
						  .attr('cx',p.x)
						  .attr('cy',p.y)
						  .attr('r',r)
						  .classed('circle',true);
			color && circle.style('fill',color);
			return circle;
		},
		rect:function(svg,p,w,h,color){
		    var rect=svg.append('rect')
					    .attr('x',p.x)
					    .attr('y',p.y)
					    .attr('width',w)
					    .attr('height',h)
					    .classed('rect',true);
			color && rect.style('fill',color);
			return rect;
		},
		text:function(svg,p,text,color){
		    var text=svg.append('text')
					    .attr('x',p.x)
					    .attr('y',p.y)
					    .text(text)
					    .classed('text',true);
			color && text.style('fill',color);
			return text;
		},
		view:function(svg,p,w,h,color){
			var svg=svg.append('svg')
					   .attr('width',w)
					   .attr('height',h)
					   .classed('svg',true);
			color && svg.style('fill',color);
			var rect=svg.append('g').attr('id','rect').attr('transform','translate('+p.x+','+p.y+')');
			var mask=svg.append('g').attr('id','mask');
			return {view:rect,mask:mask};
		},
		axis:function(svg,x,y,unit){
			var xAxis=d3.scaleLinear().rangeRound([0,x*unit]).domain([0,x]);
		  	var yAxis=d3.scaleLinear().rangeRound([y*unit,0]).domain([0,y]);
		  	svg.append('g').attr('transform','translate(0,'+y*unit+')').call(d3.axisBottom(xAxis).ticks(x/10));
		  	svg.append('g').call(d3.axisLeft(yAxis).ticks(y/10));
		  	return {xAxis:xAxis,yAxis:yAxis}
		},
		legend:function(svg,h,w){
			var legend=svg.append('g')
						  .attr('width',w)
						  .attr('height',h)
						  .attr('class','legend')
		   				  .attr('transform','translate(-10,5)');
		   	return legend;
		},
		alegend:function(svg,w,i,text,color){
			this.rect(svg,{x:w-40,y:i*20},10,10,color);
			this.text(svg,{x:w-25,y:i*20+10},text,color);
		},
		title:function(svg,p,title,color){
			var title=svg.append('text')
						 .attr('x',p.x)
						 .attr('y',p.y)
						 .attr('class', 'title')
						 .text(title);
			color && title.style('fill',color);
			return title;
		}
	};
	window.D3=D3;
}(jQuery);


/**
 * 图表包装
 */
!function($){
	// 配置
	var defualt={
		x:100,                                       // X轴
		y:100,                                       // Y轴
		unit:2,                                      // 比例  1单位转像素
		offset:{top:10,left:25},                     // 绘图区域  offset
		index:-1,                                    // 颜色小标
	};
	
	var chart=function(options){
		// 数据
		this.data=[];
		
		// 配置
		this.config=$.extend({},defualt,options,true);
		this.root=d3.select(this.config.dom);
		var offset=this.config.offset;
		var left=offset.left;
		var top=offset.top;
		var unit=this.config.unit;
		
		var x=this.config.x;
		var y=this.config.y;
		var w=x*unit+left+20;
		var h=y*unit+top+20;
		
		// 区域
		var client=D3.view(this.root,{x:left,y:top},w,h);
		// 坐标轴
		var axis=D3.axis(client.view,x,y,unit);
		// 图例
		var legend=D3.legend(client.view,100,100);
		// 标题
		var title=D3.title(client.view,{x:10,y:10},this.config.title||'');
		
		// 标题
		this.title=title;
		this.legend=legend;
		this.view=client.view;
		this.mask=client.mask;
		this.xAxis=axis.xAxis;
		this.yAxis=axis.yAxis;
	};
	chart.prototype={
		alegend:function(){
			this.config.index+=1;
			var unit=this.config.unit;
			var i=this.config.index;
			
			var x=this.config.x;
			var y=this.config.y;
			var w=x*unit;
			var h=y*unit;
			
			// 添加数据项
			D3.alegend(this.legend,w,i,'集合-'+i,D3.colors(i));
		},
		circle:function(points,size){
			$('[data-id=center]',this.config.dom).remove();
			var res=[];
			var self=this;
			var points=[].concat(points);
			for(var i=0;i<points.length;i++){
				var p=points[i];
				var circle=D3.circle(self.view,self.axis2pix(p.x,p.y),size||3,D3.colors(i));
				circle.attr('data-id','center');
				var wrap={
				    x:p.x,
				    y:p.y,
				    label:i,
				    el:circle
			    };
			    res.push(wrap);
			}
			return res;
		},
		cluster:function(p,delay){
		    var r=this.axis2pix(p.size,0).x+7;
		    var delay=delay?delay():0;
		    // hock
			delay==1000 && $('.cluster',this.config.dom).remove();
			D3.circle(this.view,this.axis2pix(p.x,p.y),0)
			  .classed('cluster',true).transition().delay(delay)
			  .duration(1000).attr('r',r);
		},
		line:function(line,color){
			$('.line',this.config.dom).remove();
			var self=this;
			var p1=self.axis2pix(line[0].x,line[0].y);
			var p2=self.axis2pix(line[1].x,line[1].y);
		    D3.line(self.view,p1,p2,color);
		},
		lines:function(lines,color){
			var self=this;
			lines.map(function(line){
				var p1=self.axis2pix(line[0].x,line[0].y);
				var p2=self.axis2pix(line[1].x,line[1].y);
			    D3.line(self.view,p1,p2,color);
			});
		},
		fill:function(dataset,delay){
			var points=[].concat(dataset);
			var delay=delay?delay():0;
			points.map(function(point){
				point.el.transition().delay(delay).duration(1000)
					 .style('fill',D3.colors(point.label));
			});
		},
	  	area:function(callback){
	  		$('.predict',this.config.dom).remove();
	  		var stop=4;
	  		// 区域内所有点
		    var test=[];
		    for(var i=0;i<this.config.x;i+=stop){
		      	for(var j=0;j<=this.config.y;j+=stop){
			        test.push({x:i,y:j});
			    }
		    }
		    for(var i=0;i<test.length;i++){
		      	var p=test[i];
		      	var res=callback(p);
		      	var p=this.axis2pix(p.x,p.y);
		      	// hock
		      	if(p.y<200){
		      		D3.rect(this.view,p,stop*2-1,stop*2-1,D3.colors(res)).classed('predict',true);
		      	}
		    }
	  	},
	  	areabatch:function(callback){
	  		$('.predict',this.config.dom).remove();
	  		var stop=4;
	  		// 区域内所有点
		    var test=[];
		    for(var i=0;i<this.config.x;i+=stop){
		      	for(var j=0;j<=this.config.y;j+=stop){
			        test.push([i,j]);
			    }
		    }
		    var res=callback(test);
		    for(var i=0;i<test.length;i++){
		      	var p=test[i];
		      	var p=this.axis2pix(p[0],p[1]);
		      	// hock
		      	if(p.y<200){
		      		D3.rect(this.view,p,stop*2-1,stop*2-1,D3.colors(res[i])).classed('predict',true);
		      	}
		    }
	  	},	
		move:function(dataset){
			var delay=0;
			var self=this;
			dataset.map(function(point){
				var p=self.axis2pix(point.x,point.y);
				point.el.transition().delay(delay).duration(1000)
					 .attr('cx',p.x).attr('cy',p.y);
				delay=delay+1000;
			});
		},
		pix2axis:function(x,y){
			var x=Math.round(this.xAxis.invert(x-this.config.offset.left));
			var y=Math.round(this.yAxis.invert(y-this.config.offset.top));
			return {x:x,y:y};
		},
		axis2pix:function(x,y){
			return {x:this.xAxis(x),y:this.yAxis(y)};
		},
		on:function(type,callback){
			this[type](callback);
		},
		click:function(callback){
			this.alegend();
			var self=this;
			var root=self.root;
			var offset=self.config.offset;
		    root.on('click',function(){
		    	var i=self.config.index;
		    	
		    	var x=d3.mouse(this)[0];
		      	var y=d3.mouse(this)[1];
		      	
		      	if(i!=-1){
		      		var index=i;
		      		if(self.label){
		      			index=self.label;
		      		}
			        var circle=D3.circle(self.view,{x:x-offset.left,y:y-offset.top},3,D3.colors(index));
			        var point=self.pix2axis(x,y);
			        point.label=index;
			        point.coordinates={x:x,y:y};
			        point.el=circle;
			      	self.data.push(point);
			      	callback && callback(point);
			      }
		    });
		},
		mousemove:function(callback){
			var self=this;
			var root=this.root;
			var offset=self.config.offset;
		    root.on('mousemove', function() {
				$('#mask',self.config.dom).empty();
				
				// 坐标
				var x=d3.mouse(this)[0];
				var y=d3.mouse(this)[1];
				
				// 是否越界
				var point=self.pix2axis(x,y);
				if(point.x<0||point.x>self.config.x||
				   point.y<0||point.y>self.config.y){
				    return;
				}
				   
				// KNN
				var res=callback({x:x,y:y},self.data);
				var dataset=res.dataset;
				var label=res.label;
  				// 记录
  				self.label=label;
  				
  				// 绘图
  				var dismax=dataset[dataset.length-1].d;
				dataset.map(function(item){
				    D3.line(self.mask,item.p.coordinates,{x:x,y:y});
				});
				D3.circle(self.mask,{x:x,y:y},dismax+5).classed('range',true).classed('circle',false);
				D3.circle(self.mask,{x:x,y:y},3,D3.colors(label),'mask');
				
		    });
		},
		clean:function(){
		  this.data=[];
		  this.config.index=-1;
		  this.root.on('click',null);
		  this.root.on('mousemove',null);
		  $('.line',this.config.dom).remove();
		  $('.rect',this.config.dom).remove();
		  $('.text',this.config.dom).remove();
		  $('.circle',this.config.dom).remove();
		  $('.cluster',this.config.dom).remove();
		}
	};
	$.fn.chart=function(options){
		var options=options||{};
		if(typeof options == 'string'){
			options={title:options};
		}
		options.dom=$(this)[0];
		return new chart(options);
	};
}(jQuery);



/**
 * 树包装
 */
!function($){
	// 配置
	var defualt={
		x:100,                                       // X轴
		y:100,                                       // Y轴
		unit:3,                                      // 比例  1单位转像素
		offset:{top:20,left:50},                     // 绘图区域  offset
	};
	
	var tree=function(options){
		// 数据
		this.data=[];
		
		// 配置
		this.config=$.extend({},defualt,options,true);
		this.root=d3.select(this.config.dom);
		var offset=this.config.offset;
		var left=offset.left;
		var top=offset.top;
		var unit=this.config.unit;
		
		var x=this.config.x;
		var y=this.config.y;
		var w=x*unit;
		var h=y*unit;
		
		// 区域
		var client=D3.view(this.root,{x:left,y:top},w,h);
		// 标题
		var title=D3.title(client.view,{x:10,y:10},this.config.title||'');
		
		// 标题
		this.title=title;
		this.view=client.view;
		this.config.width=w;
		this.config.height=h;
		
	};
	tree.prototype={
		tree:function(treedata,color){
			$('#tree',this.config.dom).empty();
			
			var offset=this.config.offset;
			var left=offset.left;
			var top=offset.top;
			var w=this.config.width-100;
			var h=this.config.height-100;
			var treemap=d3.tree().size([w,h]).separation(function(a,b){
				return a.parent==b.parent?1:2;
			});
			var root=d3.hierarchy(treedata,function(d){return d.children;});

			// tree布局
			var treenodes=treemap(root);
			var nodes=treenodes.descendants();
			var links=treenodes.descendants().slice(1);

			// 绘制线段
			var link=this.view.selectAll('.link').data(links).enter().append('path').attr('class','link')
							  .attr('d',function(d){
							    	return ('M'+d.y+','+d.x+'C'+(d.y+d.parent.y)/2+','+d.x+' '+(d.y+d.parent.y)/2+','+d.parent.x+' '+d.parent.y+','+d.parent.x);
								});
			

		    // 绘制节点
			var node=this.view.selectAll('.node').data(nodes).enter().append('g')
		    				  .attr('transform', function(d) {
		      						return 'translate('+d.y+','+d.x+')';
		    					});
		    // 节点文本
  			node.append('circle').attr('r',3).classed('node',true)
  			.style("stroke",function(d){
		    	return d.children?'#555':color||D3.colors(d.data.label);
		    }).style("fill",function(d){
		    	return d.children?'#555':color||D3.colors(d.data.label);
		    });
		    
			node.append('text').attr('dy','0px').attr('dx','0px')
			    .style('text-anchor',function(d){
			      return d.children?'end':'start';
			    })
			    .text(function(d){
			      return d.data.name;
			    }).classed('tree-text',true);
		},
		clean:function(){
		  $(this.config.dom).empty();
		}
	};
	$.fn.tree=function(options){
		var options=options||{};
		if(typeof options == 'string'){
			options={title:options};
		}
		options.dom=$(this)[0];
		$(this).empty();
		return new tree(options);
	};
}(jQuery);