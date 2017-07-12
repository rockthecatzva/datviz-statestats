import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')
var topojson = require('topojson')

export default class MapUSA extends Component {
  constructor(props){
    super(props)
    this.updateData = this.updateData.bind(this)
  }

  updateData(data, highlight) {
    const {uxCallback} = this.props

    let el = ReactDOM.findDOMNode(this),
        containerW = parseInt((window.getComputedStyle(el).width).replace("px", "")),
        containerH = parseInt((window.getComputedStyle(el).height).replace("px", "")),
        projection = d3.geoAlbersUsa().scale(containerW+100).translate([containerW / 2, containerH / 2]),
        path = d3.geoPath().projection(projection);

    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
        .attr("width", containerW)
        .attr("height", containerH);

    d3.json("us.json", function(json) {
      var d = topojson.feature(json, json.objects.states)
      var t= d.features.map(function(val,i){
        
        for (var i = 0; i < data.length; i++) {
          if (data[i].id==val.id){
            return Object.assign({}, val, {"name": data[i].state}, data[i])
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
        console.log(data);
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
          if(highlight.length){
            if(highlight.filter(r=>{if(r==d.state) return true; return false;}).length)
            {
              return "#FF0"
            }
            else{
              return "#b2b4b7"
            }
          }
          return color_scale(d['value']);
        })
        .on("click", function(e){
          d3.event.stopPropagation();
          callUx("map-click", e);
        });
    });
  }

  componentWillReceiveProps(nextprop) {
      console.log(nextprop.highlightStates)
      if(nextprop.renderData){
        this.updateData(nextprop.renderData, nextprop.highlightStates)
      }
    }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this)
    var svg = d3.select(el).append("svg")//add an empty svg

    if(this.props.renderData){
        this.updateData(this.props.renderData, this.props.highlightStates)
      }
  }


  render() {
    const {renderData} = this.props

    return (
      <div className="fullw fullh">
      </div>
    )
  }
}

MapUSA.propTypes = {
  renderData: PropTypes.array.isRequired,
  uxCallback: PropTypes.func.isRequired,
  highlightStates: PropTypes.array.isRequired
}
