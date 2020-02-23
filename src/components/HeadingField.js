import React, { Component } from 'react';
import '../container/Home/styles.scss';
import classnames from 'classnames';

class HeadingField extends Component {
  render() {
    const {
      classNames,
      cardValue,
      id,
      handleCardDataChange,
      listId,
      boardId,
      edit,
      placeholder,
      cardId,
      inputBox,
      handleTextAreaHeight,
      parentClassname
    } = this.props;
    let commonProps = {
      type : "text",
      autoFocus : true,
      className : classNames,
      placeholder,
      value : cardValue,
      onChange : handleCardDataChange,
      onKeyPress : (e)=>this.props.handleEnteronCardInput(e, boardId, listId, cardId, edit),
    }
    let inputProps = {...commonProps, id};
    let textareaProps = { 
      ...commonProps, 
      onKeyUp: handleTextAreaHeight, 
      onPaste: handleTextAreaHeight,
    }
    return (
      <div className={classnames(parentClassname ? parentClassname : inputBox ? "newListHeadInputWrapper2": 'newCardInputWrapper')}>
        {
          inputBox ? (
            <input {...inputProps} />
          ): (
            <textarea {...textareaProps} />
          )
        }
      </div>
    )
  }
}
export default HeadingField;