//根据 value 得到想要的 f 时间格式
export default function(value,f) {
	const date = new Date(convert(value));
	let str = f ? f : 'y-m-d h:i:s';
	str = str.replace('y', date.getFullYear());
	str = str.replace('m', toDB(date.getMonth() + 1));
	str = str.replace('d', toDB(date.getDate()));
	str = str.replace('h', toDB(date.getHours()));
	str = str.replace('i', toDB(date.getMinutes()));
	str = str.replace('s', toDB(date.getSeconds()));
	return str;
}

function toDB(nub) {
	return nub < 10 ? "0" + nub : "" + nub;
}	

function convert(value) {
	return value.replace(/-/g,'/');
}