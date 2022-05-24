import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ForceGraph({
  width,
  height,
  nodes = [],
  edges = [],
  distValue = 100,
  chargeValue = -100,
  colors = [],
  style,
  nodeOnClick,
  lineOnClick,
  displayNodeName,
  graphModDisplay,
  graphController,
}) {
  console.log('Graph');
  const [dist, setDist] = useState(distValue);
  const [charge, setCharge] = useState(chargeValue);

  const svgRef = useRef();
  const gRef = useRef();

  const nodeHash = {};
  nodes.forEach(node => {
    nodeHash[node.id] = node;
  });

  const links = edges.map(edge => ({
    weight: 3,
    objectData: edge.objectData,
    source: nodeHash[edge.source],
    target: nodeHash[edge.target],
  }));

  const roleScale = d3
    .scaleOrdinal()
    .domain(colors.map(i => i.label))
    .range(colors.map(i => i.color));

  const addZoomCapability = (svg, g) => {
    const zoom = d3
      .zoom()
      .scaleExtent([1 / 4, 4])
      .on('zoom', e => g.attr('transform', e.transform));

    svg.call(zoom);
  };

  const tick = g => {
    g.selectAll('line.link')
      .attr('x1', d => d.source.x)
      .attr('x2', d => d.target.x)
      .attr('y1', d => d.source.y)
      .attr('y2', d => d.target.y);

    g.selectAll('g.node').attr('transform', d => `translate(${d.x},${d.y})`);
  };

  const drawLines = g => {
    g.selectAll('line')
      .data(links, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append('line')
      .on('click', lineOnClick)
      .attr('class', 'link')
      .style('opacity', 0.5)
      .style('stroke-width', d => d.weight);
  };

  const drawNodes = g => {
    const nodeEnter = g
      .selectAll('node')
      .data(nodes, d => d.id)
      .enter()
      .append('g')
      .attr('class', 'node');

    nodeEnter
      .append('circle')
      .on('click', nodeOnClick)
      .attr('r', d => 15)
      .style('fill', d => roleScale(d.color));

    nodeEnter
      .append('text')
      .on('click', e => console.log(e))
      .style('text-anchor', 'middle')
      .attr('y', e => {
        return 29;
      })
      .text(displayNodeName);
  };

  const drawMakers = g => {
    g.selectAll('line')
      .attr('marker-end', 'url(#triangle)')
      .attr('fill', 'none');
  };

  const startSimulation = () => {
    const g = d3.select(gRef.current);

    const simulation = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(charge))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links).distance(dist))
      .nodes(nodes)
      .on('tick', () => tick(g));

    return simulation;
  };

  useEffect(() => {
    console.log('D3 start...');
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    startSimulation();
    drawLines(g);
    drawNodes(g);
    drawMakers(g);
    addZoomCapability(svg, g);

    return () => {};
  }, [nodes, edges]);

  useEffect(() => {
    startSimulation();
  }, [charge, dist]);

  return (
    <div style={{ width, height, ...style }}>
      {graphModDisplay &&
        graphModDisplay({
          colors,
        })}
      {nodes.length > 0 && edges.length > 0 && (
        <svg ref={svgRef} width='100%' height='100%'>
          <g ref={gRef} />
          <defs>
            <marker
              id='triangle'
              refX={26}
              refY={6}
              markerUnits='userSpaceOnUse'
              markerWidth={12}
              markerHeight={28}
              orient='auto'>
              <path d='M 0 0 12 6 0 12 3 6' />
            </marker>
          </defs>
        </svg>
      )}

      {graphController &&
        graphController({
          charge,
          setCharge,
          dist,
          setDist,
        })}
    </div>
  );
}

export default React.memo(ForceGraph);
