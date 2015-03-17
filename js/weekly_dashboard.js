function filterRides(category) {
  d3.selectAll("svg").remove();

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

  var xRide = d3.time.scale()
      .range([0, width]);

  var y0Ride = d3.scale.linear()
      .range([height, 0]);

  var y1Ride = d3.scale.linear()
      .range([height, 0]);

  var xAxisRide = d3.svg.axis()
      .scale(xRide)
      .orient("bottom")
      .ticks(d3.time.weeks,4);

  var yAxisLeftRide = d3.svg.axis()
      .scale(y0Ride)
      .orient("left")
      .ticks(8);

  var yAxisRightRide = d3.svg.axis()
      .scale(y1Ride)
      .orient("right")
      .ticks(8);

  // var area = d3.svg.area()
  //     .x(function(d) { return x(d.date); })
  //     .y0(height)
  //     .y1(function(d) { return y1(d.total_minutes); });

  var tempRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y0Ride(d.avg_temp); });

  var totalRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y1Ride(d.rides_total); });

  var femaleRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y1Ride(d.female_rides); });

  var maleRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y1Ride(d.male_rides); });

  var custRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y1Ride(d.customer_rides); });

  var subRideLine = d3.svg.line()
      .x(function(d) { return xRide(d.date); })
      .y(function(d) { return y1Ride(d.subscriber_rides); });

  var chartRide = d3.select("#average_time").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("csv/weekly_dashboard.csv", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.avg_temp = +d.avg_temp;
      d.rides_total = +d.rides_total;
      console.log(d.total_rides);
      d.female_rides = +d.female_rides;
      d.male_rides = +d.male_rides;
      d.customer_rides = +d.customer_rides;
      d.subscriber_rides = +d.subscriber_rides;
      d.total_minutes = (+d.total_seconds/60.0/d.rides_total);
      d.female_minutes = (+d.female_seconds/60.0/d.female_rides);
      d.male_minutes = (+d.male_seconds/60.0/d.male_rides);
      d.customer_minutes = (+d.customer_seconds/60.0/d.customer_rides);
      d.subscriber_minutes = (+d.subscriber_seconds/60.0/d.subscriber_rides);
    });

    xRide.domain(d3.extent(data, function(d) { return d.date; }));
    y0Ride.domain([0, d3.max(data, function(d) {
      return Math.max(d.avg_temp); })]);
    y1Ride.domain([0, d3.max(data, function(d) {
      return Math.max(d.rides_total); })]);

    // chartRide.filter(function (d, i) {return d.total_minutes > 5000;})
    //             .classed("selected", true);

    chartRide.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0  ," + height + ")")
        .call(xAxisRide);

    chartRide.append("g")
        .attr("class", "y axis")
        .call(yAxisLeftRide)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "gray")
        .text("Average Temp (F)");

    chartRide.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
        .style("fill", "#3db7e4")
        .call(yAxisRightRide)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 50)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Rides Per Week");

      //add the rides line
      if (category == 'total'){
        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", totalRideLine)
            .style("stroke", "#3db7e4");
          }

        if (category == 'gender'){
        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", femaleRideLine)
            .style("stroke", femaleColor);

        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", maleRideLine)
            .style("stroke", maleColor);
          }

        if (category == 'customer'){
        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", custRideLine)
            .style("stroke", subscriberColor);

        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", subRideLine)
            .style("stroke", customerColor);
        }

      //add the temp line
        chartRide.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", tempRideLine)
            .style("stroke", "gray");

        chartRide.append("text")
            .attr("class", "title")
            .attr("x", 0)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "left")
            .text("Number of Rides By Week")
            .style("font-size","16px")
            .style("font-weight","bold");

        var focus = chartRide.append("g")
              .attr("class", "focus")
              .style("display", "none");

          focus.append("circle")
              .attr("r", 4.5);

          focus.append("rect")
              .attr("x", -80)
              .attr("y", -28)
              .attr("width","160px")
              .attr("height", "15px")
              .attr("fill","#2B2B2B")
              .attr("opacity",0.8);

          focus.append("text")
              // .attr("x", -10)
              .attr("y", -20)
              .style("text-anchor", "middle")
              .style("font-size","12px")
              .attr("dy", ".35em")
              .attr("fill","white");

          chartRide.append("rect")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove);

          function mousemove() {
            console.log(category);
            var x0 = xRide.invert(d3.mouse(this)[0]);
            var i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + xRide(d.date) + "," +y0Ride(d.avg_temp) + ")");
            focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ",  Rides: "+ d.rides_total);
            if (category == 'gender'){
              focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ", Female: "+ d.female_rides + ", Male: "+ d.male_rides);
              focus.select("rect").attr("width","200px");
              focus.select("rect").attr("x",-100);
            }
            if (category == 'customer'){
              focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ", Subscriber: "+ d.subscriber_rides+ ", Customer: "+ d.customer_rides);
              focus.select("rect").attr("width","240px");
              focus.select("rect").attr("x",-120);
            }
          }
  });
}

