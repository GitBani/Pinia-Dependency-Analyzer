import { basename } from 'node:path';
import fs from 'node:fs';
import * as parse from './parsingUtils';

export interface graphNode {
    name: string,
    importPaths: string[],  // Paths to files that the store this node represents depends on
    dependencies: graphNode[],
}

export function create(path: string): graphNode {
    return {
        name: basename(path).replace('.ts', '').replace('.vue', ''),
        importPaths: parse.getAllImportedStores(fs.readFileSync(path, 'utf-8')),
        dependencies: [],
    }
}

export function addEdge(user: graphNode, dependency: graphNode) {
    user.dependencies.push(dependency);
}