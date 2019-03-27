function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
    
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    
    // Set up chart
    var svgWidth = 800;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 50
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Import data from the data.csv file

    d3.csv("assets/data/data.csv").then(function( data_in) {
      // if (error) throw error;
    
      console.log(data_in);
    
      // Format the data
      data_in.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });
    
      // Create Scales

      var xLinearScale1 = d3.scaleLinear()
        .domain([d3.min(data_in, d => d.income)-1000, d3.max(data_in, d => d.income)+1500])
        .range([0, width]);
    
      var yLinearScale1 = d3.scaleLinear()
        .domain([0, d3.max(data_in, d => d.healthcare)+2])
        .range([height, 0]);
    

      // Create Axes

      var bottomAxis = d3.axisBottom(xLinearScale1);
      var leftAxis = d3.axisLeft(yLinearScale1);
      
      // Append axes to the chartGroup 

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    
      chartGroup.append("g")
        .call(leftAxis);
    
        // append circles to data points
        var circlesGroup = chartGroup.selectAll("circle")
        .data(data_in)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale1(d.income))
        .attr("cy", d => yLinearScale1(d.healthcare))
        .attr("r", "8")
        .attr("opacity", "0.8")
        .classed("stateCircle", true);
    
        // append text to circles 
        var circletext = chartGroup
        .selectAll(".stateText")
        .data(data_in)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale1(d.income))
        .attr("y", d => yLinearScale1(d.healthcare)+3)
        .text(function (d) { return d.abbr })
        .classed("stateText", true)
        .attr("font-size", "8px");
      
    
        /* Initialize tooltip */
        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) { return `${d.state} <br> Income: $${d.income} <br> Lacks Healthcare: ${d.healthcare}%`});
        
        /* Invoke the tip in the context of your visualization */
        circlesGroup.call(tip)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    
        // Add title and axis labels
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "gray")
        .text("Household Income Median");
    
        chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 0- margin.left)
        .attr("x", 0- height/2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Lacks Healthcare (%)")
        .attr("font-size", "20px")
        .attr("fill", "gray");;
    
        // console.log(width)
        // console.log(height)
    
        chartGroup.append("text")
        .style("text-anchor", "middle")
        .attr("transform", `translate(${width / 2})`)
        .text("Healthcare vs. Income")
        .attr("font-size", "30px")
        .attr("fill", "gray");;
    });
    }
    
    makeResponsive();
    
    // Event listener for window resize.
    d3.select(window).on("resize", makeResponsive);