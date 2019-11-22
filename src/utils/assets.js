export const supplyToAsset = supply => {
  const [, digits] = supply.replace(/[a-zA-Z]*\s*/g, '').split('.')
  const symbol = supply.replace(/\d*\s*\.*/g, '')
  const precision = (digits && digits.length) || 0
  return `${precision},${symbol}`
}

export const supplyToSymbol = supply => {
  return supply.replace(/\d*\s*\.*/g, '')
}
