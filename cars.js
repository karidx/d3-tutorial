const url = 'http://localhost:3050/api/brands/price';

const viz = async () => {
  const data = await d3.json(url);
  console.log(data);
  d3.select('#d3Container').append('svg');

  for (brand in data) {
    let lst = []
    data[brand].forEach(p => lst.push(+p));
    // From docs: to compute quartiles, values must be an array of four elements such as [0, 1, 2, 3].
    const quartileScale = d3.scaleQuantile().domain(lst).range([0, 1, 2, 3]);
    const [q1, q2, q3] = quartileScale.quantiles();
    const [min, max] = d3.extent(lst);
    const range = [min, q1, q2, q3, max];

    console.log(brand);
    console.log(range);
  }
  
}

viz()