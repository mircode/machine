/**
 * 数学辅助类
 */
var Matrix={
	/**
	 * 距离公式
	 */
	distance:function(p1,p2){
		return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
	},
}
