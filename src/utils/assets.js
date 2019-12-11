export const supplyToAsset = supply => {
  const [, digits] = supply.replace(/[a-zA-Z]*\s*/g, '').split('.')
  const symbol = supply.replace(/\d*\s*\.*/g, '')
  const precision = (digits && digits.length) || 0
  return `${precision},${symbol}`
}

export const supplyToSymbol = supply => {
  return supply.replace(/[^A-Z]*/g, '')
}

export const supplyToDecimals = supply => {
  const [, digits] = supply.replace(/[a-zA-Z]*\s*/g, '').split('.')
  return (digits && digits.length) || 0
}
