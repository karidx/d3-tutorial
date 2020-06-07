const url = 'http://localhost:3050/api/brands/price';

const viz = async () => {
  const data = await d3.json(url);

  const w = 900;
  const h = 600;
  const svg = d3.select('#d3Container').append('svg')
    .attr('width', w)
    .attr('height', h);

  const [x0, y0, w0, h0] = [50, 20, 450, 300];
  const yDomain = [10000, 220000];
  const yScale = d3.scaleLinear().domain(yDomain).range([h0, 0]);
  const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d3.format('$.2s'));
  svg.append('g').attr('transform', `translate(${x0}, ${y0})`).call(yAxis);

  let c = Object.keys(data);
  const xScale = d3.scaleBand().domain(c).range([0, w0]);
  const xAxis = d3.axisBottom(xScale);
  svg.append('g').attr('transform', `translate(${x0}, ${h0+y0})`).call(xAxis);

  let m = []
  for (brand in data) {
    let lst = []
    data[brand].forEach(p => lst.push(+p));
    // From docs: to compute quartiles, values must be an array of four elements such as [0, 1, 2, 3].
    const quartileScale = d3.scaleQuantile().domain(lst).range([0, 1, 2, 3]);
    const [q1, q2, q3] = quartileScale.quantiles();
    const [min, max] = d3.extent(lst);
    const range = [min, q1, q2, q3, max];
    m.push({'brand': brand, 'range': range});
  }
  console.log(m);
  
  svg.append('g').attr('class', 'median').selectAll('circle')
    .data(m)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', (d, i) => xScale(d.brand) + xScale.bandwidth()/2)
    .attr('cy', d => yScale(d.range[2]))
    .style('fill', 'darkgray');

  d3.select('g.median').attr('transform', `translate(${x0}, ${y0})`);
}

viz()