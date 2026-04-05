const moment = require('moment')
/*
export function someAction (context) {
}
*/

export async function loadBenchmarks ({ commit }, { days }) {
  // TODO: Paginate...
  //   get the global sequence of the last action, use it in globalsequence filter on the next request
  //   for the globalsequence filter, do $LAST_ACTION_SEQUENCE-Integer.max
  //   until we get back less than the limit, which indicates the end
  let haveMore = true
  let batch = 0
  let params = {
    filter: 'eosmechanics:cpu',
    after: moment.utc().subtract(days, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    limit: 1000,
    sort: 'asc'
  }
  let bpMap = {}
  const MAX_BATCHES = 10
  let lastBiggest = 0
  while (haveMore && batch < MAX_BATCHES) {
    console.log(`Doing query with ${JSON.stringify(params)}`)
    const benchmarks = await this.$hyperion.get('v2/history/get_actions', {
      params
    })
    let acts = (benchmarks.data && benchmarks.data.actions) || []
    let batchCount = acts.length
    haveMore = (params.limit === batchCount)
    console.log(`Batch ${++batch} had ${batchCount} actions and is at global_sequence ${params.global_sequence}`)
    let biggest = 0
    for (let i = 0; i < acts.length; i++) {
      if (acts[i].global_sequence > biggest) { biggest = acts[i].global_sequence }
      const action = acts[i]
      const producer = action.producer
      const cpuUs = action.cpu_usage_us
      const timestamp = action.timestamp
      const momentTimestamp = moment(timestamp)
      const point = [momentTimestamp.valueOf(), cpuUs]
      if (!Object.prototype.hasOwnProperty.call(bpMap, producer)) {
        bpMap[producer] = [point]
      } else {
        bpMap[producer].push(point)
      }
    }
    if (biggest <= lastBiggest) {
      console.warn('global_sequence not advancing, stopping pagination')
      break
    }
    lastBiggest = biggest
    params.global_sequence = `${biggest}-${Number.MAX_SAFE_INTEGER}`
    if (params.after) { delete params.after }
  }

  let seriesArray = []

  for (const bp in bpMap) {
    seriesArray.push({
      name: bp,
      data: bpMap[bp]
    })
  }

  commit('validators/setBenchmarks', seriesArray, { root: true })
}
