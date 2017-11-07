function changeTime(count,day) {
	if(day) {
		var date = new Date(day);
	} else {
		var date = new Date();
	}
  date.setDate(date.getDate()+count);//获取count天后的日期
  var y = date.getFullYear();
  var m = date.getMonth()+1;
  var d = date.getDate();
  return y+"-"+m+"-"+d;
}
export {
	changeTime
}