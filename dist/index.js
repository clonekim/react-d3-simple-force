import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function ForceGraph(_ref) {
  var width = _ref.width,
      height = _ref.height,
      _ref$nodes = _ref.nodes,
      nodes = _ref$nodes === void 0 ? [] : _ref$nodes,
      _ref$edges = _ref.edges,
      edges = _ref$edges === void 0 ? [] : _ref$edges,
      _ref$distValue = _ref.distValue,
      distValue = _ref$distValue === void 0 ? 100 : _ref$distValue,
      _ref$chargeValue = _ref.chargeValue,
      chargeValue = _ref$chargeValue === void 0 ? -100 : _ref$chargeValue,
      _ref$colors = _ref.colors,
      colors = _ref$colors === void 0 ? [] : _ref$colors,
      style = _ref.style,
      nodeOnClick = _ref.nodeOnClick,
      lineOnClick = _ref.lineOnClick,
      displayNodeName = _ref.displayNodeName,
      graphModDisplay = _ref.graphModDisplay,
      graphController = _ref.graphController;
  console.log('Graph');

  var _useState = useState(distValue),
      _useState2 = _slicedToArray(_useState, 2),
      dist = _useState2[0],
      setDist = _useState2[1];

  var _useState3 = useState(chargeValue),
      _useState4 = _slicedToArray(_useState3, 2),
      charge = _useState4[0],
      setCharge = _useState4[1];

  var svgRef = useRef();
  var gRef = useRef();
  var nodeHash = {};
  nodes.forEach(function (node) {
    nodeHash[node.id] = node;
  });
  var links = edges.map(function (edge) {
    return {
      weight: 3,
      objectData: edge.objectData,
      source: nodeHash[edge.source],
      target: nodeHash[edge.target]
    };
  });
  var roleScale = d3.scaleOrdinal().domain(colors.map(function (i) {
    return i.label;
  })).range(colors.map(function (i) {
    return i.color;
  }));

  var addZoomCapability = function addZoomCapability(svg, g) {
    var zoom = d3.zoom().scaleExtent([1 / 4, 4]).on('zoom', function (e) {
      return g.attr('transform', e.transform);
    });
    svg.call(zoom);
  };

  var tick = function tick(g) {
    g.selectAll('line.link').attr('x1', function (d) {
      return d.source.x;
    }).attr('x2', function (d) {
      return d.target.x;
    }).attr('y1', function (d) {
      return d.source.y;
    }).attr('y2', function (d) {
      return d.target.y;
    });
    g.selectAll('g.node').attr('transform', function (d) {
      return "translate(".concat(d.x, ",").concat(d.y, ")");
    });
  };

  var drawLines = function drawLines(g) {
    g.selectAll('line').data(links, function (d) {
      return "".concat(d.source.id, "-").concat(d.target.id);
    }).enter().append('line').on('click', lineOnClick).attr('class', 'link').style('opacity', 0.5).style('stroke-width', function (d) {
      return d.weight;
    });
  };

  var drawNodes = function drawNodes(g) {
    var nodeEnter = g.selectAll('node').data(nodes, function (d) {
      return d.id;
    }).enter().append('g').attr('class', 'node');
    nodeEnter.append('circle').on('click', nodeOnClick).attr('r', function (d) {
      return 15;
    }).style('fill', function (d) {
      return roleScale(d.color);
    });
    nodeEnter.append('text').on('click', function (e) {
      return console.log(e);
    }).style('text-anchor', 'middle').attr('y', function (e) {
      return 29;
    }).text(displayNodeName);
  };

  var drawMakers = function drawMakers(g) {
    g.selectAll('line').attr('marker-end', 'url(#triangle)').attr('fill', 'none');
  };

  var startSimulation = function startSimulation() {
    var g = d3.select(gRef.current);
    var simulation = d3.forceSimulation().force('charge', d3.forceManyBody().strength(charge)).force('center', d3.forceCenter(width / 2, height / 2)).force('link', d3.forceLink().links(links).distance(dist)).nodes(nodes).on('tick', function () {
      return tick(g);
    });
    return simulation;
  };

  useEffect(function () {
    console.log('D3 start...');
    var svg = d3.select(svgRef.current);
    var g = d3.select(gRef.current);
    startSimulation();
    drawLines(g);
    drawNodes(g);
    drawMakers(g);
    addZoomCapability(svg, g);
    return function () {};
  }, [nodes, edges]);
  useEffect(function () {
    startSimulation();
  }, [charge, dist]);
  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread2({
      width: width,
      height: height
    }, style)
  }, graphModDisplay && graphModDisplay({
    colors: colors
  }), nodes.length > 0 && edges.length > 0 && /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("g", {
    ref: gRef
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("marker", {
    id: "triangle",
    refX: 26,
    refY: 6,
    markerUnits: "userSpaceOnUse",
    markerWidth: 12,
    markerHeight: 28,
    orient: "auto"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 12 6 0 12 3 6"
  })))), graphController && graphController({
    charge: charge,
    setCharge: setCharge,
    dist: dist,
    setDist: setDist
  }));
}

var ForceGraph$1 = /*#__PURE__*/React.memo(ForceGraph);

export { ForceGraph$1 as ForceGraph };
