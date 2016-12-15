import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class RadioButtons extends Component {

  render() {
    const { renderData, uxCallback } = this.props

    var onStateClick = function(e, dat){
      uxCallback(tag, dat)
    }

    return (
      <div className={"simple-list"}>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }

      {(renderData) &&
        renderData.map((v,i)=>{
          return(<div onClick={()=>{return onStateClick(this, v[1])}} >{v[0]}</div>)
          })
        }

        </div>
      )
    }
  }

  RadioButtons.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired
  }
