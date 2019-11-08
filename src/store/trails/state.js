export default () => ({
  ballots: {
    list: {
      data: [],
      loaded: false,
      pagination: {
        limit: 100
      }
    },
    view: {
      ballot: null
    }
  },
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
