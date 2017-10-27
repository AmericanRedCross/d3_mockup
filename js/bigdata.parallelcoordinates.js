var graph;
var dataset;

d3.csv('data/redcross.csv', function(data) {
  dataset = data;
  graph = d3.parcoords()('#wrapper')
  .data(data)
  .alpha(0.4)
  .mode("queue")
  .rate(5)
  .render()
  .interactive()
  .brushable()

  change_color("NPS");

  graph.svg
  .selectAll(".dimension")
  .on("click", change_color);

  var grid = d3.divgrid();
  d3.select("#grid")
  .datum(data.slice(0,10))
  .call(grid)
  .selectAll(".row")
  .on({
    "mouseover": function(d) { graph.highlight([d]) },
    "mouseout": graph.unhighlight
  });

  graph.on("brush", function(d) {
    d3.select("#grid")
    .datum(d.slice(0,10))
    .call(grid)
    .selectAll(".row")
    .on({
      "mouseover": function(d) { graph.highlight([d])},
      "mouseout": graph.unhighlight
    });
  });
});

// d3.select("#reset-data")
// .on("click", function() {
//   callUpdate(dataset);
// });


var color_scale = d3.scale.linear()
.domain([-2,-0.5,0.5,2])
.range(["#ca0020", "#f4a582", "#92c5de", "#0571b0"])
.interpolate(d3.interpolateLab);

function change_color(dimension) {
  graph.svg.selectAll(".dimension")
  .style("font-weight", "normal")
  .filter(function(d) { return d == dimension; })
  // .style("font-weight", "bold")

  graph.color(zcolor(graph.data(),dimension)).render()
}

function zcolor(col, dimension) {
  var z = zscore(_(col).pluck(dimension).map(parseFloat));
  return function(d) { return color_scale(z(d[dimension]))}
};

function zscore(col) {
  var n = col.length,
  mean = _(col).mean(),
  sigma = _(col).stdDeviation();

  return function(d) {
    return (d-mean)/sigma;
  };
};

function callUpdate(data) {
  graph.data(data).brush().render().updateAxes();

}
