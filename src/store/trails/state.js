export default () => ({
  ballots: {
    list: {
      data: [],
      loaded: false,
      pagination: {
        limit: 200
      }
    },
    view: {
      ballot: null
    }
  },
  ballotVoters: null,
  userTreasuries: null,
  treasuries: {
    list: {
      data: [],
      loaded: false,
      pagination: {
        limit: 100
      }
    },
    view: {
      treasury: null
    }
  },
  fees: []
})
