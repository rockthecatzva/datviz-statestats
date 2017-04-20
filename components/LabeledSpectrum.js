import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')

export default class LabeledSpectrum extends Component {
  constructor(props){
    super(props)
    this.updateData = this.updateData.bind(this)
  }

  updateData(data, highlight) {
    const {uxCallback} = this.props

    let el = ReactDOM.findDOMNode(this),
        containerW = parseInt($(el).css("width").replace("px", "")),
        containerH = parseInt($(el).css("height").replace("px", ""));

    var svg = d3.select(el).select("svg")
      .attr("width", containerW)
      .attr("height", containerH);

    let margin = {top: 20, right: 30, bottom: 40, left: 0};

    var formatCount = d3.format(",.0f");

    var x = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([10, (containerW-margin.left-margin.right)])
      .interpolate(d3.interpolateRound);

    var callUx = function(tag, data){
          uxCallback(tag, data);
        }

    }

    componentWillReceiveProps(nextprop) {
    if((nextprop.renderData)||(nextprop.highLightValue)){
      this.updateData(nextprop.renderData, nextprop.highLightValue)
    }
  }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    var formatDate = d3.timeFormat("%d-%b-%y");
    var svg = d3.select(el).append("svg");

    if(this.props.renderData){
      this.updateData(this.props.renderData)
    }
  }


  render() {
    const {renderData} = this.props

    return (
      <div className="fullw fullh">
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }
      </div>
    )
  }
}

LabeledSpectrum.propTypes = {
  renderData: PropTypes.array.isRequired,
  highLightValue: PropTypes.number.isRequired,
  uxCallback: PropTypes.func.isRequired
}
