import React, { Component } from 'react';
import classnames from 'classnames';

class BoardsList extends Component {
  render() {
    const {
      allBoardIds,
      boards,
      selectedBoardId,
      handleSelectBoard
    } = this.props;
    return (
      <div className="posAbsForSpaceOccupy boardsList pernia-white-color">
        <div className="layout align-center">
          {!!allBoardIds && allBoardIds.map((bid, i)=>{
            let boardData = boards[bid];
            return (
              <div key={`${i}_boardNo`} onClick={()=>this.props.handleSelectBoard(bid)} className={classnames("h4 text-capitalize", bid===selectedBoardId && 'activeBoard')}>{boardData.heading}</div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default BoardsList;