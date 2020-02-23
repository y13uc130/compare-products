export const initailRequestData = Object.assign({}, {
  loading: false,
  err: null,
  data: null
});

export function startLoading(state, name) {
  const updateState = {
    loading: true
  };
  return Object.assign({}, state, name ? {
    [name]: updateState
  } : updateState)
}

export function failure(state, name, data) {
  const updateState = {
    loading: false,
    err: data.err
  };
  return Object.assign({}, state, name ? {
    [name]: updateState
  } : updateState)
}

export function success(state, name, data) {
  const updateState = {
    loading: false,
    data: data.data
  };
  return Object.assign({}, state, name ? {
    [name]: updateState
  } : updateState)
}

export function updateState(state, name, data) {
  return Object.assign({}, state, {
    [name]: data.data
  })
}

export function getCurrencySymbol(state) {
  const currencyCodes = {
    AUD: "AU$",
    CAD: "CA$",
    CNY: "CN¥",
    EUR: "€",
    GBP: "£",
    HKD: "HK$",
    INR: "₹",
    SGD: "S$",
    USD: "$",
    ZAR: "R",
  };
  const {
    app: {currency}
  } = state;
  return currencyCodes[currency]
}