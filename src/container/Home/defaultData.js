let id8= '_' + Math.random().toString(36).substr(2, 9);
let id1= '_' + Math.random().toString(36).substr(2, 9);
let id2= '_' + Math.random().toString(36).substr(2, 9);
let id3= '_' + Math.random().toString(36).substr(2, 9);
let id4= '_' + Math.random().toString(36).substr(2, 9);
let id5= '_' + Math.random().toString(36).substr(2, 9);
let id6= '_' + Math.random().toString(36).substr(2, 9);
let id7= '_' + Math.random().toString(36).substr(2, 9);

const list = {
  heading: 'Backlogs',
  cardsById: {
    [id1]: {
      text: 'when we reopen a topic, (when the successfully reopened dialog box appears), its a success!'
    }, 
    [id2]: {
      text: 'Big Bug when adding participants and refresh the page and close a topic'
    },
    [id3]: {
      text: 'when a user load more topics and select one from them (/conversations/xyz), and then go to closed topics list'
    }
  },
  allCardIds: [id1,id2,id3]
}
const list2 = {
  heading: 'Prioritized',
  cardsById: {
    [id4]: {
      text: 'when the successfully reopened dialog box appears, its a success!'
    }, 
    [id5]: {
      text: 'Small Bug when removing participants and refresh the page and close a topic'
    }
  },
  allCardIds: [id4, id5]
}
const board = {
  heading: 'A Mini Trello Project',
  listsById : {
    [id6]: list,
    [id7]: list2
  },
  allListIds: [id6, id7]
}
let postData = {
  id: id8,
  data: board
}

export default postData;