import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class Dropdown extends Component {

  componentDidMount(){
    console.log("Buttons mounted!!", this.props.uxTag, this.props.renderData[0]);
    this.props.uxCallback(this.props.uxTag, this.props.renderData[0])
  }


  render() {
    const { renderData, uxCallback } = this.props

    let f = (v)=>{
      console.log("it worked!!!", v);
      //uxCallback(this.props.uxTag, e.target.options[e.target.selectedIndex].val);
    }

    let par = this;

    return (
      <div>
        <h5>select a demographic variable</h5>
        <select onChange={()=>f(par.selectedIndex)} >
          {renderData.map((v,i)=>{
            return(<option>{v["label"]}</option>)
            })}
        </select>


        </div>
      )
    }
  }

  Dropdown.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired,
    uxTag: PropTypes.string.isRequired
  }
