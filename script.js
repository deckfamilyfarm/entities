	const data = embeddedData;

    const entities = data.entities;
    const relationships = data.relationships;

    const elements = [];

    const positions = {
      // Tiered manual layout (production → processing → sales)
      production: ["hyland_processing", "layers", "poultry", "grazers", "pork", "creamy_cow", "garden"],
      processing: ["wholesale"],
      sales: ["farmers_market", "ffcsa"]
    };

    // Y-levels for layout
    const yLevels = {
      production: 400,
      processing: 250,
      sales: 100
    };

    let xOffset = 0;
    const step = 150;

    for (const [tier, nodes] of Object.entries(positions)) {
      let y = yLevels[tier];
      xOffset = 0;
      for (const node of nodes) {
        elements.push({
          data: { id: node, label: node.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
          position: { x: xOffset, y: y }
        });
        xOffset += step;
      }
    }

    // Handle any extra entities not in layout
    const placed = new Set(Object.values(positions).flat());
    for (const entity of entities) {
      if (!placed.has(entity)) {
        elements.push({
          data: { id: entity, label: entity.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) }
        });
      }
    }

    // Edges
    relationships.forEach(rel => {
      elements.push({
        data: {
          id: `${rel.from}_${rel.to}`,
          source: rel.from,
          target: rel.to
        }
      });
    });

    cytoscape({
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
            'font-size': 12,
            'shape': 'roundrectangle',
            'width': 'label',
            'padding': '10px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#aaa',
            'target-arrow-color': '#aaa',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'preset' // Use the manual positioning
      }
    });

