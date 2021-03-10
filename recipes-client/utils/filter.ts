export function filterKeys(dict: Record<string, unknown>, keys: string|string[]): Record<string, unknown> { 
  const keys_ = Array.isArray(keys) ? keys : [keys];
  return Object.keys(dict
    ).filter(key_ => (keys_.includes(key_))
    ).reduce((obj, key_) => {
        obj[key_] = dict[key_];
        return obj;
      }, {});
}

export function filterOutKeys(dict: Record<string, unknown>, keys: string|string[]): Record<string, unknown> { 
  const keys_ = Array.isArray(keys) ? keys : [keys];
  return Object.keys(dict
    ).filter(key_ => (!keys_.includes(key_))
    ).reduce((obj, key_) => {
        obj[key_] = dict[key_];
        return obj;
      }, {});
}
