import { GraphNode } from './graph';
import { findAllCycles } from './cycleDetection';
import fs from 'node:fs';

export function generateDOTCode(graph: GraphNode[]) {
    let output = 'digraph {\n';
    const cycles = findAllCycles(graph);
    console.log(`${cycles.length} cycles found.`);

    const visitedEdges = new Map<number, Set<number>>();
    for (const node of graph) {
        visitedEdges.set(node.id, new Set());
    }
    const visitedNodes = new Set<number>();

    for (const cycle of cycles) {
        for (let i = 0; i < cycle.length; i++) {
            const currNode = cycle[i];
            // Define the node, make it red
            if (!visitedNodes.has(currNode.id)) {
                output += `    ${currNode.name} [color = red]\n`;
                visitedNodes.add(currNode.id);
            }

            const nextNode = cycle[(i + 1) % cycle.length];

            // Ensures edge was not already created by a previous cycle
            const currNodeOutgoingEdges = visitedEdges.get(currNode.id)!;
            if (!currNodeOutgoingEdges.has(nextNode.id)) {
                output += `    ${currNode.name} -> { ${nextNode.name} } [color = red]\n`;
                currNodeOutgoingEdges.add(nextNode.id);
            }
        }
    }

    for (const node of graph) {
        const edgesAlreadyCreated = visitedEdges.get(node.id)!;
        const edgesNotYetCreated = node.dependencies.filter(dep => !edgesAlreadyCreated.has(dep.id));

        output += `    ${node.name} -> { `;
        for (const head of edgesNotYetCreated) {
            output += `${head.name} `;
        }
        output += '}\n'
    }

    output += '}'

    fs.writeFileSync('output.dot', output);
}