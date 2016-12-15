import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var Loader = require('halogen/PulseLoader');

var d3 = require('d3')

const MARGIN = 30
//IS THIS STATE???
var width, height = 0

export default class GraphBoxClickDate extends Component {

  updateData(data) {
  //  console.log("Error checking", data.graphData)

    if((data.graphData[0].length - 1)&&(data.graphData[1].length - 1))
    {
      const {lineTags} = this.props
      //console.log("Number of points is:", data.graphData[0].length - 1)
      var el = d3.select(ReactDOM.findDOMNode(this)).select("svg")
      var max = 0

      {
        data.graphData.map(function (arr) {
          //console.log(arr, "is the error here?")
          if (arr) {
            arr.map(function (rating) {
              if (rating.rating > max) {
                max = rating.rating;
              }
            })
          }
        })
      }

      var max_x = 0
      var maxset = null

      for (var set in data.graphData) {
        if((data.graphData[set].length-1) > max_x) {
          max_x= data.graphData[set].length-1;
          maxset = set
        }
      }

      var x = d3.scaleLinear().domain([0, max_x]).range([MARGIN, width - MARGIN])
      //console.log("This is max_x: ", max_x, data.graphData[0].length)


      var y = d3.scaleLinear().domain([0, max]).range([height - MARGIN, MARGIN]);

      var line = d3.line()
      .x(function (d, i) {
        return x(i)
      })
      .y(function (d) {
        return y(d.rating)
      });

      var xAxis = d3.axisBottom(x);

      var xlabels = data.graphData[maxset].map(function (d) {
        var t = new Date(d.date_time)
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        //var s = t.getMonth() + 1 + "/" + t.getDate();
        var s = months[t.getMonth()]
        return s
      })

      xAxis.ticks(data.graphData[maxset].length)
      xAxis.tickFormat(function (d, i) {
        if(i%4==0) return xlabels[i];
        return "";
      })
      // Add the x-axis.
      el.selectAll(".xaxis").remove()
      el.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height - MARGIN) + ")")
      .call(xAxis);

      //add the y axis
      var yAxisLeft = d3.axisLeft(y);
      el.selectAll(".yaxis").remove()
      el.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(" + MARGIN + ",0)")
      .call(yAxisLeft);

      el.selectAll(".line").remove()
      el.selectAll(".dot").remove()

      var par = this

      {
        data.graphData.map(function (arr, iter) {
          var graph = el.append("g").data([arr]);
          graph.append("path")
          .attr("class", lineTags[iter]+"-line line")
          .attr("d", line);
          //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
          var d = el.append("g").selectAll("circle").data(arr);
          d.enter().append("circle")
          //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
          .attr("class", lineTags[iter]+"-dot dot")
          .attr("r", 3)
          .merge(d)//ENTER AND UPDATE
          .attr("cx", function (d, i) {
            return x(i);
          })
          .attr("cy", function (d) {
            return y(d.rating);
          })
          .on("mouseover", function(d,i){
            console.log("MOUSE OVER", d.date_time)
            par.props.onCircleClick(d)


          });

          d.exit().remove();
        })
      }
    }
  }


  componentWillReceiveProps(nextprop) {
    //console.log("testing incoming data", nextprop)

    //this will only handle 2 lines, not 1 and not 2+ but 2 - need to rethink this
    if(JSON.stringify(nextprop.graphData) !== JSON.stringify(this.props.graphData)){

      //console.log("ITS DIFFERENT DATA TOO!!", nextprop.graphData, this.props.graphData, (nextprop.graphData == this.props.graphData))
      this.updateData(nextprop)

      //THE ISSUE IS THAT GRAPH AND TABLES ARE RECIEVING THE SAME DATA AGAIN
      //NEED TO MAKE THEM IGNORE IT UNLESS THE SUBMIT BUTTON HAS BEEN PRESSED
      //IM STILL NOT SURE WHY ITS GETTING FIRED SIMPLY BY CHANIGN NET OR WEEK

    }
  }


  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    width = el.offsetWidth
    height = el.offsetHeight

    var formatDate = d3.timeFormat("%d-%b-%y")
    var svg = d3.select(el).append("svg")
    .attr("width", width)
    .attr("height", height)
  }


  render() {
    const {graphData, lineTags, onCircleClick} = this.props

    //console.log("Rendering the graph", spin, this.spin, this.props.showSpinner)

    return (
      <div className={"graph-box panel-body"}>
      {(!graphData[0]) &&
        <div className="spinner">
        <Loader color="#26A65B" size="16px" margin="4px"/>
        <span className="sr-only">Loading...</span>
        </div>
      }
      </div>
    )
  }
}

GraphBoxClickDate.propTypes = {
  graphData: PropTypes.array.isRequired,
  lineTags: PropTypes.array.isRequired,
  //isFetching: PropTypes.bool.isRequired,
  onCircleClick: PropTypes.func.isRequired
}
