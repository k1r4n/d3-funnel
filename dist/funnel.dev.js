"use strict";

var margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
},
    width = 300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
var x = d3.scaleLinear().range([0, 300]);
var y = d3.scaleLinear().range([500, 0]);
x.domain([0, 300]);
y.domain([0, 500]);
var data = [{
  key: 'Viewed Entity',
  value: 9450
}, {
  key: 'Added to Cart',
  value: 8356
}, {
  key: 'Shipping',
  value: 7964
}, {
  key: 'Payment',
  value: 4054
}, {
  key: 'Subscribed',
  value: 2826
}];

var formatData = function formatData(data) {
  var polygonHeight = (height - 60) / data.length;
  data.map(function (item, index) {
    var dimension = [];
    dimension.push({
      x: index * 10,
      y: height - 10 - index * (polygonHeight + 10)
    });
    dimension.push({
      x: width - index * 10,
      y: height - 10 - index * (polygonHeight + 10)
    });
    dimension.push({
      x: width - 10 - index * 10,
      y: height - 10 - index * (polygonHeight + 10) - polygonHeight
    });
    dimension.push({
      x: 10 + index * 10,
      y: height - 10 - index * (polygonHeight + 10) - polygonHeight
    });
    data[index].dimension = dimension;
    data[index].innerEllipse = {
      cx: width / 2,
      cy: index * (polygonHeight + 10) + 50,
      rx: (width - 2 * (index * 10)) / 2,
      ry: 10
    };
    data[index].outerEllipse = {
      cx: width / 2,
      cy: (index + 1) * (polygonHeight + 10) + 40,
      rx: (width - 10 - index * 10 - (10 + index * 10)) / 2,
      ry: 10
    };
    data[index].text = {
      top: data[index].innerEllipse.cy + (data[index].outerEllipse.cy - data[index].innerEllipse.cy) / 2,
      left: width / 2
    };

    if (index !== 0) {
      data[index].percentage = parseInt((1 - data[index].value / data[index - 1].value) * 100, 10);
    }
  });
};

formatData(data);
var colors = ['#EA5455', '#FFA36C', '#96BB7C', '#A3D2CA', '#E8DED2'];
var innerColors = ['#FF7475', '#FC7728', '#78AA55', '#7ACBBD', '#FFE2BF'];
var color = d3.scaleOrdinal(colors);
var innerColor = d3.scaleOrdinal(innerColors);

var mouseover = function mouseover(d, i) {
  d3.select('#tooltip').remove();
  d3.select('body').append('div').attr('id', 'tooltip').style('width', '300px').style('height', '40px').style('background-color', 'white').style('border', '2px solid grey').style('border-radius', '4px').style('z-index', 10).style('position', 'absolute').style('left', "".concat(d3.event.pageX, "px")).style('top', "".concat(d3.event.pageY, "px")).html("<table style=\"margin: 5px; width: 100%; height: 100%;\">\n            <tbody>\n                <tr>\n                    <td><div style=\"max-height: 5px; max-width: 3px; padding: 5px; background-color: ".concat(color((i + 1) / data.length), "\"></div></td>\n                    <td style=\"font-weight: 600\">").concat(d.key, "</td>\n                    <td>").concat(d.value, "</td>\n                </tr>\n            </tbody>\n        </table>"));
};

var mousemove = function mousemove(d, i) {
  d3.select('#tooltip').remove();
  d3.select('body').append('div').attr('id', 'tooltip').style('width', '300px').style('height', '40px').style('background-color', 'white').style('border', '2px solid grey').style('border-radius', '4px').style('z-index', 10).style('position', 'absolute').style('left', "".concat(d3.event.pageX, "px")).style('top', "".concat(d3.event.pageY, "px")).html("<table style=\"margin: 5px; width: 100%; height: 100%;\">\n        <tbody>\n            <tr>\n                <td><div style=\"max-height: 5px; max-width: 3px; padding: 5px; background-color: ".concat(color(i), ";}\"></div></td>\n                <td style=\"font-weight: 600\">").concat(d.key, "</td>\n                <td>").concat(d.value, "</td>\n            </tr>\n        </tbody>\n    </table>"));
};

var mouseleave = function mouseleave() {
  d3.select('#tooltip').remove();
}; // filters go in defs element


var defs = svg.append("defs"); // create filter with id #drop-shadow
// height=130% so that the shadow is not clipped

var filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%"); // SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur

filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3).attr("result", "blur"); // translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur

filter.append("feOffset").attr("in", "blur").attr("dx", 3).attr("dy", 3).attr("result", "offsetBlur"); // overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!

var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode").attr("in", "offsetBlur");
feMerge.append("feMergeNode").attr("in", "SourceGraphic");
var g = svg.selectAll("polygon").data(data).enter().append('g').lower() // .style("filter", "url(#drop-shadow)")
.on("mouseover", mouseover).on("mousemove", mousemove).on("mouseleave", mouseleave);
g.append("polygon").attr("points", function (item) {
  return item.dimension.map(function (d) {
    return [x(d.x), y(d.y)].join(",");
  }).join(" ");
}).attr('fill', function (d, i) {
  return color(i);
});
g.append('ellipse').attr("cx", function (d) {
  return d.innerEllipse.cx;
}).attr("cy", function (d) {
  return d.innerEllipse.cy;
}).attr("rx", function (d) {
  return d.innerEllipse.rx;
}).attr("ry", function (d) {
  return d.innerEllipse.ry;
}).attr('fill', function (d, i) {
  return innerColor(i);
});
g.append('ellipse').attr("cx", function (d) {
  return d.outerEllipse.cx;
}).attr("cy", function (d) {
  return d.outerEllipse.cy;
}).attr("rx", function (d) {
  return d.outerEllipse.rx;
}).attr("ry", function (d) {
  return d.outerEllipse.ry;
}).attr('fill', function (d, i) {
  return color(i);
});
g.append('text').text(function (d) {
  return d.key;
}).style('dominant-baseline', 'text-before-edge').style('text-anchor', 'middle').style('font-weight', 600).style('fill', '#ffffff').attr('x', function (d) {
  return d.text.left;
}).attr('y', function (d) {
  return d.text.top - 10;
});
g.append('text').text(function (d, i) {
  return "".concat(d.value).concat(i !== 0 ? "(".concat(d.percentage, "%)") : '');
}).style('dominant-baseline', 'text-before-edge').style('text-anchor', 'middle').style('font-weight', 600).style('fill', '#ffffff').attr('x', function (d) {
  return d.text.left;
}).attr('y', function (d) {
  return d.text.top + 5;
});