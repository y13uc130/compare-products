import React, { Component } from 'react';
import './Modalstyles.scss';

class ModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: true
    }
    this.modalRef = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('click', this.checkClickForClose)
  }
  checkClickForClose = (e) => {
    if(e.srcElement === this.modalRef) {
      this.setState({
        openModal: false
      })
      this.props.handleModal();
    }
  }


  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {this.state.openModal && <div ref={(e)=>this.modalRef =e} className="modalContainer" >
          <div className="modalWrapper" >
            {children}
          </div>
        </div>}
      </React.Fragment>
    )
  }
}


export default (ModalComponent);