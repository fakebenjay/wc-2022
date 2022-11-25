function tipTextLine3(values) {
  var date = new Date(values.date)

  var marSpan = `<strong style='background-color:#ed6a5a;color:white;'>&nbsp;Marriott International Inc. (MAR)&nbsp;</strong>&nbsp;${numeral(values.mar).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.marChange)};color:${values.marChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.marChange > 0 ? '+':''}${numeral(values.marChange).format('0[.]0%')})&nbsp;</span><br/>`
  var hltSpan = `<strong style='background-color:#6ba292;color:white;'>&nbsp;Hilton Worldwide Holdings Inc. (HLT)&nbsp;</strong>&nbsp;${numeral(values.hlt).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.hltChange)};color:${values.hltChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.hltChange > 0 ? '+':''}${numeral(values.hltChange).format('0[.]0%')})&nbsp;</span><br/>`
  var hstSpan = `<strong style='background-color:#faa916;color:black;'>&nbsp;Host Hotels & Resorts Inc. (HST)&nbsp;</strong>&nbsp;${numeral(values.hst).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.hstChange)};color:${values.hstChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.hstChange > 0 ? '+':''}${numeral(values.hstChange).format('0[.]0%')})&nbsp;</span><br/>`
  var mgmSpan = `<strong style='background-color:#56a9de;color:white;'>&nbsp;MGM Resorts International (MGM)&nbsp;</strong>&nbsp;${numeral(values.mgm).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.mgmChange)};color:${values.mgmChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.mgmChange > 0 ? '+':''}${numeral(values.mgmChange).format('0[.]0%')})&nbsp;</span><br/>`
  var lvsSpan = `<strong style='background-color:#654f6f;color:white;'>&nbsp;Las Vegas Sands Corp. (LVS)&nbsp;</strong>&nbsp;${numeral(values.lvs).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.lvsChange)};color:${values.lvsChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.lvsChange > 0 ? '+':''}${numeral(values.lvsChange).format('0[.]0%')})&nbsp;</span><br/>`

  var spans = [marSpan, hltSpan, hstSpan, mgmSpan, lvsSpan]
  var spansText = spans.sort((a, b) => {
    return parseFloat(a.split('&nbsp;(')[1].split('%)')[0]) < parseFloat(b.split('&nbsp;(')[1].split('%)')[0])
  }).join('')

  return `<span class='quit'>x</span><div class="tooltip-container">
  <div><h2 style="font-size:14pt;text-align:center;margin-bottom:10px;">${date.toLocaleDateString("en-US", dateOptions).replaceAll('January', 'Jan.').replaceAll('February', 'Feb.')}</h2>
  <div style="text-align:center;font-size:12pt;">
  <strong style='background-color:#132a43;color:white;'>&nbsp;S&P 500 Index (SPX)&nbsp;</strong><br/>&nbsp;${numeral(values.spx).format('0,0[.]00')} <span style="background-color:${colorScale(values.spxChange)};color:${values.spxChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.spxChange > 0 ? '+':''}${numeral(values.spxChange).format('0[.]0%')})&nbsp;</span></div><br/>
  <div style="text-align:center;font-size:8.5pt;">
  ${spansText}
  </div>
  </div>`
}

var bisectDate2 = d3.bisector(function(d) {
  return xScale2(new Date(d.date)) - marginLeft2;
}).left

var bisectDate3 = d3.bisector(function(d) {
  return xScale3(new Date(d.date)) - marginLeft3;
}).left

function mouseoverLine(data, index) {
  var rightMargin = index == 2 ? marginRight2 : margin.right
  var leftMargin = index == 2 ? marginLeft2 : marginLeft3

  var x0 = d3.mouse(event.target)[0],
    i = index == 2 ? bisectDate2(data, x0, 1) : bisectDate3(data, x0, 1)

  var d0 = data[i - 1] !== 'dummy' ? data[i - 1] : data[i],
    d1 = i < data.length ? data[i] : data[i - 1]

  if (index == 2) {
    var d = (x0 + leftMargin) - xScale2(new Date(d0.date)) > xScale2(new Date(d1.date)) - (x0 + leftMargin) ? d1 : d0;
  } else if (index == 3) {
    var d = (x0 + leftMargin) - xScale3(new Date(d0.date)) > xScale3(new Date(d1.date)) - (x0 + leftMargin) ? d1 : d0;
  }

  var html = index == 2 ? tipTextLine2(d) : tipTextLine3(d)

  d3.selectAll(`#chart-${index} .dot`)
    .attr('r', 0)
    .lower()

  d3.selectAll(`#chart-${index} .lines-${i}`)
    .raise()

  d3.selectAll(`#chart-${index} .dot.date-${new Date(d.date).toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`)
    .attr('r', document.querySelector('.d3-container').offsetWidth / 90 + 'px')
    .raise()

  dotsG3.raise()

  d3.select(`#tooltip-${index}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(index))
    .style('left', leftTT(index))

  var changeArr = [{
    'symbol': 'mar',
    'rate': parseFloat(d.marChange)
  }, {
    'symbol': 'hlt',
    'rate': parseFloat(d.hltChange)
  }, {
    'symbol': 'hst',
    'rate': parseFloat(d.hstChange)
  }, {
    'symbol': 'mgm',
    'rate': parseFloat(d.mgmChange)
  }, {
    'symbol': 'lvs',
    'rate': parseFloat(d.lvsChange)
  }, {
    'symbol': 'spx',
    'rate': parseFloat(d.spxChange)
  }]

  changeArr.sort((a, b) => {
    return a.rate > b.rate
  })

  changeArr.forEach((d) => {
    d3.selectAll(`.dot.${d.symbol}`).raise()
  })

  d3.selectAll(`#tooltip-${index} .quit`)
    .on('click', () => {
      d3.select(`#tooltip-${index}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);

      d3.selectAll(`#chart-${index} .lines-${i}`)
        .raise()

      d3.selectAll(`#chart-${index} .dot`)
        .lower()
    })
}

function mouseover(d, i) {
  var html = tooltipText(d)

  d3.select(`#tooltip-${i}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', () => {
      return topTT(i)
    })
    .style('left', () => {
      return leftTT(i)
    })

  d3.selectAll('text')
    .raise()

  d3.select(`#tooltip-${i} .quit`)
    .on('click', () => {
      d3.select(`#tooltip-${i}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mouseout(i) {
  if (window.innerWidth > 767) {
    d3.select(`#tooltip-${i}`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);

    d3.selectAll('.' + event.target.classList[0])
      .style('stroke-width', '0.5')

    d3.selectAll(`#chart-${i} .lines-${i}`)
      .raise()

    d3.selectAll(`#chart-${i} .line`)
      .raise()

    d3.selectAll(`#chart-${i} .dot`)
      .lower()
  }
}

function topTT(i) {
  var offsetParent = document.querySelector(`#chart-${i} .chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`#tooltip-${i}`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    // if (ch + cy >= windowHeight) {
    //   return cy - (ch / 2) + "px"
    // } else {
    return cy - 28 + "px"
    // }
  }
}

function leftTT(i) {
  var offsetParent = document.querySelector(`#chart-${i} .chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 10

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`#tooltip-${i}`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`#chart-${i} .chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`#tooltip-${i}`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`#tooltip-${i}`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}