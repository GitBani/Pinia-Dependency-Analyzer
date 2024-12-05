import { graphNode } from './graph';
import fs from 'node:fs';

export function generateDOTCode(nodes: graphNode[]) {
    let output = 'digraph {\n'
    const visited = new Set();

    while (nodes.length > 0) {
        const current = nodes.pop()!;
        if (visited.has(current)) continue;

        visited.add(current);

        output += `    ${current.name} -> { `;
        for (const dep of current.dependencies) {
            output += `${dep.name} `;
        }
        output += '}\n'
    }

    output += '}'
    
    fs.writeFileSync('output.dot', output);
}