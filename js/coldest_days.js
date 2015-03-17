function filterCold(category){

  var number_of_rides = 30;

  var maleColor = "#E74C3C",
      femaleColor = "#F1C40F",
      subscriberColor = "#9B59B6",
      customerColor = "#2ECC71";

  var left_margin = 100,
      top_margin = 50;

  var width = 220,
      barHeight = 25;

  var x = d3.scale.linear()
      .range([0, 800]);

  var parseDate = d3.time.format("%Y%m%d").parse;

  var bar_chart = d3.select("#coldest_days").append("svg")
      .attr("width", width + left_margin);

  d3.csv("csv/coldest_days.csv", function(error, data) {
    data.forEach(function(d) {
      d.rides_total = +d.rides_total;
      console.log(d.date + ": " + d.rides_total + ", " + data.length);
    });

    x.domain([0, d3.max(data, function(d) {
      return "12000";})]);

    bar_chart.attr("height", barHeight * number_of_rides + top_margin);

    bar_chart.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", top_margin/2)
        .attr("text-anchor", "left")
        .text("Rides on 2014's 30 Coldest Days")
        .style("font-size","16px")
        .style("font-weight","bold");

    bar_chart.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", 45)
        .attr("text-anchor", "left")
        .text("Day")
        .style("font-family","Arial Narrow, Helvetica, sans-serif")
        .style("font-size","12px");

        bar_chart.append("text")
            .attr("class", "title")
            .attr("x", 45)
            .attr("y", 45)
            .attr("text-anchor", "left")
            .text("Avg Temp")
            .style("font-family","Arial Narrow, Helvetica, sans-serif")
            .style("font-size","12px");

            bar_chart.append("text")
                .attr("class", "title")
                .attr("x", 100)
                .attr("y", 45)
                .attr("text-anchor", "left")
                .text("Ride Count")
                .style("font-family","Arial Narrow, Helvetica, sans-serif")
                .style("font-size","12px");


    var bar = bar_chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate("+left_margin +"," + (i * barHeight + top_margin) +")"; });

    if(category == "total"){
      bar.append("rect")
          .attr("width", function(d) { return x(d.rides_total); })
          .attr("height", barHeight - 3)
          .style("fill", "#3db7e4");

          bar.append("text")
              .attr("x", function(d) { return x(d.rides_total) + 3; })
              .attr("y", barHeight / 2)
              .attr("dy", ".35em")
              .text(function(d) { return d.rides_total; })
              .style("font-family","Arial Narrow, Helvetica, sans-serif")
              .style("font-size","12px");
      }

    if(category == "gender"){
      bar.append("rect")
          .attr("width", function(d) { return x(d.female_rides); })
          .attr("height", barHeight - 2)
          .style("fill", femaleColor);

      bar.append("rect")
          .attr("width", function(d) { return x(d.male_rides); })
          .attr("height", barHeight - 2)
          .attr("transform", function(d, i) { return "translate("+ x(d.female_rides) +"," + 0 +")"; })
          .style("fill", maleColor);

      bar.append("rect")
          .attr("width", function(d) { return x(d.rides_total) - x(d.female_rides) - x(d.male_rides); })
          .attr("height", barHeight - 2)
          .attr("transform", function(d, i) { return "translate("+ (x(d.female_rides) + x(d.male_rides)) +"," + 0 +")"; })
          .style("fill", "#D7D7D7");

      bar.append("text")
          .attr("x", function(d) { return x(d.rides_total) + 3; })
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.rides_total; })
          .style("font-family","Arial Narrow, Helvetica, sans-serif")
          .style("font-size","12px");
      }


    if(category == "customer"){
      bar.append("rect")
          .attr("width", function(d) { return x(d.customer_rides); })
          .attr("height", barHeight - 2)
          .style("fill", subscriberColor);

      bar.append("rect")
          .attr("width", function(d) { return x(d.subscriber_rides); })
          .attr("height", barHeight - 2)
          .attr("transform", function(d, i) { return "translate("+ x(d.customer_rides) +"," + 0 +")"; })
          .style("fill", customerColor);

          bar.append("text")
              .attr("x", function(d) { return x(d.rides_total) + 3; })
              .attr("y", barHeight / 2)
              .attr("dy", ".35em")
              .text(function(d) { return d.rides_total; })
              .style("font-family","Arial Narrow, Helvetica, sans-serif")
              .style("font-size","12px");
    }

    bar.append("text")
        .attr("x", function(d) { return -left_margin; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return (d.day_of_week + " " + d.month + "/" + d.day ); })
        .style("font-family","Arial Narrow, Helvetica, sans-serif")
        .style("font-size","12px");

        bar.append("text")
            .attr("x", -40)
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return (d.avg_temp); })
            .style("font-family","Arial Narrow, Helvetica, sans-serif")
            .style("font-size","12px");
  });
}
