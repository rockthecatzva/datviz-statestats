import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')
var topojson = require('topojson')

export default class MapUSA extends Component {

  updateData(data) {
    console.log(this, this.props.width, this.props.height);
    //var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
    //margin = {top: 20, right: 30, bottom: 30, left: 30},
    //width = +svg.attr("width") - margin.left - margin.right,
    //height = +svg.attr("height") - margin.top - margin.bottom
    //var width = 960,
      //  height = 500;

    var projection = d3.geoAlbersUsa().scale(700).translate([this.props.width / 2, this.props.height / 2]);;
    var path = d3.geoPath()
        .projection(projection);

    //var svg = d3.select("body").append("svg")
    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
        .attr("width", this.props.width)
        .attr("height", this.props.height);

    d3.json("us.json", function(json) {
      //console.log(topojson.feature(json, json.objects.states));
      var d = topojson.feature(json, json.objects.states)
      var t= d.features.map(function(val,i){
        //combine with the data here!!!
        //console.log(val.id)
        return Object.assign({}, val, {color:"red"})
      })

      d.features = t


      //console.log(t);

      var s = svg.selectAll("path")
        .data(t)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", (d,i)=>{console.log(d,i); return "states"});

        /*
      //console.log(us, us.objects.states);
      svg.append("path")
          .attr("class", "states")
          .data([d])
          .attr("class", (d,i)=>{console.log(d,i); return "hhhh"})
          //.datum(topojson.feature(json, json.objects.states))
          .attr("d", path);
          */
    });
  }

  componentWillReceiveProps(nextprop) {
    console.log("GETTING PROPS YO", nextprop)
      this.updateData(nextprop.renderData)
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


    return (
      <div className={"graph-box panel-body"}>
      <h2>{title}</h2>
      {(!renderData) &&
        <div className="loading">Loading&#8230;</div>
      }
      </div>
    )
  }
}

MapUSA.propTypes = {
  //renderData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  //title: PropTypes.string.isRequired
}
