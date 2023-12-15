export function genSessionId(length:any) {
  var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  for (var i = 0, id = "", len = str.length; i < length; i++) {
    id += str[Math.floor(Math.random() * len)];
  }
  return id;
}

export function urlEncode(param:any, key:any, encode:any) {
  if (param == null) return "";
  var paramStr = "";
  var t = typeof param;
  if (t == "string" || t == "number" || t == "boolean") {
    paramStr +=
      "&" +
      key +
      "=" +
      (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k =
        key == null
          ? i
          : key + (param instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}
export function createUrl(obj) {
  var length = obj && obj.length,
    idx = 0,
    url = "";
  for (var key in obj) {
    if (key != "url" && obj[key] !== null) {
      url += key + "=" + encodeURIComponent(obj[key]) + "&";
    }
  }
  return url.substring(0, url.lastIndexOf("&"));
}
