const data = embeddedData;

const entities = data.entities;
const relationships = data.relationships;

const elements = [];

// Y positions
const yTop = 0;
const yMiddle = 200;
const yBottom = 400;

// X positions (equal spacing)
const nodePositions = {
  olympia_provisions:        { x: -500, y: yTop },
  farmers_market_customers:  { x: -200, y: yTop },
  wholesale_customers:       { x: 200,  y: yTop },
  ffcsa_members:             { x: 500,  y: yTop },
  farmers_market:            { x: -300, y: yMiddle },
  wholesale:                 { x: 0,    y: yMiddle },
  ffcsa:                     { x: 300,  y: yMiddle },
  pork:               { x: -500, y: yBottom },
  hyland_processing:  { x: -300, y: yBottom },
  layers:             { x: -100, y: yBottom },
  roasters:           { x: 100,  y: yBottom },
  grazers:            { x: 300,  y: yBottom },
  creamy_cow:         { x: 500,  y: yBottom },
  garden:             { x: 700,  y: yBottom }
};

// Add nodes
for (const [id, position] of Object.entries(nodePositions)) {
  elements.push({
    data: {
      id,
      label: id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    },
    position
  });
}

// Add unplaced nodes
const placed = new Set(Object.keys(nodePositions));
for (const entity of entities) {
  if (!placed.has(entity)) {
    elements.push({
      data: {
        id: entity,
        label: entity.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      }
    });
  }
}

// Add edges
relationships.forEach(rel => {
  const id = `${rel.from}_${rel.to}`;
  elements.push({
    data: {
      id,
      source: rel.from,
      target: rel.to,
      label: rel.percentage ? `${rel.percentage}%` : '',
      note: rel.note || ''
    }
  });
});

// Init Cytoscape
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements,

  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#2E86AB',
        'label': 'data(label)',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '20px',
        'shape': 'roundrectangle',
        'text-wrap': 'wrap',
        'text-max-width': '140px',
        'padding': '15px',
        'width': '140px',
        'height': '60px'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#888',
        'target-arrow-color': '#888',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 1.5,
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '14px',
        'text-background-color': '#fff',
        'text-background-opacity': 1,
        'text-background-padding': '2px',
        'text-margin-y': -10,
        'text-rotation': 'autorotate'
      }
    },
    {
      selector: 'edge:hover',
      style: {
        'line-color': '#ff8800',
        'target-arrow-color': '#ff8800'
      }
    }
  ],

  layout: {
    name: 'preset'
  },

  userZoomingEnabled: true,
  userPanningEnabled: true,
  wheelSensitivity: 0.2
});

// Tooltip for edge note
cy.ready(() => {
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.padding = '6px 10px';
  tooltip.style.background = '#fff';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.borderRadius = '5px';
  tooltip.style.fontSize = '14px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.display = 'none';
  tooltip.style.zIndex = 9999;
  document.body.appendChild(tooltip);

  cy.on('mouseover', 'edge', e => {
    const note = e.target.data('note');
    if (note) {
      tooltip.textContent = note;
      tooltip.style.display = 'block';
    }
  });

  cy.on('mouseout', 'edge', () => {
    tooltip.style.display = 'none';
  });

  cy.on('mousemove', e => {
    tooltip.style.left = `${e.originalEvent.pageX + 10}px`;
    tooltip.style.top = `${e.originalEvent.pageY + 10}px`;
  });

  const fitGraph = () => cy.fit(null, 80);
  fitGraph();
  window.addEventListener('resize', fitGraph);
});

