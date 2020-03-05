import React, { Component } from 'react';
import ModalComponent from '../container/Home/ModalComponent';
import './compareStyles.scss';
class CompareAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      searchedOptions: [],
      selectedOptions: [],
      selectAll: false
    }
    this.inputRef = React.createRef();
  }
  handleSearchChange = ({target: {value}}) => {
    this.setState({
      searchInput: value
    });
    if (value) {
      const options = [...this.props.options];
      const searchedOptions =  options.filter(option => {
        const optionLowerCase = option.toLowerCase();
        return optionLowerCase.includes(value.toLowerCase());
      });
      this.setState({
        searchedOptions: searchedOptions
      })
    } else {
      this.setState({
        searchedOptions: [],
      });
    }
  }
  componentDidMount() {
    const { selectedOptions } = this.props;
    selectedOptions && !!selectedOptions.length && selectedOptions.map(opt=>{
      let optCheckbox = document.getElementById(`checkbox_${opt}`);
      setTimeout(() => {
        if(optCheckbox) {
          optCheckbox.click();
        }
        return opt;
      }, 10);
    })
  }
  
  handleChange= (e, option) => {
    let checkboxelm = document.getElementById(`checkbox_${option}`);
    if(checkboxelm) {
      if(checkboxelm.classList.contains('showSelectedCheckbox')) {
        checkboxelm.classList.remove('showSelectedCheckbox');
        this.setState({
          selectedOptions: [...this.state.selectedOptions.filter(opt=>opt !== option)]
        })
      } else {
        checkboxelm.classList.add('showSelectedCheckbox');
        this.setState({
          selectedOptions: [...this.state.selectedOptions, option]
        })
      }
    }
  }
  selectDeslectAllAttr = () => {
    const { options } = this.props;
    const { selectAll, selectedOptions } = this.state;
    let selectAllCheckboxElm = document.getElementById('selectAllcheckbox');
    if(selectAllCheckboxElm.classList.contains('showSelectedCheckbox')) {
      selectAllCheckboxElm.classList.remove('showSelectedCheckbox');
    } else {
      selectAllCheckboxElm.classList.add('showSelectedCheckbox');
    }
    options && !!options.length && options.map(opt=>{
      let optCheckbox = document.getElementById(`checkbox_${opt}`);
      if(optCheckbox) {
        if(selectAll) {
          if(!optCheckbox.classList.contains('showSelectedCheckbox')) {
            optCheckbox.classList.add('showSelectedCheckbox');
          }
        } else {
          if(optCheckbox.classList.contains('showSelectedCheckbox')) {
            optCheckbox.classList.remove('showSelectedCheckbox');
          }
        }
      }
      return opt;
    })
    this.setState({
      selectedOptions: selectAll ? options: []
    })
  }
  handleSelectAll = (e) => {
    const { selectAll } = this.state;
    this.setState({
      selectAll: !selectAll
    }, this.selectDeslectAllAttr)
    
  }
  handleApply = () => {
    let sureApply = true;
    if(this.state.searchInput) {
      sureApply = window.confirm('Selected Attributes', this.state.selectedOptions);
    }
    sureApply && this.props.handleAttrOptions(this.state.selectedOptions);
    sureApply && this.props.handleModal();
  }
  handleCancel = () => {
    this.props.handleModal();
  }
  getCheckbox = (option, index) => {
    return (
      <div className="m-b-10 PslCheckbox"  onClick={(e)=>this.handleChange(e, option)}>
        <label>
          <span id={'checkbox_'+option} className="PslCheckboxCheckmark" />
          <span className="cursor-pointer PslCheckboxText m-l-5 ellipsis">{option}</span>
        </label>
      </div>
    )
  }
  render() {
    const { handleModal, options } = this.props;
    const { searchInput, searchedOptions, selectedOptions } = this.state;
    const showAllOptions = !searchInput && !searchedOptions.length;
    const renderOptionsData = showAllOptions ? options : searchedOptions;
    const isOptionsArray = Array.isArray(renderOptionsData) && !!renderOptionsData.length
    console.log('selected options', selectedOptions, searchedOptions)
    return (
      <ModalComponent handleModal={handleModal} >
        <div className="AttributeModalContainer">
          <div className="attributeHeading m-b-10 h5 bold">Add/Remove Attributes</div>
          <div className="m-b-10 CheckboxListSearch">
            <input type="text" value={searchInput} onChange={this.handleSearchChange} placeholder="Search Attributes">
            </input>
          </div>
          {!searchInput && (
            <div className="m-b-10 layout PslCheckbox selectAllBox" onClick={(e)=>this.handleSelectAll(e)}>
              <label>
                <span id={'selectAllcheckbox'} className="PslCheckboxCheckmark" />
                <span className="cursor-pointer PslCheckboxText m-l-5 ellipsis">{'Select All'}</span>
              </label>
            </div>
          )}
          <div className="CheckboxListOptions layout row align-start wrap">
            {
              isOptionsArray && renderOptionsData.map((option, index) => {
                return (
                  <div key={option} className="flex xs12 PslCheckbox">
                    {this.getCheckbox(option, index)}
                  </div>
                )
              })
            }
          </div>
          <div className="layout justify-end">
            <div onClick={this.handleCancel} className="cancelBtn layout align-center justify-center m-r-15">Cancel</div>
            <div onClick={this.handleApply} className="applyBtn layout align-center justify-center">Apply</div>
          </div>
        </div>
      </ModalComponent>
    )
  }
}

export default CompareAttributes;