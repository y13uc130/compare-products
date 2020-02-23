import React, { Component } from 'react';
import HeadingField from './HeadingField';

class List extends Component {
  render() {
    const {
      listId,
      onDragOver,
      onDrop,
      editListHeading,
      handleEditListHeading,
      list,
      handleRemoveList,
      selectedBoardId,
      cardValue,
      handleCardDataChange,
      handleEnteronCardInput,
      listIndex,
      onDragStart,
      handleEditCard,
      removeCard,
      editCard,
      handleTextAreaHeight,
      handleAddCard,
      handleCloseBtn,
      showAddNewCard,
      handleAddNewCard,
      cardIdToAdd
    } = this.props;
    return (
      <div className="listInner">
      <div
        id={listId}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="list prel">
          {(!editListHeading || (editListHeading && editListHeading!==listId))  && (
            <div
              onClick={()=>this.props.handleEditListHeading(list.heading, listId)}
              className="listHead h4 prel">
              {list.heading}
              <div className="posAbsForSpaceOccupy"></div>
              <div onClick={(e)=>this.props.handleRemoveList(e, selectedBoardId, listId)} className="removeListBtn">Remove</div>
            </div>
          )}
          {!!editListHeading && editListHeading===listId && (
            <HeadingField 
              inputBox={true}
              parentClassname ={'newListHeadInputWrapper'}
              cardValue={cardValue}
              placeholder = {"Enter list title"}
              boardId={selectedBoardId}
              listId={listId}
              cardId={null}
              id={`listHead_${listId}`}
              classNames={'listHeadInput'}
              handleCardDataChange={handleCardDataChange}
              edit={true}
              handleEnteronCardInput={handleEnteronCardInput} />
          )}
          <div id={`list_${listIndex}`} data-listid={listId} className="cardsWrapper">
            {list.allCardIds && !!list.allCardIds.length && list.allCardIds.map((cardId, index)=>{
              let card = list.cardsById[cardId];
              return (
                <div
                  key={cardId}
                  id={cardId}
                  draggable="true"
                  onDragStart={onDragStart}
                  data-tomove={`${selectedBoardId}-${listId}-${cardId}`}
                  data-carddata={card.text}
                  className="card prel">
                  <div className="editBtn cursor-pointer" onClick={()=>this.props.handleEditCard(cardId, card.text)} >Edit</div>
                  <div className="removeBtn cursor-pointer" onClick={()=>this.props.removeCard(selectedBoardId, listId, cardId)} >Remove</div>
                  {(!editCard || (editCard && editCard !==cardId)) && <div className="cardText" >{card.text}</div>}
                  {!!editCard && editCard===cardId && (
                    <React.Fragment>
                      <HeadingField 
                        inputBox={false}
                        cardValue={cardValue}
                        placeholder = {"Enter what to-do"}
                        boardId={selectedBoardId}
                        listId={listId}
                        cardId={cardId}
                        classNames={'listCardInput textCardArea'}
                        handleCardDataChange={handleCardDataChange}
                        edit={true}
                        handleEnteronCardInput={handleEnteronCardInput}
                        handleTextAreaHeight = {handleTextAreaHeight}  />
                      <div className="layout cursor-pointer">
                        <div className="addCardBtn" onClick={()=>this.props.handleAddCard(selectedBoardId, listId, cardId, true)} >Edit Card</div>
                        <img src="https://img.perniaspopupshop.com/ppus-assets/icons/cross-black.svg" alt="x" onClick={()=>this.props.handleCloseBtn(true)} />
                      </div>      
                    </React.Fragment>
                  )}
                </div>
            )})}
          </div>
          {(!showAddNewCard || (showAddNewCard && showAddNewCard!==listId)) && <div onClick={()=>this.props.handleAddNewCard(listId)} className="addNewCard">Add Another Card...</div>}
          {!!showAddNewCard && showAddNewCard===listId && (
            <React.Fragment>
              <HeadingField 
                inputBox={false}
                cardValue={cardValue}
                placeholder = {"Enter what to-do"}
                boardId={selectedBoardId}
                listId={listId}
                cardId={cardIdToAdd}
                classNames={'listCardInput textCardArea'}
                handleCardDataChange={handleCardDataChange}
                edit={false}
                handleEnteronCardInput={handleEnteronCardInput}
                handleTextAreaHeight = {handleTextAreaHeight}  />
              <div className="layout cursor-pointer">
                <div className="addCardBtn" onClick={()=>this.props.handleAddCard(selectedBoardId, listId, cardIdToAdd)} >Add Card</div>
                <img src="https://img.perniaspopupshop.com/ppus-assets/icons/cross-black.svg" alt="x" onClick={()=>this.props.handleCloseBtn()} />
              </div>      
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}
export default List;