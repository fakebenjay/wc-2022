// var tooltip = d3.select("#groups")
//   .append('div')
//   .style('visibility', 'hidden')
//   .attr('class', 'my-tooltip')
//   .attr('id', 'tooltip')

var thisGroup
var marginBottom = margin.bottom + 15
var marginRight = margin.right + 5
var koHeight = 1.5 * height

var xScale = d3.scaleLinear()
  .range([margin.left, width - marginRight])
  .domain([0, 4])

// Define X axis
var xAxis = d3.axisBottom(xScale)
  .ticks(4)
  .tickFormat((d) => {
    if (d == 0) {
      return '16'
    } else if (d == 1) {
      return 'Quarters'
    } else if (d == 2) {
      return 'Semis'
    } else if (d == 3) {
      return 'Final'
    } else {
      return '🏆'
    }
  })

// Add Y scale

var colorScale = d3.scaleLinear()
  .domain([.45, 0, -.45])
  .range(['green', '#f2f2f2', 'red'])

var yScale = d3.scaleLinear()
  .domain([1, 0])
  .range([0, koHeight - (margin.top + marginBottom)])

// Define Y axis and format tick marks
var yAxis = d3.axisLeft(yScale)
  .ticks(3)
  .tickFormat(d => numeral(d).format('0%'))

var yGrid = d3.axisLeft(yScale)
  .tickSize(-width + marginRight + margin.left, 0, 0)
  .tickFormat("")

var teams = {
  'a': [{
    'country': 'Netherlands',
    'code': 'NED',
    'flag': '🇳🇱',
    'pot': '2',
    'rank': '10',
    'hex': '#EB6920'
  }, {
    'country': 'Senegal',
    'code': 'SEN',
    'flag': '🇸🇳',
    'pot': '3',
    'rank': '20',
    'hex': '#00863D'
  }],
  'b': [{
    'country': 'England',
    'code': 'ENG',
    'flag': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'pot': '1',
    'rank': '5',
    'hex': '#CF081F'
  }, {
    'country': 'United States',
    'code': 'USA',
    'flag': '🇺🇸󠁮󠁧󠁿',
    'pot': '2',
    'rank': '15',
    'hex': '#3C3B6E'
  }],
  'c': [{
    'country': 'Argentina',
    'code': 'ARG',
    'flag': '🇦🇷',
    'pot': '1',
    'rank': '4',
    'hex': '#74ACDF'
  }, {
    'country': 'Poland',
    'code': 'POL',
    'flag': '🇵🇱',
    'pot': '3',
    'rank': '26',
    'hex': '#DD0C39'
  }],
  'd': [{
    'country': 'Australia',
    'code': 'AUS',
    'flag': '🇦🇺',
    'pot': '4',
    'rank': '42',
    'hex': '#FFCD00'
  }, {
    'country': 'France',
    'code': 'FRA',
    'flag': '🇫🇷',
    'pot': '1',
    'rank': '3',
    'hex': '#002153'
  }],
  'e': [{
    'country': 'Japan',
    'code': 'JPN',
    'flag': '🇯🇵',
    'pot': '3',
    'rank': '23',
    'hex': '#020372'
  }, {
    'country': 'Spain',
    'code': 'ESP',
    'flag': '🇪🇸',
    'pot': '1',
    'rank': '7',
    'hex': '#FFB700'
  }],
  'f': [{
    'country': 'Croatia',
    'code': 'CRO',
    'flag': '🇭🇷',
    'pot': '2',
    'rank': '16',
    'hex': '#171796'
  }, {
    'country': 'Morocco',
    'code': 'MAR',
    'flag': '🇲🇦',
    'pot': '3',
    'rank': '24',
    'hex': '#006233'
  }],
  'g': [{
    'country': 'Brazil',
    'code': 'BRA',
    'flag': '🇧🇷',
    'pot': '1',
    'rank': '1',
    'hex': '#FEE000'
  }, {
    'country': 'Cameroon',
    'code': 'CMR',
    'flag': '🇨🇲',
    'pot': '4',
    'rank': '37',
    'hex': '#054C40'
  }, {
    'country': 'Serbia',
    'code': 'SRB',
    'flag': '🇷🇸',
    'pot': '3',
    'rank': '25',
    'hex': '#374C8A'
  }, {
    'country': 'Switzerland',
    'code': 'SUI',
    'flag': '🇨🇭',
    'pot': '2',
    'rank': '14',
    'hex': '#FF0000'
  }],
  'h': [{
    'country': 'Ghana',
    'code': 'GHA',
    'flag': '🇬🇭',
    'pot': '4',
    'rank': '61',
    'hex': '#F2D900'
  }, {
    'country': 'Portugal',
    'code': 'POR',
    'flag': '🇵🇹',
    'pot': '1',
    'rank': '8',
    'hex': '#006600'
  }, {
    'country': 'South Korea',
    'code': 'KOR',
    'flag': '🇰🇷',
    'pot': '3',
    'rank': '29',
    'hex': '#C00C2F'
  }, {
    'country': 'Uruguay',
    'code': 'URU',
    'flag': '🇺🇾',
    'pot': '2',
    'rank': '13',
    'hex': '#71A5D5'
  }]
}

