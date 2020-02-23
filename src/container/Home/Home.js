import React, { Component } from 'react';
import './styles.scss';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setBoardsData,
  removeCard,
  addEditListHeading,
  removeList,
  addEditBoardHeading,
  dumpBoardsDataOnStore,
  setSelectedBoard,
  addCardToList } from '../../services/Boards/BoardsActionCreators';
import { getBoardsFromLS, setBoardsOnLS, setallBoardIdsOnLS, getallBoardIdsFromLS, getSelectedBoardIdFromLS, setSelectedBoardIdOnLS } from '../../utils/localStorage';
import DefaultDataJs from './defaultData';
import classnames from 'classnames';
import HeadingField from '../../components/HeadingField';
import List from '../../components/List';
import BoardsList from '../../components/BoardsList';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardValue: '',
      ListIdToAdd: null,
      editCard: null,
      showAddNewCard: null,
      editListHeading: null,
      editBoardHeading: null,
      scrollToThis: null,
      showAddNewBoard: null,
      boardIdToAdd: null,
      selectedBoardId: null,
      loading: true,
      addedToLSOnce: false
    };
    this.timeoutToScrollUp = false;
    this.crossIcon = 'https://img.perniaspopupshop.com/ppus-assets/icons/cross-black.svg';
  }
  componentDidMount() {
    // onReload, check if there is data in LS, if yes, then dump it in redux store, else use defaultDataJs
    if(!getBoardsFromLS()) {
      this.props.setBoardsData(DefaultDataJs);
    } else {
      let postData = {
        boards: getBoardsFromLS(),
        allBoardIds: getallBoardIdsFromLS(),
        selectedBoardId: getSelectedBoardIdFromLS()
      }
      this.props.dumpBoardsDataOnStore(postData);
    }
    window.addEventListener('beforeunload', ()=>this.componentGracefulUnmount(this.props));
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(prevState.scrollToThis !== this.state.scrollToThis && !!this.state.scrollToThis) {
      this.scrollNewCardToView(this.state.scrollToThis);
    }
    if(prevState.editListHeading !== this.state.editListHeading) {
      setTimeout(() => {
        if(this.state.editListHeading){
          window.addEventListener('click', this.closeEditListHeadingInput)
        }
        else{
          window.removeEventListener('click', this.closeEditListHeadingInput)
        }
      }, 0)
    }
    if(!this.state.addedToLSOnce && (prevProps.boards !== this.props.boards || prevProps.selectedBoardId !==this.props.selectedBoardId)) {
      this.setStoreDataOnLS(this.props);
      this.setState({
        addedToLSOnce: true
      })
    }
  }
  removeCard = (bId, lId, cId) => {
    let postData = {
      bId,
      lId,
      cId
    }
    this.setState({
      cardValue: ''
    })
    this.props.removeCard(postData);
  }
  handleEditCard = (cId, cardValue) => {
    this.setState({
      editCard: cId,
      cardValue,
      showAddNewCard: null,
      editListHeading: null,
      editBoardHeading: null,
      showAddNewBoard: null,
      boardIdToAdd: null
    }, () =>{
      this.handleTextAreaHeight();
    })
  }
  
  componentGracefulUnmount (props) {
    //before component unmounts due to window reloading, setting the redux store data in LS(Local Storage)
    if(getBoardsFromLS()) {
      this.setStoreDataOnLS(props);
      window.removeEventListener('beforeunload', this.componentGracefulUnmount);
    }
  }
  setStoreDataOnLS = (props) => {
    setBoardsOnLS(props.boards);
    setallBoardIdsOnLS(props.allBoardIds);
    setSelectedBoardIdOnLS(props.selectedBoardId);
  }
  onDragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
  }
  onDragOver = (event) =>{
    event.preventDefault();
  }
  getSourceDataIds = (data) => {
    let arrOfIds = data.split('-');
    let bId = arrOfIds[0];
    let lId = arrOfIds[1];
    let cId = arrOfIds[2];
    return {
      bId,
      lId,
      cId
    }
  }
  onDrop = (ev) => {
    ev.preventDefault();
    let sourceId = ev.dataTransfer.getData("text/plain");
    let sourceIdEl = document.getElementById(sourceId) || 'notValid';
    if(sourceIdEl === 'notValid') {
      return false;
    } 
    let sourceIdParentEl= sourceIdEl.parentElement;
    if(ev.target.className === 'cardText') {
      //if source elm dragged to cardText, drop it in its grandParent elm- cardsWrapper.
      let targetEl = ev.target.parentElement.parentElement;
      if(targetEl.className === 'cardsWrapper') {
        this.moveToOtherList(sourceIdParentEl, targetEl, sourceIdEl);
      }
    } else if(ev.target.className === 'card prel') {
      //if source elm dragged to card, drop it in its parent elm- cardsWrapper.
      let targetEl = ev.target.parentElement;
      if(targetEl.className=='cardsWrapper') {
        this.moveToOtherList(sourceIdParentEl, targetEl, sourceIdEl);
      }
    } else if(ev.target.className === 'cardsWrapper') {
      //if source elm dragged to cardsWrapper, drop it.
      let targetEl = ev.target;
      this.moveToOtherList(sourceIdParentEl, targetEl, sourceIdEl);        
    } else if(ev.target.className === 'addNewCard') {
      //if source elm dragged to addNewCard, drop it in its previous sibling- cardsWrapper.      
      let targetEl = ev.target.previousElementSibling;
      if(targetEl.className === 'cardsWrapper') {
        this.moveToOtherList(sourceIdParentEl, targetEl, sourceIdEl);
      }
    } else if(ev.target.className ==='list prel') {
      //if source elm dragged to list, drop it in its 2nd child elm- cardsWrapper.
      let targetEl = ev.target.children[1];
      if(targetEl.className=='cardsWrapper') {
        this.moveToOtherList(sourceIdParentEl, targetEl, sourceIdEl);
      }
    }
  }
  handleAddNewCard = (listIndex) => {
    this.setState({
      showAddNewCard: listIndex,
      editCard: null,
      editListHeading: null,
      editBoardHeading: null,
      showAddNewBoard: null,
      boardIdToAdd: null
    })
  }
  handleCardDataChange = ({ target: { value } }) => {
    //Not letting empty text as card data.
    if((!this.state.cardValue.length && !value.trim().length)) {
      return false;
    } else {
      this.setState({
        cardValue : value
      })
    }
  }
  handleCloseBtn = (edit) => {
    if(edit) {
      this.setState({
        cardValue : '',
        editCard: false
      })
    } else {
      this.setState({
        showAddNewCard: null
      })
    }
    this.clearTextareaAdjustment();
  }
  resize = (text) =>{
    //resize textarea according to current height and content.
    if(Number(text.style.height.slice(0,-2))< 160) {
      text.style.height = 'auto';
      text.style.height = text.scrollHeight+'px';
    }
  }
  handleTextAreaHeight = () => {
    let text = document.querySelector(`.textCardArea`);
    setTimeout(()=>this.resize(text), 0);
  }
  handleEnteronCardInput = (e, bId, lId, cId, edit) => {
    if (e.key === 'Enter') {
      !!this.state.cardValue.length && this.handleAddCard(bId, lId, cId, edit);
    }
  }
  handleAddCard = (bId, lId, cId, edit) => {
    if(this.state.cardValue && !!this.state.cardValue.length) {
      if(!cId) { // adding or editing board/list heading
        if(!lId) { //adding or editing board heading
          let postData = {
            bId,
            data: this.state.cardValue,
          }
          if(edit) {
            postData.edit = true;  
          } 
          this.setState({
            editListHeading: null,
            ListIdToAdd: null,
            cardValue: '',
            editBoardHeading: null,
            showAddNewBoard: false,
            boardIdToAdd: null
          })
          this.props.addEditBoardHeading(postData, ()=>{
            this.setState({
              selectedBoardId: bId
            })
          });  
        } else { // adding or editing list heading
          let postData = {
            bId,
            lId,
            data: this.state.cardValue,
          }
          if(edit) {
            postData.edit = true;  
          } 
          this.setState({
            editListHeading: null,
            ListIdToAdd: null,
            cardValue: ''
          })
          this.props.addEditListHeading(postData);
        }
      } else { // adding or editing card
        let postData = {
          bId,
          lId,
          cId,
          data: this.state.cardValue,
          edit: false
        }
        this.setState({
          cardValue: '',
          ListIdToAdd: null,
        })
        if(edit) {
          postData.edit = true;
          this.setState({
            cardValue: '',
            editCard: null,
          })
        }
        //added card to list and then scroll the list to show the added card.
        this.props.addCardToList(postData, ()=>{
          this.setState({
            scrollToThis: cId
          })
        });
      }
      this.clearTextareaAdjustment();
    }
  }
  //scroll the added card elm to view port if its behind add new card elm (when the list is bigger than view port height).
  scrollNewCardToView = (cardElm) => {
    let elmTogetInView = `#${cardElm}`;
    this.getElementIntoView(elmTogetInView);
    this.setState({
      scrollToThis: null
    })
  }
  //setting the textarea field height to auto.
  clearTextareaAdjustment = () => {
    let text = document.querySelector(`.textCardArea`);
    if(text && text.style) {
      setTimeout(()=>{
        text.style.height = 'auto';
      }, 0);
    }
  }
  handleAddNewBoard = () => {
    this.setState({
      boardIdToAdd: '_' + Math.random().toString(36).substr(2, 9),
      showAddNewCard: null,
      editBoardHeading: null,
      editCard: null,
      editListHeading: null,
      cardValue: '',
      showAddNewBoard: true
    })
  }
  handleEditListHeading = (heading, lId) => {
    if(!lId) {
      this.setState({
        ListIdToAdd: '_' + Math.random().toString(36).substr(2, 9),
      }, ()=>{
        this.setState({
          showAddNewCard: null,
          editBoardHeading: null,
          editCard: null,
          editListHeading: this.state.ListIdToAdd,
          cardValue: heading,
          showAddNewBoard: null,
          boardIdToAdd: null
        })
      })
    } else {
      this.setState({
        showAddNewCard: null,
        editCard: null,
        editListHeading: lId,
        cardValue: heading,
        ListIdToAdd: null,
        editBoardHeading: null,
        showAddNewBoard: null,
        boardIdToAdd: null
      })
    }
  }
  closeEditListHeadingInput = (e) => {
    let listHeadInputBox = document.getElementById(`listHead_${this.state.editListHeading}`);
    if (listHeadInputBox && listHeadInputBox.contains(e.target)){
    } else{
      // Clicked outside the box
      this.setState({
        editListHeading: null,
        ListIdToAdd: null
      })
    }
  }
  handleRemoveList = (e, bId, lId) => {
    e.stopPropagation();
    let postData = {
      bId,
      lId
    }
    this.props.removeList(postData);
  }
  handleEditBoardHeading = (val, bId) => {
    this.setState({
      cardValue: val,
      editBoardHeading: bId,
      showAddNewCard: null,
      editCard: null,
      editListHeading: null,
      ListIdToAdd: null
    })
  }

  moveToOtherList = (sourceIdParentEl, targetEl, sourceIdEl) => {
    let {bId, cId, lId} = this.getSourceDataIds(sourceIdEl.getAttribute('data-tomove'));
    let data = sourceIdEl.getAttribute('data-carddata');
    let postDataToRemoveFromCurrentList = {
      bId,
      cId,
      lId
    }
    let lIdToAdd = targetEl.getAttribute('data-listid')
    if(lId !== lIdToAdd) {
      
      //removing from source list and then adding to target list.
      this.props.removeCard(postDataToRemoveFromCurrentList, ()=>{
        let postDataToAddInOtherList = {
          bId,
          cId,
          lId: lIdToAdd,
          edit: false,
          data
        }
        this.props.addCardToList(postDataToAddInOtherList);
      })
    }
  }
  handleSelectBoard = (bId) => {
    this.props.setSelectedBoard(bId);
  }

  getElementIntoView = (elmTogetInView) =>{
    let cardAddedEdited = document.querySelector(elmTogetInView);
    if (cardAddedEdited) {
      cardAddedEdited.parentNode.scrollTop = cardAddedEdited.offsetTop;
    }
  }
  renderHeadingField = (parentClassname, boardId, listId, cardId, id, classNames, edit, placeholder ) => {
    const {
      cardValue
    } = this.state;
    let headingFieldProps = {
      inputBox: true,
      parentClassname,
      placeholder: placeholder || 'Enter Board Title',
      boardId,
      listId,
      cardId,
      id,
      cardValue,
      classNames,
      handleCardDataChange: this.handleCardDataChange,
      edit,
      handleEnteronCardInput: this.handleEnteronCardInput
    }
    return (
      <HeadingField {...headingFieldProps} />   
    )
  }

  render () {
    const {
      boards,
      allBoardIds,
      selectedBoardId
    } = this.props;
    const {
      showAddNewCard,
      cardValue,
      editCard,
      editListHeading,
      ListIdToAdd,
      editBoardHeading,
      showAddNewBoard,
      boardIdToAdd,
    } = this.state;
    let board = boards[selectedBoardId];
    return (
      <div>
        {!!board && (
          <div className="board">
            <BoardsList
              allBoardIds={allBoardIds}
              boards={boards}
              selectedBoardId={selectedBoardId}
              handleSelectBoard={this.handleSelectBoard} />
            {(!editBoardHeading || (editBoardHeading && editBoardHeading !==selectedBoardId)) && (
              <div className="layout pernia-white-color cursor-pointer align-center">
                <div 
                  onClick={()=>this.handleEditBoardHeading(board.heading, selectedBoardId)} 
                  className="h2 boardHead pernia-white-color cursor-pointer m-r-10 m-l-10">
                  {board.heading}
                </div>
                {!showAddNewBoard && <div onClick={()=>this.handleAddNewBoard()} className="boardHead h4 addNewBoard">Add New Board ...</div>}
                {!!showAddNewBoard && (
                  this.renderHeadingField('newListHeadInputWrapper2', boardIdToAdd, null, null, `boardHead_${boardIdToAdd}`, 'listHeadInput2', false)
                )}
              </div>
            )}
            {!!editBoardHeading && editBoardHeading ===selectedBoardId && (
              this.renderHeadingField('newBoardHeadInputWrapper', selectedBoardId, null, null, `boardHead_${selectedBoardId}`, 'boardHeadInput', true)
            )}
            <div className="lists ">
              <div className="listsInner layout justify-start">
                {board.allListIds && !!board.allListIds.length && board.allListIds.map((listId, listIndex)=>{
                  let list = board.listsById[listId];
                  let cardIdToAdd = '_' + Math.random().toString(36).substr(2, 9);
                  return (
                    <List 
                      key={listId}
                      listId={listId}
                      onDragOver={this.onDragOver}
                      onDrop={this.onDrop}
                      editListHeading={editListHeading}
                      handleEditListHeading={this.handleEditListHeading}
                      list={list}
                      handleRemoveList={this.handleRemoveList}
                      selectedBoardId={selectedBoardId}
                      cardValue={cardValue}
                      handleCardDataChange={this.handleCardDataChange}
                      handleEnteronCardInput={this.handleEnteronCardInput}
                      listIndex={listIndex}
                      onDragStart={this.onDragStart}
                      handleEditCard={this.handleEditCard}
                      removeCard={this.removeCard}
                      editCard={editCard}
                      handleTextAreaHeight={this.handleTextAreaHeight}
                      handleAddCard={this.handleAddCard}
                      handleCloseBtn={this.handleCloseBtn}
                      showAddNewCard={showAddNewCard}
                      handleAddNewCard={this.handleAddNewCard}
                      cardIdToAdd={cardIdToAdd}  />
                  )
                })}
                {!ListIdToAdd && <div onClick={()=>this.handleEditListHeading('')} className="AddNewListBox prel layout align-center">Add New List</div>}
                {!!ListIdToAdd && (
                  this.renderHeadingField('newListHeadInputWrapper2', selectedBoardId, ListIdToAdd, null, `listHead_${ListIdToAdd}`, 'listHeadInput2', false, 'Enter list title')
                )}
              </div>
            </div>
          </div>)}
        {!board && (
          <div className="posAbsForSpaceOccupy layout align-center justify-center" >Loading...</div>
        )}
      </div>
    )
  }
}
const mapStateToProps = state => {
  const { boards } = state;
  return ({
    boards: boards && boards.boards || {},
    allBoardIds: boards && boards.allBoardIds || [],
    selectedBoardId: boards && boards.selectedBoardId || ''
  });
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      setBoardsData,
      addCardToList,
      removeCard,
      addEditListHeading,
      removeList,
      addEditBoardHeading,
      dumpBoardsDataOnStore,
      setSelectedBoard
    }
  )
)(Home);