export function genSessionId(length:any) {
  var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  for (var i = 0, id = "", len = str.length; i < length; i++) {
    id += str[Math.floor(Math.random() * len)];
  }
  return id;
}