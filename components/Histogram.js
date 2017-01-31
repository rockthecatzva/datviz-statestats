import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')

export default class Histogram extends Component {
  constructor(props){
    super(props)
    this.updateData = this.updateData.bind(this)
  }

  updateData(data, highlight) {
    const {uxCallback} = this.props

    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg"),
    margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom

    var formatCount = d3.format(",.0f");

    var x = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([10, width])
      .interpolate(d3.interpolateRound)

    var bins = d3.histogram()
      .domain([x.domain()[0], x.domain()[1]])
      .thresholds(x.ticks(8))
      (data)

    var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 15]);

    svg.selectAll(".bar").remove()
    var bar = svg.selectAll(".bar")
      .data(bins)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })

    var callUx = function(tag, data){
          uxCallback(tag, data)
        }

    console.log("BUILDING RECT", highlight);
    bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); })
      .attr("class", (d)=>{
        if(highlight){
          if((highlight>=d.x0)&&(highlight<=d.x1)){
            return "highlight"
          }
        }
        return "normal";
        })
      .on("click", (e)=>{callUx("histogram-click", {"range": [e.x0, e.x1]})});

    bar.append("text")
      .attr("y", "-0.25em")
      .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text(function(d) { if(d.length) {return formatCount(d.length)}; });

      svg.selectAll(".axis").remove()
      svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    }

    componentWillReceiveProps(nextprop) {
    //console.log("GETTING PROPS YO", nextprop)
    if((nextprop.renderData)||(nextprop.highLightValue)){
      console.log("inside yo!!!!!", nextprop)
      this.updateData(nextprop.renderData, nextprop.highLightValue)
    }
  }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this)
    var formatDate = d3.timeFormat("%d-%b-%y")
    var svg = d3.select(el).append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)

      if(this.props.renderData){
        this.updateData(this.props.renderData)
      }
  }


  render() {
    const {renderData, title} = this.props


    return (
      <div className="col-sm-4">
      <h2>{title}</h2>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }
      </div>
    )
  }
}

Histogram.propTypes = {
  renderData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  highLightValue: PropTypes.number.isRequired,
  uxCallback: PropTypes.func.isRequired
}
