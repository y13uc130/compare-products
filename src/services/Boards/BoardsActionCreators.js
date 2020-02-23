
export const setBoardsData = (data, callback) => async (dispatch) => {
  dispatch({type:'BOARDS_DATA', data});
  callback && callback();
}

export const addCardToList = (data, callback) => async dispatch => {
  dispatch({type: 'ADD_NEW_CARD', data});
  callback && callback();
}

export const removeCard = (data, callback) => async dispatch => {
  dispatch({type: 'REMOVE_CARD', data});
  callback && callback();
}
export const addEditListHeading = (data) => async dispatch => {
  dispatch({type: 'ADD_EDIT_LISTS', data});
}
export const removeList = (data) => async dispatch => {
  dispatch({type: 'REMOVE_LIST', data});
}
export const addEditBoardHeading = (data, callback) => async dispatch => {
  dispatch({type: 'ADD_EDIT_BOARD', data});
  callback && callback();
}

export const dumpBoardsDataOnStore = (data) => async dispatch => {
  dispatch({type: 'DUMP_BOARDS_DATA', data});
}
export const setSelectedBoard = (data) => async dispatch => {
  dispatch({type: 'SET_SELECTED_BOARD', data});
}