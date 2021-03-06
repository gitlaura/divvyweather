function filterDistance(category){

  var maleColor = "#E74C3C",
      femaleColor = "#F1C40F",
      subscriberColor = "#9B59B6",
      customerColor = "#2ECC71";

  var margin = {top: 50, right: 100, bottom: 30, left: 50},
      width = 850 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%Y%m%d").parse,
          bisectDate = d3.bisector(function(d) { return d.date; }).left,
          formatOne = d3.format(",.1f"),
          formatTwo = d3.format(",.2f");

  var xDistance = d3.time.scale()
      .range([0, width]);

  var y0Distance = d3.scale.linear()
      .range([height, 0]);

  var y1Distance = d3.scale.linear()
      .range([height, 0]);

  var xAxisDistance = d3.svg.axis()
      .scale(xDistance)
      .orient("bottom")
      .ticks(d3.time.weeks,4);

  var yAxisLeftDistance = d3.svg.axis()
      .scale(y0Distance)
      .orient("left")
      .ticks(8);

  var yAxisRightDistance = d3.svg.axis()
      .scale(y1Distance)
      .orient("right")
      .ticks(8);

  // var area = d3.svg.area()
  //     .x(function(d) { return x(d.date); })
  //     .y0(height)
  //     .y1(function(d) { return y1(d.total_miles); });

  var tempDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y0Distance(d.avg_temp); });

  var totalDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y1Distance(d.total_miles); });

  var femaleDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y1Distance(d.female_miles); });

  var maleDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y1Distance(d.male_miles); });

  var custDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y1Distance(d.customer_miles); });

  var subDistanceLine = d3.svg.line()
      .x(function(d) { return xDistance(d.date); })
      .y(function(d) { return y1Distance(d.subscriber_miles); });

  var chartDistance = d3.select("#average_distance").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("csv/weekly_stats.csv", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.avg_temp = +d.avg_temp;
      d.rides_total = +d.rides_total;
      console.log(d.total_rides);
      d.female_rides = +d.female_rides;
      d.male_rides = +d.male_rides;
      d.customer_rides = +d.customer_rides;
      d.subscriber_rides = +d.subscriber_rides;
      d.total_miles = (+d.total_miles/d.rides_total);
      d.female_miles = (+d.female_miles/d.female_rides);
      d.male_miles = (+d.male_miles/d.male_rides);
      d.customer_miles = (+d.customer_miles/d.customer_rides);
      d.subscriber_miles = (+d.subscriber_miles/d.subscriber_rides);
    });

    xDistance.domain(d3.extent(data, function(d) { return d.date; }));
    y0Distance.domain([0, d3.max(data, function(d) {
      return Math.max(d.avg_temp); })]);
    y1Distance.domain([0.8, d3.max(data, function(d) {
      return Math.max(d.customer_miles); })]);

    // chartDistance.filter(function (d, i) {return d.total_miles > 5000;})
    //             .classed("selected", true);

    chartDistance.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0  ," + height + ")")
        .call(xAxisDistance);

    chartDistance.append("g")
        .attr("class", "y axis")
        .call(yAxisLeftDistance)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("fill", "gray")
        .style("text-anchor", "end")
        .text("Average Temp (F)");

    chartDistance.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
        .style("fill", "#3db7e4")
        .call(yAxisRightDistance)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 30)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Average Miles Per Ride");

      //add the rides line
      if (category == 'total'){
        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", totalDistanceLine)
            .style("stroke", "#3db7e4");
          }

        if (category == 'gender'){
        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", femaleDistanceLine)
            .style("stroke", femaleColor);

        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", maleDistanceLine)
            .style("stroke", maleColor);
          }

        if (category == 'customer'){
        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", custDistanceLine)
            .style("stroke", subscriberColor);

        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", subDistanceLine)
            .style("stroke", customerColor);
        }

      //add the temp line
        chartDistance.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", tempDistanceLine)
            .style("stroke", "gray");

      chartDistance.append("text")
          .attr("class", "title")
          .attr("x", 0)
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "left")
          .text("Average Distance Between Start & End Stations")
          .style("font-size","16px")
          .style("font-weight","bold");

          /*add focus line*/
          var focusLine = chartDistance.append("g")
                .attr("class", "focus")
                .style("display", "none");

          focusLine.append("line")
              .style("stroke", "black")
              .attr("x1", 0)
              .attr("y1", 0)
              .attr("x2", 0);

         /*add temperature textbox*/
          var focusTempText = chartDistance.append("g")
              .attr("class", "focus")
              .attr("transform", "translate(" + 630 + "," + 1+")")
              .style("display", "none");

          focusTempText.append("rect")
              .attr("x", -20)
              .attr("y", -30)
              .attr("width","85px")
              .attr("height", "35px")
              .style("stroke", "#4d4d4d")
              .style("fill", "none")
              .style("stroke-width", "1")
              .attr("border", "2px solid")
              .attr("opacity",0.8);

          focusTempText.append("text")
              .attr("x", -15)
              .attr("y", -20)
              .style("text-anchor", "left")
              .style("font-size","12px")
              .attr("dy", ".35em")
              .attr("fill","#4d4d4d");

          /*add first line*/
          var focusText1 = chartDistance.append("g")
              .attr("class", "focus")
              .attr("transform", "translate(" + 630 + "," + 16 +")")
              .style("display", "none");

          focusText1.append("text")
              .attr("x", -15)
              .attr("y", -20)
              .style("text-anchor", "left")
              .style("font-size","12px")
              .attr("dy", ".35em")
              .attr("fill","#3db7e4");

          /*add second line*/
          var focusText2 = chartDistance.append("g")
              .attr("class", "focus")
              .attr("transform", "translate(" + 630 + "," + 30 +")")
              .style("display", "none");

          focusText2.append("text")
              .attr("x", -15)
              .attr("y", -20)
              .style("text-anchor", "left")
              .style("font-size","12px")
              .attr("dy", ".35em")
              .attr("fill","#3db7e4");

         chartDistance.append("rect")
             .attr("class", "overlay")
             .attr("width", width)
             .attr("height", height)
             .on("mouseover", function() { focusLine.style("display", null); focusText1.style("display", null); focusText2.style("display", null); focusTempText.style("display", null); })
             .on("mouseout", function() { focusLine.style("display", "none"); focusText1.style("display", "none"); focusText2.style("display", "none"); focusTempText.style("display", "none"); })
             .on("mousemove", mousemove);

            function mousemove() {
              console.log(category);
              var x0 = xDistance.invert(d3.mouse(this)[0]);
              var i = bisectDate(data, x0, 1),
                  d0 = data[i - 1],
                  d1 = data[i],
                  d = x0 - d0.date > d1.date - x0 ? d1 : d0;
              focusLine.attr("transform", "translate(" + xDistance(d.date) + "," +y1Distance(d.total_miles) + ")");
              focusLine.select("line").attr("y2", "" + (190 - y1Distance(d.total_miles)) + "");
              focusTempText.select("text").text("Avg Temp: " + formatOne(d.avg_temp));
              focusText1.select("text").text("Avg Miles: "+ formatOne(d.total_miles));
              if (category == 'gender'){
                focusLine.attr("transform", "translate(" + xDistance(d.date) + "," +y1Distance(d.female_miles) + ")");
                focusLine.select("line").attr("y2", "" + (190 - y1Distance(d.female_miles)) + "");
                focusTempText.select("rect").attr("height", "50px")
                focusText1.select("text").text("Female: "+ formatOne(d.female_miles));
                focusText1.select("text").attr("fill",femaleColor);
                focusText2.select("text").text("Male: "+ formatOne(d.male_miles));
                focusText2.select("text").attr("fill",maleColor)
              }
              if (category == 'customer'){
                focusLine.attr("transform", "translate(" + xDistance(d.date) + "," +y1Distance(d.customer_miles) + ")");
                focusLine.select("line").attr("y2", "" + (190 - y1Distance(d.customer_miles)) + "");
                focusTempText.select("rect").attr("height", "50px")
                focusText1.select("text").text("Subscriber: "+ formatOne(d.subscriber_miles));
                focusText1.select("text").attr("fill",customerColor);
                focusText2.select("text").text("Customer: "+ formatOne(d.customer_miles));
                focusText2.select("text").attr("fill",subscriberColor)
              }
            }

  });
}
