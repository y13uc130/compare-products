const initialState = {
  boards: {},
  allBoardIds: [],
  selectedBoardId: null
};

export const removeCardId = (Obj, cId) => {
  let finalObj = Object.assign({}, Obj);
  delete finalObj[cId];
  return finalObj;
}
export const removeList = (Obj, lId) => {
  let finalObj = Object.assign({}, Obj);
  delete finalObj[lId];
  return finalObj;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DUMP_BOARDS_DATA':
      return {
        ...state,
        boards: {
          ...state.boards, ...action.data.boards
        },
        allBoardIds : [...state.allBoardIds, ...action.data.allBoardIds],
        selectedBoardId: action.data.selectedBoardId
      }
    case 'SET_SELECTED_BOARD':
      return {
        ...state,
        selectedBoardId: action.data
      }
    case 'BOARDS_DATA':
      return {
        ...state,
        boards: {
          ...state.boards,
          [action.data.id]: action.data.data
        },
        allBoardIds: [...state.allBoardIds, action.data.id],
        selectedBoardId: action.data.id
      }
    case 'ADD_NEW_CARD':
      const { bId, lId, data, cId, edit } = action.data;
      return {
        ...state,
        boards: {
          ...state.boards,
          [bId]: {
            ...state.boards[bId],
            listsById: {
              ...state.boards[bId].listsById,
              [lId]: {
                ...state.boards[bId].listsById[lId],
                cardsById: {
                  ...state.boards[bId].listsById[lId].cardsById,
                  [cId] : {
                    text: data
                  }
                },
                allCardIds: !state.boards[bId].listsById[lId] ? 
                  [cId] : !edit ? 
                  [...state.boards[bId].listsById[lId].allCardIds, cId] :
                   [...state.boards[bId].listsById[lId].allCardIds] 
              }
            }
          }
        }
      }
      case 'REMOVE_CARD': 
      let { bId: bId1, lId: lId1, cId: cId1 } = action.data;
      return {
        ...state,
        boards: {
          ...state.boards,
          [bId1]: {
            ...state.boards[bId1],
            listsById: {
              ...state.boards[bId1].listsById,
              [lId1]: {
                ...state.boards[bId1].listsById[lId1],
                cardsById: removeCardId(state.boards[bId1].listsById[lId1].cardsById, cId1),
                allCardIds : [...state.boards[bId1].listsById[lId1].allCardIds.filter(id=>id!==cId1)]
              }
            }
          }
        }
      }
    case 'ADD_EDIT_LISTS':
    let { bId: bId2, lId: lId2, data: data2, edit: edit2 } = action.data;
      return {
        ...state,
        boards: {
          ...state.boards,
          [bId2]: {
            ...state.boards[bId2],
            listsById: {
              ...state.boards[bId2].listsById,
              [lId2]: {
                ...state.boards[bId2].listsById[lId2],
                heading: data2,
                cardsById: edit2 ? {
                  ...state.boards[bId2].listsById[lId2].cardsById
                }: {},
                allCardIds : edit2 ? [...state.boards[bId2].listsById[lId2].allCardIds] : []
              },
            },
            allListIds: edit2 ? [...state.boards[bId2].allListIds] : [...state.boards[bId2].allListIds, lId2]
          }
        }
      }
    case 'REMOVE_LIST':
    let { bId: bId3, lId: lId3 } = action.data;
      return {
        ...state,
        boards: {
          ...state.boards,
          [bId3]: {
            ...state.boards[bId3],
            listsById: removeList(state.boards[bId3].listsById, lId3),
            allListIds: [...state.boards[bId3].allListIds.filter(id=>id!==lId3)]
          }
        }
      }
    case 'ADD_EDIT_BOARD':
      let { bId: bId4, data: data4, edit: edit4 } = action.data;
      return {
        ...state,
        boards: {
          ...state.boards,
          [bId4]: {
            ...state.boards[bId4],
            heading: data4,
            listsById: state.boards[bId4] && state.boards[bId4].listsById ? {...state.boards[bId4].listsById} : {},
            allListIds: state.boards[bId4] && state.boards[bId4].allListIds ? [...state.boards[bId4].allListIds] : []
          },
        },
        selectedBoardId: bId4,
        allBoardIds: edit4 ? [...state.allBoardIds]: [...state.allBoardIds, bId4]
      }
    default:
      return state;
  }
};
