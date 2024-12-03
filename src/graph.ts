import { basename } from "node:path";
import fs from 'node:fs';

export interface graphNode {
    name: string,
    contents: string,
    dependencies: graphNode[],
    users: graphNode[],
}

export function create(path: string): graphNode {
    return {
        name: basename(path).replace('.ts', '').replace('.vue', ''),
        contents: fs.readFileSync(path, 'utf-8'),
        dependencies: [],
        users: [],
    }
}

export function addEdge(user: graphNode, dependency: graphNode) {
    user.dependencies.push(dependency);
    dependency.users.push(user);
}