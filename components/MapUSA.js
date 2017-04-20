import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')
var topojson = require('topojson')

export default class MapUSA extends Component {
  constructor(props){
    super(props)
    this.updateData = this.updateData.bind(this)
  }

  updateData(data, highlightrange) {
    const {uxCallback} = this.props

    let el = ReactDOM.findDOMNode(this),
        containerW = parseInt($(el).css("width").replace("px", "")),
        containerH = parseInt($(el).css("height").replace("px", "")),
        projection = d3.geoAlbersUsa().scale(containerW+100).translate([containerW / 2, containerH / 2]),
        path = d3.geoPath().projection(projection);

    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
        .attr("width", containerW)
        .attr("height", containerH);

    d3.json("us.json", function(json) {
      var d = topojson.feature(json, json.objects.states)
      var t= d.features.map(function(val,i){
        //should this be in the App.js - the component needs to be dumber???
        for (var i = 0; i < data.length; i++) {
          if (data[i].id==val.id){
            return Object.assign({}, val, {"value": data[i].value, "name": data[i].state})
          }
        }
      return val
      })

      d.features = t

      let max_val = d3.max(d.features, (d)=>{return d['value']})
      let min_val = d3.min(d.features, (d)=>{return d['value']})
      let median_val = d3.median(d.features, (d)=>{return d['value']});
      var color_scale = d3.scaleLinear().domain([min_val, median_val, max_val]).range(['blue', 'white', 'red']);

      var callUx = function(tag, data){
          uxCallback(tag, data)
        }

      svg.selectAll("path").remove()
      var s = svg.selectAll("path")
        .data(t)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "mapstates")
        .style('fill', function(d) {
          if(highlightrange){
            console.log("should highlight? ", d.name, d.value, highlightrange[0], highlightrange[1]);
            if(((d.value)>=(highlightrange[0]))&&((d.value)<highlightrange[1])){
              console.log("YEP HIGHLIGHTING");
              return "#FF0"
            }
            else{
              return "#b2b4b7"
            }
          }
          return color_scale(d['value']);
        })
        .on("click", (e)=>{
          callUx("map-click", {"name": e.name, "id": e.id, "value": e.value})
        });
    });
  }

  componentWillReceiveProps(nextprop) {
      if(nextprop.renderData){
        console.log("sending this to the render func ",  nextprop.highLightRange);
        this.updateData(nextprop.renderData, nextprop.highLightRange)
      }
    }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this)
    var svg = d3.select(el).append("svg")//add an empty svg

    if(this.props.renderData){
        this.updateData(this.props.renderData, this.props.highLightRange)
      }
  }


  render() {
    const {renderData} = this.props

    console.log(renderData);

    return (
      <div className="fullw fullh">
      {(1) &&
        <div className="loading">Loading&#8230;</div>
      }
      </div>
    )
  }
}

MapUSA.propTypes = {
  renderData: PropTypes.array.isRequired,
  uxCallback: PropTypes.func.isRequired,
  highLightRange: PropTypes.array.isRequired
}
