// var tooltip = d3.select("#groups")
//   .append('div')
//   .style('visibility', 'hidden')
//   .attr('class', 'my-tooltip')
//   .attr('id', 'tooltip')

var thisGroup
var marginBottom = margin.bottom + 15
var marginRight = margin.right + 5
var marginLeft = margin.left + 20
var koHeight = 1.5 * height

var currentStage = 4
var xScale = d3.scaleLinear()
  .range([marginLeft, width - marginRight])
  .domain([0, 8])

// Define X axis
var xAxis = d3.axisBottom(xScale)
  .ticks(8)
  .tickFormat((d) => {
    if (d == 0) {
      return '🎬'
    } else if (d == 1) {
      return 'GS 1'
    } else if (d == 2) {
      return 'GS 2'
    } else if (d == 3) {
      return 'GS 3'
    } else if (d == 4) {
      return '16'
    } else if (d == 5) {
      return 'Quarters'
    } else if (d == 6) {
      return 'Semis'
    } else if (d == 7) {
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
  .tickSize(-width + marginRight + marginLeft, 0, 0)
  .tickFormat("")

var teams = {
  'a': [{
    'country': 'Ecuador',
    'code': 'ECU',
    'flag': '🇪🇨',
    'pot': '4',
    'rank': '46',
    'hex': '#ffdd00',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Netherlands',
    'code': 'NED',
    'flag': '🇳🇱',
    'pot': '2',
    'rank': '10',
    'hex': '#EB6920',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Qatar',
    'code': 'QAT',
    'flag': '🇶🇦',
    'pot': '1',
    'rank': '51',
    'hex': '#8A1538',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Senegal',
    'code': 'SEN',
    'flag': '🇸🇳',
    'pot': '3',
    'rank': '20',
    'hex': '#00863D',
    'stage': '4',
    'status': 'out'
  }],
  'b': [{
    'country': 'England',
    'code': 'ENG',
    'flag': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'pot': '1',
    'rank': '5',
    'hex': '#CF081F',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Iran',
    'code': 'IRN',
    'flag': '🇮🇷',
    'pot': '3',
    'rank': '21',
    'hex': '#239f40',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'United States',
    'code': 'USA',
    'flag': '🇺🇸󠁮󠁧󠁿',
    'pot': '2',
    'rank': '15',
    'hex': '#3C3B6E',
    'stage': '4',
    'status': 'out'
  }, {
    'country': 'Wales',
    'code': 'WAL',
    'flag': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'pot': '4',
    'rank': '18',
    'hex': '#174A3F',
    'stage': '3',
    'status': 'out'
  }],
  'c': [{
    'country': 'Argentina',
    'code': 'ARG',
    'flag': '🇦🇷',
    'pot': '1',
    'rank': '4',
    'hex': '#74ACDF',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Mexico',
    'code': 'MEX',
    'flag': '🇲🇽',
    'pot': '2',
    'rank': '9',
    'hex': '#006845',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Poland',
    'code': 'POL',
    'flag': '🇵🇱',
    'pot': '3',
    'rank': '26',
    'hex': '#DD0C39',
    'stage': '4',
    'status': 'out'
  }, {
    'country': 'Saudi Arabia',
    'code': 'KSA',
    'flag': '🇸🇦',
    'pot': '4',
    'rank': '49',
    'hex': '#29A882',
    'stage': '3',
    'status': 'out'
  }],
  'd': [{
    'country': 'Australia',
    'code': 'AUS',
    'flag': '🇦🇺',
    'pot': '4',
    'rank': '42',
    'hex': '#FFCD00',
    'stage': '4',
    'status': 'out'
  }, {
    'country': 'Denmark',
    'code': 'DEN',
    'flag': '🇩🇰',
    'pot': '2',
    'rank': '11',
    'hex': '#C9072A',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'France',
    'code': 'FRA',
    'flag': '🇫🇷',
    'pot': '1',
    'rank': '3',
    'hex': '#002153',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Tunisia',
    'code': 'TUN',
    'flag': '🇹🇳',
    'pot': '3',
    'rank': '35',
    'hex': '#e70013',
    'stage': '3',
    'status': 'out'
  }],
  'e': [{
    'country': 'Costa Rica',
    'code': 'CRC',
    'flag': '🇨🇷',
    'pot': '4',
    'rank': '31',
    'hex': '#E91115',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Germany',
    'code': 'GER',
    'flag': '🇩🇪',
    'pot': '2',
    'rank': '12',
    'hex': '#000000',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Japan',
    'code': 'JPN',
    'flag': '🇯🇵',
    'pot': '3',
    'rank': '23',
    'hex': '#020372',
    'stage': '4',
    'status': 'out'
  }, {
    'country': 'Spain',
    'code': 'ESP',
    'flag': '🇪🇸',
    'pot': '1',
    'rank': '7',
    'hex': '#FFB700',
    'stage': '4',
    'status': 'in'
  }],
  'f': [{
    'country': 'Belgium',
    'code': 'BEL',
    'flag': '🇧🇪',
    'pot': '1',
    'rank': '2',
    'hex': '#F5D324',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Canada',
    'code': 'CAN',
    'flag': '🇨🇦',
    'pot': '3',
    'rank': '38',
    'hex': '#D62718',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Croatia',
    'code': 'CRO',
    'flag': '🇭🇷',
    'pot': '2',
    'rank': '16',
    'hex': '#171796',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Morocco',
    'code': 'MAR',
    'flag': '🇲🇦',
    'pot': '3',
    'rank': '24',
    'hex': '#006233',
    'stage': '4',
    'status': 'in'
  }],
  'g': [{
    'country': 'Brazil',
    'code': 'BRA',
    'flag': '🇧🇷',
    'pot': '1',
    'rank': '1',
    'hex': '#FEE000',
    'stage': '5',
    'status': 'in'
  }, {
    'country': 'Cameroon',
    'code': 'CMR',
    'flag': '🇨🇲',
    'pot': '4',
    'rank': '37',
    'hex': '#054C40',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Serbia',
    'code': 'SRB',
    'flag': '🇷🇸',
    'pot': '3',
    'rank': '25',
    'hex': '#374C8A',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Switzerland',
    'code': 'SUI',
    'flag': '🇨🇭',
    'pot': '2',
    'rank': '14',
    'hex': '#FF0000',
    'stage': '4',
    'status': 'in'
  }],
  'h': [{
    'country': 'Ghana',
    'code': 'GHA',
    'flag': '🇬🇭',
    'pot': '4',
    'rank': '61',
    'hex': '#F2D900',
    'stage': '3',
    'status': 'out'
  }, {
    'country': 'Portugal',
    'code': 'POR',
    'flag': '🇵🇹',
    'pot': '1',
    'rank': '8',
    'hex': '#006600',
    'stage': '4',
    'status': 'in'
  }, {
    'country': 'South Korea',
    'code': 'KOR',
    'flag': '🇰🇷',
    'pot': '3',
    'rank': '29',
    'hex': '#C00C2F',
    'stage': '4',
    'status': 'out'
  }, {
    'country': 'Uruguay',
    'code': 'URU',
    'flag': '🇺🇾',
    'pot': '2',
    'rank': '13',
    'hex': '#71A5D5',
    'stage': '3',
    'status': 'out'
  }]
}

var fates = ['adv', '1', '2', '3', '4', 'win']

d3.csv("data-ko.csv")
  .then(function(csv) {


    //Create svg element
    var svg = d3.select(`#groups .chart .group-ko`)
      .append("svg")
      .attr('viewBox', `0 0 ${width} ${koHeight}`)
      .attr('preserveAspectRatio', `xMidYMid meet`)
    // Render Y grid
    svg.append("g")
      .attr("transform", `translate(${marginLeft},${margin.top})`)
      .attr("class", "grid")
      .style('color', '#777777')
      .style('opacity', '0.3')
      .call(yGrid)

    // Render Y axis
    svg.append("g")
      .attr("transform", `translate(${marginLeft},${margin.top})`)
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
      .attr("transform", `translate(${marginLeft},${margin.top})`)
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


    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("transform", `translate(${20},${(height-marginBottom)/2}) rotate(-90)`)
      .style('font-size', '9pt')
      .text("Odds of advancing through next stage");


    // Render lines g
    var linesG = svg.append("g")
      .attr('class', 'lines')
    Object.keys(teams).forEach(function(t) {

      fates.forEach(function(f) {
        teams[t].forEach(function(g) {
          svg.append('text')
            .data([csv.filter(d => !!d[`${g.code.toLowerCase()}${f.slice(0,1).toUpperCase() + f.slice(1)}`])])
            .text(g.flag)
            .attr("class", function(d) {
              var out = g.status === 'out' ? ` out out-${g.stage}` : ''
              return `flag ${g.code.toLowerCase()}-${f} fate-${f}${out}`
            })
            .attr('x', marginLeft / 2)
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
            .attr("class", function(d) {
              var out = g.status === 'out' ? ` out out-${g.stage}` : ''
              return `line ${g.code.toLowerCase()}-${f} fate-${f}${out}`
            })
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

              if (d.length == 8 && f === 'win' && datapoint > 0) {
                return g.flag + numeral(datapoint).format('0[.]00%')
              } else if (d.length == 8 && f === 'win' && datapoint == 0) {
                return ''
              } else {
                return numeral(datapoint).format('0[.]00%') + ' ' + g.flag
              }
            })
            .style('text-anchor', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 8 && f === 'win' && datapoint > 0 ? 'middle' : 'start'
            })
            .attr("class", function(d) {
              var out = g.status === 'out' ? ` out out-${g.stage}` : ''
              return `odds ${g.code.toLowerCase()}-${f} fate-${f}${out}`
            })
            .style('font-size', (d) => {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              return d.length == 8 && f === 'win' && datapoint > 0 ? '12pt' : '8pt'
            })
            .attr('x', function(d) {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]

              if (d.length === 3) {
                return xScale(d.length - 2.5) + 5
              } else if (d.length == 8 && f === 'win' && datapoint > 0) {
                return xScale(3.5)
              } else {
                var subtract = d.length > 5 ? 3 : 2
                return xScale(d.length - subtract) + 5
              }
            })
            .attr('y', function(d) {
              var latest = d[d.length - 1]
              var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
              var firstpoint = latest[g.code.toLowerCase() + '1']
              var secondpoint = latest[g.code.toLowerCase() + '2']

              if (d.length == 8 && f === 'win' && firstpoint == 1) {
                return yScale(.6)
              } else if (d.length == 8 && f === 'win' && secondpoint == 1) {
                return yScale(.3)
              } else {
                return yScale(d[d.length - 1][g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]) + margin.top + (this.getBoundingClientRect().height / 3)
              }
            })
            .style('fill', g.hex)
            // .style('stroke', (d) => {
            //   var latest = d[d.length - 1]
            //   var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
            //   return d.length == 8 && f === 'win' && datapoint > 0 ? 'none' : 'black'
            // })
            // .style('stroke-width', (d) => {
            //   var latest = d[d.length - 1]
            //   var datapoint = latest[g.code.toLowerCase() + f.slice(0, 1).toUpperCase() + f.slice(1)]
            //   return d.length == 8 && f === 'win' && datapoint > 0 ? 'none' : '.1px'
            // })
            .lower()



        })
      })
    })
    svg.append('line')
      .attr('x1', xScale(3))
      .attr('x2', xScale(3))
      .attr('y1', yScale(0) + margin.top)
      .attr('y2', yScale(1) + margin.top)
      .style('stroke', 'black')
      .style('stroke-width', '4px')
  })
  .then(function() {
    getRadio()
    d3.selectAll('.odds')
      .raise()
  })

function getRadio() {
  var val = document.querySelector('input[name=fate]:checked').value
  var teamVal = document.querySelector('input[name=teams]:checked').value

  d3.selectAll('.flag, .line, .odds')
    .style('display', 'none')

  d3.selectAll(`.${val}`)
    .style('display', 'block')

  if (teamVal === 'teams-phase') {
    if (val !== 'fate-win' && val !== 'fate-adv') {
      var selectStage = parseInt(val.split('-')[1]) + 1
    } else if (val === 'fate-adv') {
      var selectStage = 3
    }

    for (let i = 0; i < selectStage + 1; i++) {
      d3.selectAll(`.odds.${val}.out-${i}, .line.${val}.out-${i}, .flag.${val}.out-${i}`)
        .style('display', 'none')
    }
  } else if (teamVal === 'teams-active') {
    d3.selectAll(`.odds.out, .line.out, .flag.out`)
      .style('display', 'none')
  }



}

getRadio()

d3.selectAll('.buttons-radio')
  .on('click', function() {
    getRadio()
  })