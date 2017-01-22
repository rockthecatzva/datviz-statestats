import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')
var topojson = require('topojson')

export default class MapUSA extends Component {

  updateData(data) {
    console.log("UpdateData");
    var projection = d3.geoAlbersUsa().scale(700).translate([this.props.width / 2, this.props.height / 2]);;
    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
        .attr("width", this.props.width)
        .attr("height", this.props.height);

    d3.json("us.json", function(json) {
      var d = topojson.feature(json, json.objects.states)
      var t= d.features.map(function(val,i){

        //should this be in the App.js - the component needs to be dumber???
        for (var i = 0; i < data.length; i++) {
          //console.log(data[i].id, val.id);
          if (data[i].id==val.id){
            //console.log("FOUND", data[i].id, val.id);
            return Object.assign({}, val, {"value": data[i].value, "name": data[i].state})
          }
        }
      return val
      })

      d.features = t


      let max_val = d3.max(d.features, (d)=>{return d['value']})
      let min_val = d3.min(d.features, (d)=>{return d['value']})
      var color_scale = d3.scaleLinear().domain([min_val, max_val]).range(['white', 'red']);

      console.log("this is max    ", max_val);

      var s = svg.selectAll("path")
        .data(t)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", (d,i)=>{return "states"})
        .style('fill', function(d) {
          return color_scale(d['value']);
        })
        .on("click", (e)=>{console.log(e);});
    });
  }

  componentWillReceiveProps(nextprop) {
      console.log("GETTING PROPS YO", nextprop)
      if(nextprop.renderData){
        this.updateData(nextprop.renderData)
      }
    }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this)
    var svg = d3.select(el).append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)

    if(this.props.renderData){
        this.updateData(this.props.renderData)
      }
  }


  render() {
    const {renderData, title} = this.props

    console.log("rendering ", this.props.renderData);

    return (
      <div className="col-sm-6">
      <h2>{title}</h2>
      {(!this.props.renderData) &&
        <div className="loading">Loading&#8230;</div>
      }
      </div>
    )
  }
}

MapUSA.propTypes = {
  renderData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  //title: PropTypes.string.isRequired
}
