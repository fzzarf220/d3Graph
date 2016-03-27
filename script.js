	var margin = {
	  top: 30,
	  right: 10,
	  bottom: 100,
	  left: 40
	}, width = 960 - margin.left - margin.right,
	  height = 500 - margin.top - margin.bottom,
	  margin2 = {
	    top: (height + margin.top + margin.bottom) - 70,
	    right: 10,
	    bottom: 20,
	    left: 40
	  }, height2 = 500 - margin2.top - margin2.bottom;

	var bisectDate = d3.bisector(function(d) {
	  return d.date;
	}).left,
	  formatValue = d3.format(",.2f"),
	  formatCurrency = function(d) {
	    return "$" + formatValue(d);
	  };

	/*********************************************************************
    HELPER VARIABLES
   *********************************************************************/
	 // date parser
	var parseDate = d3.time.format("%d-%b-%y").parse;

	 // helpers with scale data
	var x_scaler = d3.time.scale()
	  .range([0, width])
	 var y_scaler = d3.scale.linear()
	  .range([height, 0])

	 var x2_scaler = d3.time.scale()
	  .range([0, width])
	 var y2_scaler = d3.scale.linear()
	  .range([height2, 0])

	 // helpers to create axis
	 var x_axis_setter = d3.svg.axis()
	  .scale(x_scaler)
	  .orient("bottom")
	 var y_axis_setter = d3.svg.axis()
	  .scale(y_scaler)
	  .orient("left")

	 var x2_axis_setter = d3.svg.axis()
	  .scale(x2_scaler)
	  .orient("bottom")
	 var y2_axis_setter = d3.svg.axis()
	  .scale(y2_scaler)
	  .orient("left")

	 // graph painters
	 var painter1 = d3.svg.line()
	  .x(function(d) {
	    return x_scaler(d.date)
	  })
	  .y(function(d) {
	    return y_scaler(d.close)
	  })
	  .interpolate("linear");
	var painter2 = d3.svg.line()
	  .x(function(d) {
	    return x2_scaler(d.date)
	  })
	  .y(function(d) {
	    return y2_scaler(d.close)
	  })
	  .interpolate("linear");

	var brushSmall = d3.svg.brush()
	  .x(x2_scaler)
	  .on("brush", function() {
	    if (selector.selectingEnabled !== true) {
	      //set the new scale in respect to what's selected by the brush
	      x_scaler.domain(brushSmall.empty() ? x2_scaler.domain() : brushSmall.extent());
	      //repaint the line
	      chartAreaBig.select(".line")
	        .attr("d", painter1);
	      //reset the axis
	      chartAreaBig.select(".x.axis").call(x_axis_setter);
	    }
	  })
	  .on("brushend", function() {
	    //set the new scale in respect to what's selected by the brush
	    x_scaler.domain(brushSmall.empty() ? x2_scaler.domain() : brushSmall.extent());
	    //repaint the line
	    chartAreaBig.select(".line")
	      .attr("d", painter1);
	    //reset the axis
	    chartAreaBig.select(".x.axis").call(x_axis_setter);
	  });


  //initially set area
  /*
  -------------------------------------------------
  | --------------------------------------------- |
  | | ----------------------------------------- | |
  | | | ------------------------------------- | | |
  | | | | --------------------------------- | | | |
  | | | | | ----------------------------- | | | | |
  | | | | | |                           | | | | | |
  | | | | | |                           | | | | | |
  | | | | | |                           | | | | | |
  | | | | | |                           | | | | | |
  | | | | | |                           | | | | | |
  | | | | | |                           | | | | | |
  | | | | | | overlay area              | | | | | |
  | | | | | ----------------------------- | | | | |
  | | | | | note/guide area               | | | | |
  | | | | --------------------------------- | | | |
  | | | | graph area                        | | | |
  | | | ------------------------------------- | | |
  | | | axis  area                            | | |
  | | ----------------------------------------- | |
  | | top graph                                 | |
  | --------------------------------------------- |
  | | ----------------------------------------- | |
  | | | ------------------------------------- | | |
  | | | |                                   | | | |
  | | | |                                   | | | |
  | | | | graph area                        | | | |
  | | | ------------------------------------- | | |
  | | | axis area                             | | |
  | | ----------------------------------------- | |
  | | bottom graph                              | |
  | --------------------------------------------- |
  | chart area                                    |
  -------------------------------------------------
  */



	/*********************************************************************
    CHART AREA
   *********************************************************************/
  var chartArea = d3.select("body").append("svg")
      .attr("class", "chartArea")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  //===============================================
  // upper chart
  //===============================================
  var chartAreaBig = chartArea.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  chartAreaBig.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  //-----------------------------------------------
  // set the x and y axis 
  //-----------------------------------------------
  chartAreaBig.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      
  chartAreaBig.append("g").attr("class", "y axis")

  //-----------------------------------------------
  // graph area
  //-----------------------------------------------
  var graphAreaBig=chartAreaBig.append("g").attr("class", "graph1")
	    .attr("clip-path", "url(#clip)")
  
  //-----------------------------------------------
  // selector area
  //-----------------------------------------------
  var selector = graphAreaBig.append("g")
      .attr("class", "brush")
    .append("rect")
      .attr("class", "extent")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height)

	 //-----------------------------------------------
	 // graph pointer area
	 //-----------------------------------------------
  var focus = graphAreaBig.append("g")
      .attr("class", "focus")
      .style("display", "none")

  var guide = focus.append("g")
     .attr("class", "guide")
  
  guide.append("rect")
      .attr("class", "guide_vert")
      .attr("width", 1)
      .attr("height", height + 10)
      .attr("x", 0)
      .attr("y", 4)
  
  guide.append("rect")
      .attr("class", "guide_hor")
      .attr("height", 1)
      .attr("width", width + 10)
      .attr("x", -width - 14)
      .attr("y", 0)
      
  focus.append("circle")
      .attr("r", 3.5);
  
  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  //-----------------------------------------------
  // notes area
  //-----------------------------------------------
  chartAreaBig.append("g")
      .style("display", "none")
      .attr("class", "note focus")
      .attr("transform", "translate(10,-10)")
    .append("circle")
      .attr("class", "focus")
      .attr("r", 5)
      .attr("cy", -6)
  
  chartAreaBig.select(".note")
    .append("text")
      .style("font-weight", "bold")
      .style("color", "orangered")
      .attr("x", 9)
  
  //-----------------------------------------------
  // inserting the overlay
  //-----------------------------------------------
    chartAreaBig.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      // .on("mousemove",overlayMouseover)
      .on("mousedown", function() {
        //create custom selector
        var mouseCoords = d3.mouse(this)
        selector.selectingEnabled = true;
        selector.xStart = mouseCoords[0]
        selector
        .attr("x", selector.xStart)
        .attr("width", "0")
        .style("display", "block")
        
        //create new event
        var event1 = new Event("mousedown")
        event1.pageX = d3.event.pageX;
        event1.clientX = d3.event.clientX;
        event1.pageY = d3.event.pageY;
        event1.clientY = d3.event.clientY;
        chartAreaSmall.select(".brush").node().dispatchEvent(event1)
      })
      .on("mouseover", function() {
        focus.style("display", null);
        chartAreaBig.select(".note").style("display", null)
      })
      .on("mouseout", function() {
        focus.style("display", "none");
        chartAreaBig.select(".note").style("display", "none")
      })
      .on("mouseup", function() {
        selector.selectingEnabled = false;
        selector.style("display", "none")
      })
      .on("dblclick", function() {
        var brush = chartAreaBig.select(".brush");
        // brush.select(".brush").clear()
        console.log("double click")
      })

	 //===============================================
	 // lower chart
	 //===============================================
	 var chartAreaSmall = chartArea.append("g")
	  .attr("id", "chartSmall")
	  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
	 // y axis
	 chartAreaSmall.append("g")
	  .attr("transform", "translate(0," + height2 + ")")
	  .attr("class", "x axis")

	 //-----------------------------------------------
	 // graph area
	 //-----------------------------------------------
	 chartAreaSmall.append("g").attr("class", "graph1")

	 //-----------------------------------------------
	 // add graph brush
	 //-----------------------------------------------
	 chartAreaSmall.append("g")
	  .attr("class", "x brush")
	  .call(brushSmall)
	  .selectAll("rect")
	  .attr("y", -6)
	  .attr("height", height2 + 7);

	 /*********************************************************************
     Paint Data
    *********************************************************************/
   d3.csv("data.csv"
	  //draw the line
	  , function(error, data) {
	    paintGraph(data)
	  })

	 d3.csv("data1.csv"
	  //draw the line
	  , function(error, data) {
	    return
	    paintGraph(data)
	  })

	/**
	 * paint the graph in given selector for given data
	 * @param object - the selector
	 * @param object - the data
	 * @return void
	 **/
	function paintGraph(data) {
	  data.forEach(function(d) {
	    d.date = parseDate(d.date);
	    d.close = +d.close;
	  });

	  data.sort(function(a, b) {
	    return a.date - b.date;
	  });

	  // set the graph scale in respect to min and max values from retrieved data
	  x_scaler.domain([data[0].date, data[data.length - 1].date])
	  y_scaler.domain(d3.extent(data, function(d) {
	    return d.close
	  }));
	  x2_scaler.domain(x_scaler.domain());
	  y2_scaler.domain(y_scaler.domain());

	  //-----------------------------------------------
	  // chart area big
	  //-----------------------------------------------
	  // set the x and y axis
	  chartAreaBig.select(".x.axis")
	    .call(x_axis_setter)
	  chartAreaBig.select(".y.axis")
	    .call(y_axis_setter)

	  // create graph form data
	  chartAreaBig.select(".graph1")
	    .append("path")
	    .datum(data)
	    .attr("d", painter1)
	    .attr("class", "line")

	  //-----------------------------------------------
	  // chart area small
	  //-----------------------------------------------
	  // x axis
	  chartAreaSmall.select(".x.axis")
	    .call(x2_axis_setter)

	  //paint graph
	  chartAreaSmall.select(".graph1")
	    .append("path")
	    .datum(data)
	    .attr("d", painter2)
	    .attr("class", "line")

	  chartAreaBig.select(".overlay")
	    .on("mousemove", function() {
	      if (data === null) return

	      var coord = d3.mouse(this)
	      var x0 = x_scaler.invert(coord[0]),
	        i = bisectDate(data, x0, 1),
	        d0 = data[i - 1],
	        d1 = data[i],
	        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

	      focus.attr("transform", "translate(" + x_scaler(d.date) + "," + y_scaler(d.close) + ")");
	      //focus.select("text").text(formatCurrency(d.close));

	      // price
	      chartAreaBig.select(".note").select("text").text(formatCurrency(d.close))

	      // selector moving
	      if (selector.selectingEnabled === true) {
	        var mouseCoords = d3.mouse(this);
	        selector.attr("width", function() {
	          selector.xEnd = mouseCoords[0]
	          selector.attr("x", selector.xStart)

	          if (selector.xEnd <= selector.xStart)
	            selector.attr("x", selector.xEnd)

	          return Math.abs(selector.xEnd - selector.xStart)
	        })
	      }
	    })
	}