const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 80
const svg = d3.select('#chart')
const color1 = '#87CEFA'
const color2 = '#FEDA32'
const textColor = '#194d30'
const percLenght = 50
const percHeight = 20

//const for dimension
const pieRadius = 30

// when you need to make the slice of the pie chart : 
// describeArc(pieRadius/2, pieRadius/2, pieRadius, 0, (360*percentage))

//need to transform the number in radians to use in a circle
function angleInRadians(angle){
	return ( angle - 90 ) * Math.PI / 180;
}

const describeArc = (x, y, radius, zero, percent) => {
	var start = {
		x: x + (radius * Math.cos(angleInRadians(percent))),
		y: y + (radius * Math.sin(angleInRadians(percent)))
	}
	var end = {
		x: x + (radius * Math.cos(angleInRadians(zero))),
		y: y + (radius * Math.sin(angleInRadians(zero)))
	}

	var largeArcFlag = percent - zero <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}

const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

console.log(data)

//Start
const xScale=d3.scaleLinear()
	.domain([0,data.length])
	.range([padding,width-padding])

const yScale=d3.scaleLinear()
	.domain([0,d3.max(data, d => d.evasion)])
	.range([height-[padding],padding])

//Set the information for the y-axis
const yAxis=d3.axisLeft(yScale)
	.ticks(10)
	.tickSize(-(width-(padding*2)))	

//draw ticks
const yTicks = svg
	.append('g')
	.attr('transform', `translate(${padding}, 0)`)
	.call(yAxis)

// colouring the ticks
svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')	
// hiding the vertical ticks' line
svg
	.selectAll('path.domain')
	.style('stroke-width', 0)

	

const pies = svg
.selectAll('g.stringa')
	.data(data)
	.enter()
	.append('g')
		.attr('class', 'stringa')
		.attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)

//draw circle	
const circles = pies
	.append('circle')
		.attr('cx', padding)
		.attr('cy', 0)
		.attr('r',pieRadius)
		.attr('fill',color1)
		
const arcs = pies
	.append('path')
		.attr('d', d => describeArc((padding), 0, pieRadius, 0, (d.percControlled * 360)))
		.attr('fill', color2)

//text under the pies
const textsType = pies
	.append('text')
	.text(function(d){ return d.companyType})
	.attr("transform", `translate(${padding}, ${1.5 * pieRadius})`)
	.style("text-anchor", "middle")
	.style("font-size", 14)

//amount in percentage
const textsPerc = pies
	.append('text')
	.text(function(d){ return d.percControlled + '%'})
	.attr("transform", `translate(${ pieRadius+ padding}, -20)`)

const test = [
	{value: 1, mean: "evasion"},
	{value: 2,mean: "not evasion"}
]

// select the svg area
var legend = d3
	.select("#legend")
	.append("svg")
	.attr("class","legend")
	.style("font-size","12px")

// Handmade legend
legend.append("circle").attr("cx",padding).attr("cy",30).attr("r", 6).style("fill", color1)
legend.append("circle").attr("cx",padding).attr("cy",60).attr("r", 6).style("fill", color2)
legend.append("text").attr("x", padding + 10).attr("y", 30).text("Not evasion").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", padding + 10).attr("y", 60).text("Evasion").style("font-size", "15px").attr("alignment-baseline","middle")