import { basename } from 'node:path';
import fs from 'node:fs';
import * as parse from './parsingUtils';

export interface GraphNode {
    num: number | null,     // Used by cycleDetection.ts to number nodes during DFS
    name: string,
    importPaths: string[],  // Paths to files that the store this node represents depends on
    dependencies: GraphNode[],
}

export function create(path: string): GraphNode {
    return {
        num: null, // begin unnumbered
        name: basename(path).replace('.ts', '').replace('.vue', ''),
        importPaths: parse.getAllImportedStores(fs.readFileSync(path, 'utf-8')),
        dependencies: [],
    }
}

export function addEdge(user: GraphNode, dependency: GraphNode) {
    user.dependencies.push(dependency);
}