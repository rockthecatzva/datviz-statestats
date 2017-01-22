import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class RadioButtons extends Component {

  render() {
    const { renderData, uxCallback } = this.props

    var onStateClick = function(tag, dat){
      console.log("CLICKKKKK", tag, dat);
      uxCallback(tag, dat)
    }

    return (
      <ul className={"col-sm-12 simple-list"}>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }

      {(renderData) &&
        renderData.map((v,i)=>{
          return(<li onClick={()=>{return onStateClick(this.props.uxTag, v["apiObj"])}} >{v["label"]}</li>)
          })
        }

        </ul>
      )
    }
  }

  RadioButtons.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired,
    uxTag: PropTypes.string.isRequired
  }
