function bigIntToString(value) {
  const MAX_SAFE_INTEGER = 2 ** 53 - 1;
  return value <= MAX_SAFE_INTEGER ? Number(value) : value.toString();
}

export default bigIntToString