function filterTime(category){

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

  var xTime = d3.time.scale()
      .range([0, width]);

  var y0Time = d3.scale.linear()
      .range([height, 0]);

  var y1Time = d3.scale.linear()
      .range([height, 0]);

  var xAxisTime = d3.svg.axis()
      .scale(xTime)
      .orient("bottom")
      .ticks(d3.time.weeks,4);

  var yAxisLeftTime = d3.svg.axis()
      .scale(y0Time)
      .orient("left")
      .ticks(8);

  var yAxisRightTime = d3.svg.axis()
      .scale(y1Time)
      .orient("right")
      .ticks(8);

  // var area = d3.svg.area()
  //     .x(function(d) { return x(d.date); })
  //     .y0(height)
  //     .y1(function(d) { return y1(d.total_minutes); });

  var tempTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y0Time(d.avg_temp); });

  var totalTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y1Time(d.total_minutes); });

  var femaleTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y1Time(d.female_minutes); });

  var maleTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y1Time(d.male_minutes); });

  var custTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y1Time(d.customer_minutes); });

  var subTimeLine = d3.svg.line()
      .x(function(d) { return xTime(d.date); })
      .y(function(d) { return y1Time(d.subscriber_minutes); });

  var chartTime = d3.select("#average_time").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("csv/weekly_dashboard.csv", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.avg_temp = +d.avg_temp;
      d.rides_total = +d.rides_total;
      console.log(d.total_rides);
      d.female_rides = +d.female_rides;
      d.male_rides = +d.male_rides;
      d.customer_rides = +d.customer_rides;
      d.subscriber_rides = +d.subscriber_rides;
      d.total_minutes = (+d.total_seconds/60.0/d.rides_total);
      d.female_minutes = (+d.female_seconds/60.0/d.female_rides);
      d.male_minutes = (+d.male_seconds/60.0/d.male_rides);
      d.customer_minutes = (+d.customer_seconds/60.0/d.customer_rides);
      d.subscriber_minutes = (+d.subscriber_seconds/60.0/d.subscriber_rides);
    });

    xTime.domain(d3.extent(data, function(d) { return d.date; }));
    y0Time.domain([0, d3.max(data, function(d) {
      return Math.max(d.avg_temp); })]);
    y1Time.domain([0, d3.max(data, function(d) {
      return Math.max(d.customer_minutes); })]);

    // chartTime.filter(function (d, i) {return d.total_minutes > 5000;})
    //             .classed("selected", true);

    chartTime.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0  ," + height + ")")
        .call(xAxisTime);

    chartTime.append("g")
        .attr("class", "y axis")
        .call(yAxisLeftTime)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("fill", "gray")
        .style("text-anchor", "end")
        .text("Average Temp (F)");

    chartTime.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
        .style("fill", "#3db7e4")
        .call(yAxisRightTime)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 30)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Average Minutes Per Ride");

      //add the rides line
      if (category == 'total'){
        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", totalTimeLine)
            .style("stroke", "#3db7e4");
          }

        if (category == 'gender'){
        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", femaleTimeLine)
            .style("stroke", femaleColor);

        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", maleTimeLine)
            .style("stroke", maleColor);
          }

        if (category == 'customer'){
        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", custTimeLine)
            .style("stroke", subscriberColor);

        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", subTimeLine)
            .style("stroke", customerColor);
        }

      //add the temp line
        chartTime.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", tempTimeLine)
            .style("stroke", "gray");

      chartTime.append("text")
          .attr("class", "title")
          .attr("x", 0)
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "left")
          .text("Average Minutes Per Ride By Week")
          .style("font-size","16px")
          .style("font-weight","bold");

          var focus = chartTime.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 4.5);

            focus.append("rect")
                .attr("x", -80)
                .attr("y", -28)
                .attr("width","160px")
                .attr("height", "15px")
                .attr("fill","#2B2B2B")
                .attr("opacity",0.8);

            focus.append("text")
                .attr("y", -20)
                .style("text-anchor", "middle")
                .attr("dy", ".35em")
                .style("font-size","12px")
                .attr("fill","white");

            chartTime.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            function mousemove() {
              console.log(category);
              var x0 = xTime.invert(d3.mouse(this)[0]);
              var i = bisectDate(data, x0, 1),
                  d0 = data[i - 1],
                  d1 = data[i],
                  d = x0 - d0.date > d1.date - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + xTime(d.date) + "," +y0Time(d.avg_temp) + ")");
              focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ",  Avg Minutes: "+formatOne(d.total_minutes));
              if (category == 'gender'){
                focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ", Female: "+formatOne(d.female_minutes) + ", Male: "+formatOne(d.male_minutes));
                focus.select("rect").attr("width","200px");
                focus.select("rect").attr("x",-100);
              }
              if (category == 'customer'){
                focus.select("text").text("Temp: " + formatOne(d.avg_temp) + ", Subscriber: "+ formatOne(d.subscriber_minutes)+ ", Customer: "+formatOne(d.customer_minutes));
                focus.select("rect").attr("width","220px");
                focus.select("rect").attr("x",-110);
              }
            }

  });
}
