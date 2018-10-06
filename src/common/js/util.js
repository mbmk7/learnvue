/**
 * 解析url参数
 * @example ?id=12345&a=b/
 * @return Object {id:12345,a:b}
 */
export function urlParse () {
  let url = window.location.search;
  // console.log(url);
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg); // ['?id=12345','&a=b']
  // console.log(arr);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('='); // ['id=12345'],['a=b'] => ['id',12345],['a','b']
      let key = decodeURIComponent(tempArr[0]);
      let value = decodeURIComponent(tempArr[1]);
      obj[key] = value;
    });
  }
  return obj;
}
