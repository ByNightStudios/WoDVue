class Helpers {
  typeOf(value) {
    let s = typeof value;
    if (s === 'object') {
      if (value) {
        if (
          typeof value.length === 'number' &&
          !Object.propertyIsEnumerable.call(value, 'length') &&
          typeof value.splice === 'function'
        ) {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  }
}

export default new Helpers();
