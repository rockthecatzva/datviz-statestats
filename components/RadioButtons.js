import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class RadioButtons extends Component {

  render() {
    const { renderData, uxCallback } = this.props

    var onStateClick = function(tag, dat){
      console.log("CLICKKKKK");
      uxCallback(tag, dat)
    }

    return (
      <div className={"simple-list"}>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }

      {(renderData) &&
        renderData.map((v,i)=>{
          return(<div onClick={()=>{return onStateClick(this.props.uxTag, v["apiObj"])}} >{v["label"]}</div>)
          })
        }

        </div>
      )
    }
  }

  RadioButtons.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired,
    uxTag: PropTypes.string.isRequired
  }
