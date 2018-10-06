/**
 *
 *
 * @export
 * @param {*} id
 * @param {*} key string
 * @param {*} value
 */
export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller);
  if (!seller[id]) {
    return def;
  }
  let sellerId = seller[id];
  if (!sellerId[key]) {
    return def;
  }
  return sellerId[key];
}
