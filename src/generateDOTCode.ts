import { graphNode } from "./graph";
import fs from 'node:fs';

export function generateDOTCode(graph: graphNode) {
    let output = 'digraph {\n'
    const stack = [graph];
    const visited = new Set();

    while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;

        visited.add(current);

        output += `    ${current.name} -> { `;
        for (const dep of current.dependencies) {
            output += `${dep.name} `;
            stack.push(dep);
        }
        for (const user of current.users) {
            stack.push(user);
        }
        output += '}\n'
    }

    output += '}'
    
    fs.writeFileSync('output.dot', output);
}