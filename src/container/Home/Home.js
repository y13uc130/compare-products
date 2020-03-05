import React, { Component } from 'react';
import './styles.scss';
import DefaultDataJs from './defaultData';
import classnames from 'classnames';
import CompareAttributes from '../../components/CompareAttributes';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareProducts: [],
      selectedAttributes: ['price', 'colors', 'condition'],
      openAttributePopup: false
    };
    this.allAttributes = ['price', 'colors', 'vendors', 'description', 'condition'];
  }
  handleCompareClick = (item) => {
    let itemElm = document.getElementById(item.id);
    itemElm.setAttribute('data-isclicked', 'true');
    let bgColorChangeElm = document.getElementById(`forColorChange_${item.id}`);
    bgColorChangeElm && bgColorChangeElm.classList.add('fixBG');
    this.setState({
      compareProducts: [...this.state.compareProducts, item]
    })
  }
  handleRemoveClick = (item) => {
    let itemElm = document.getElementById(item.id);
    itemElm.setAttribute('data-isclicked', 'false');
    let bgColorChangeElm = document.getElementById(`forColorChange_${item.id}`);
    bgColorChangeElm && bgColorChangeElm.classList.remove('fixBG');
    this.setState({
      compareProducts: [...this.state.compareProducts.filter(product=>product.id!==item.id)]
    })
  }
  checkIfClicked = (item) => {
    let itemElm = document.getElementById(item.id);
    if(itemElm && itemElm.getAttribute('data-isclicked') ==='true') {
      return true;
    } 
    return false;
  }
  handleCompareOrRemoveClick = (item) => {
    let isClicked = this.checkIfClicked(item);
    if(isClicked) {
      this.handleRemoveClick(item);
    } else {
      this.handleCompareClick(item);
    }
  }
  changeHexColor = (color) => {
    switch(color) {
      case 'red':
        return '#EF6E59';
      case 'green':
        return '#5CD0AD';
      case 'blue': 
        return '#3198F6';
      default:
        break;
    }
  }
  renderConditionDiv = (cond) => {
    return (
      <div className={classnames("itemBox layout align-center justify-center", cond==='Fresh' && 'greenClr', cond==='Frozen' && 'redClr')}>{cond}</div>
    ) 
  }
  renderVendorsDiv = (vendors) => {
    return (
      <div className="itemBox layout justify-center align-center column">
      {
        vendors.map(vendor=>{
          return (
            <div className="m-b-5">{vendor}</div>
          )
        })
      }
      </div>
    )
  }
  renderColorsDiv = (colors) => {
    return (
      <div className="itemBox layout align-center justify-center">
        {colors.map((color)=>{
          let finalColor = this.changeHexColor(color);
          return (
            <div className='colorBall' style={{backgroundColor: finalColor !== '#ffffff' && finalColor, borderColor: finalColor !== '#ffffff' && finalColor }}></div>
          )
        })}
      </div>
    )
  }
  handleSelectAttributesClick = () => {
    this.setState({
      openAttributePopup: !this.state.openAttributePopup
    })
  }
  handleAttrOptions = (selectedAttributes) => {
    this.setState({
      selectedAttributes
    })
  }

  render () {
    const { compareProducts, selectedAttributes, openAttributePopup } = this.state;
    return (
      <div className="compareProductsWrapper" >
        <div className="layout column justify-center align-center" >
          <div className="m-b-15 m-t-15 layout justify-space-between align-center cp-header">
            <h2 className="">Compare Products</h2>
            <div onClick={this.handleSelectAttributesClick} className="h5 cursor-pointer">Add/Remove Attributes</div>
          </div>
          <div className="ProductsWrapper layout">
            {DefaultDataJs.map((product, index)=>{
                return (
                  <div key={index} className="eachProductWrap" >
                    <div className="prel">
                      <div id={'forColorChange_'+product.id} className="posAbsForSpaceOccupy ForGreenBG layout justify-center align-center">
                        <div>
                          <div className="compareBtnDisplay">
                            <div id={product.id} data-isclicked="false" onClick={()=>this.handleCompareOrRemoveClick(product)} className="compareBtn layout justify-center align-center bold" >
                              {!this.checkIfClicked(product)? 'COMPARE' : 'REMOVE'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <img className="productImg" src ={product.image}  alt="x" />
                    </div>
                    <div className="productDetail layout justify-space-between">
                      <div>
                        <h3 className="name p-b-5">{product.name}</h3>
                        <div className="desc">{product.description}</div>
                      </div>
                      <div className="price bold">
                        {product.price}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          {compareProducts && !!compareProducts.length && (
            <div className="comparisonWrapper layout justify-space-between">
              <div className="compareList prel">
                <div className="compareOptBox empty"></div>
                {selectedAttributes.map((attr, index)=>{
                  return (
                    <div key={'compareoptBox_'+index} className="compareOptBox layout align-center" >
                      {attr}
                    </div>
                  )
                })}
              </div>
              <div className="layout SelectedProducts">
                {compareProducts && !!compareProducts.length && compareProducts.map((item,i)=>{
                  return(
                    <div key={'item_'+i} className="SelectedProductDetails" >
                      <div className="itemBox itemName layout align-center justify-center ">{item.name}</div>
                      {selectedAttributes.map((attr, j)=>{
                        return (
                          <div className="selectedProductAttrDetails" >
                            {attr!=='colors' && attr !=='condition' && attr !=='vendors' && <div key={'attr_'+j} className={classnames("itemBox layout align-center justify-center")}>{item[attr]}</div>}
                            {attr==='colors' && 
                              this.renderColorsDiv(item[attr])
                            }
                            {attr==='condition' && (
                              this.renderConditionDiv(item[attr])
                            )}
                            {attr==='vendors' && (
                              this.renderVendorsDiv(item[attr])
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
            )}
        </div>
        {openAttributePopup && (
          <CompareAttributes  options={this.allAttributes} selectedOptions={selectedAttributes} handleAttrOptions={this.handleAttrOptions} handleModal={this.handleSelectAttributesClick} />
        )}
      </div>
    )
  }
}

export default Home;