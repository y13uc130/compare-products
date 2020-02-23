
export function setBoardsOnLS(data) {
  localStorage.setItem('boards', JSON.stringify(data));
}
export function getBoardsFromLS() {
  return JSON.parse(localStorage.getItem('boards'));
}
export function setallBoardIdsOnLS(data) {
  localStorage.setItem('allBoardIds', JSON.stringify(data));
}
export function getallBoardIdsFromLS() {
  return JSON.parse(localStorage.getItem('allBoardIds'));
}
export function getSelectedBoardIdFromLS() {
  return JSON.parse(localStorage.getItem('selectedBoard'));
}
export function setSelectedBoardIdOnLS(data) {
  localStorage.setItem('selectedBoard', JSON.stringify(data));
}