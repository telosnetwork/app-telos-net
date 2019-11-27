export const ballots = ({ ballots }) => ballots.list.data
export const ballotsLoaded = ({ ballots }) => ballots.list.loaded
export const ballot = ({ ballots }) => ballots.view.ballot

export const treasuries = ({ treasuries }) => treasuries.list.data
export const treasuriesOptions = ({ treasuries }) => treasuries.list.data.map(treasury => ({
  label: `${treasury.title} (${treasury.symbol})`,
  value: treasury.symbol
}))
export const treasuriesLoaded = ({ treasuries }) => treasuries.list.loaded
export const treasury = ({ treasuries }) => treasuries.view.treasury
export const treasuryFees = ({ fees }) => fees.find(fee => fee.key === 'treasury')