var fates = ['adv', '1', '2', '3', 'win']

d3.csv("data-ko.csv")
  .then(function(csv) {


    //Create svg element
    var svg = d3.select(`#groups .chart .group-ko`)
      .append("svg")
      .attr('viewBox', `0 0 ${width} ${koHeight}`)
      .attr('preserveAspectRatio', `xMidYMid meet`)
    // Render Y grid
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "grid")
      .style('color', '#777777')
      .style('opacity', '0.3')
      .call(yGrid)

    // Render Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll("text")
      .style('font-size', () => {
        return window.innerWidth > 767 ? '9pt' : '8pt'
      })
      .style('color', 'black')
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "middle")

    // Render Y grid
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "grid")
      .style('color', '#777777')
      .style('opacity', '0.3')
      .call(yGrid)

    //Render X axis
    svg.append("g")
      .attr("transform", `translate(0,${koHeight-marginBottom})`)
      .attr('class', 'x-axis')
      .style('color', 'black')
      .call(xAxis)
      .selectAll(".tick text")
      .style('font-size', '10pt')
      .raise()

    // Render lines g
    var linesG = svg.append("g")
      .attr('class', 'lines')
    Object.keys(teams).forEach(function(t) {

      fates.forEach(function(f) {
        teams[t].forEach(function(g) {
          svg.append('text')
            .data([csv.filter(d => !!d[`${g.code.toLowerCase()}${f.slice(0,1).toUpperCase() + f.slice(1)}`])])
            .text(g.flag)
            .attr('class', `flag ${g.code.toLowerCase()}-${f} fate-${f}`)
            .attr('x', margin.left / 2)
            .attr('y', function(d) {
              console.log(d)
              return yScale(d[0][g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]) + margin.top + (this.getBoundingClientRect().height / 3)
            })
            .lower()

          d3.selectAll('.flag')
            .raise()


          var lineDraw = d3.line()
            .x(function(d) {
              return xScale(d.stage)
            })
            .y(function(d) {
              return yScale(d[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]) + margin.top;
            });

          svg.select('.lines')
            .data([csv.filter(d => !!d[`${g.code.toLowerCase()}${f.slice(0,1).toUpperCase() + f.slice(1)}`])])
            .append("path")
            .attr("class", `line ${g.code.toLowerCase()}-${f} fate-${f}`)
            .attr("d", function(d) {
              return lineDraw(d)
            })
            .style('stroke', g.hex)
            .style('stroke-width', '4')

          svg.select('.lines')
            .data([csv.filter(d => !!d[`${g.code.toLowerCase()}${f.slice(0,1).toUpperCase() + f.slice(1)}`])])
            .append('text')
            .text(function(d) {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              if (d.length == 4 && f === 'win' && datapoint > 0) {
                return g.flag + numeral(datapoint).format('0[.]00%')
              } else if (d.length == 4 && f === 'win' && datapoint == 0) {
                return ''
              } else {
                return numeral(datapoint).format('0[.]00%')
              }
            })
            .style('text-anchor', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 4 && f === 'win' && datapoint > 0 ? 'middle' : 'start'
            })
            .attr('class', `odds ${g.code.toLowerCase()}-${f} fate-${f}`)
            .style('font-size', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 4 && f === 'win' && datapoint > 0 ? '12pt' : '8pt'
            })
            .attr('x', function(d) {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]

              if (d.length === 3) {
                return xScale(d.length - 1.5) + 5
              } else if (d.length == 4 && f === 'win' && datapoint > 0) {
                return xScale(1.5)
              } else {
                return xScale(d.length - 1) + 5
              }
            })
            .attr('y', function(d) {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              var firstpoint = latest[g.code.toLowerCase() + '1']
              var secondpoint = latest[g.code.toLowerCase() + '2']

              if (d.length == 4 && f === 'win' && firstpoint == 1) {
                return yScale(.6)
              } else if (d.length == 4 && f === 'win' && secondpoint == 1) {
                return yScale(.3)
              } else {
                return yScale(d[d.length - 1][g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]) + margin.top + (this.getBoundingClientRect().height / 3)
              }
            })
            .style('fill', g.hex)
            .style('stroke', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 4 && f === 'win' && datapoint > 0 ? 'none' : 'black'
            })
            .style('stroke-width', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 4 && f === 'win' && datapoint > 0 ? 'none' : '.1px'
            })
            .lower()
        })
      })
    })
  })
  .then(function() {
    getRadio()
  })

function getRadio() {
  var val = document.querySelector('input[name=fate]:checked').value
  d3.selectAll('.flag, .line, .odds')
    .style('display', 'none')

  d3.selectAll(`.${val}`)
    .style('display', 'block')
}

getRadio()

d3.selectAll('.buttons-radio')
  .on('click', function() {
    getRadio()
  })