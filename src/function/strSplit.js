//根据 separator 来分割 value ,得到分割后数组的第 index 个元素
export default function(value,separator,index) {
	let str = value.split(separator)[index];
	return str;
}