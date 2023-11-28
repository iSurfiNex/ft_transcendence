function identity(strings, ...values) {
  // Combine the strings and values to produce the final result
  const result = strings.reduce((acc, str, index) => {
    return index < values.length ? acc + str + values[index] : acc + str;
  }, '');

  return result;
}

export const html = identity
export const css = identity
