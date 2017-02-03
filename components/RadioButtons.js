import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class RadioButtons extends Component {

  componentDidMount(){
    console.log("Buttons mounted!!", this.props.uxTag, this.props.renderData[0]);
    this.props.uxCallback(this.props.uxTag, this.props.renderData[0])
  }


  render() {
    const { renderData, uxCallback } = this.props

    return (
      <ul className={"col-sm-12 simple-list"}>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }

      {(renderData) &&
        renderData.map((v,i)=>{
          return(<li onClick={()=>{return uxCallback(this.props.uxTag, v)}} >{v["label"]}</li>)
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
