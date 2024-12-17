import * as g from './graph';

// Johnson's Algorithm
export function markAllCycles(graph: g.GraphNode[]): g.GraphNode[][] {
    const cycles: g.GraphNode[][] = [];
    const blockedMap = new Map<number, Set<number>>();
    const blockedSet = new Set<number>();
    const stack: g.GraphNode[] = [];
    let startIndex = 0;

    while (startIndex < graph.length) {
        const subgraph = createSubgraphInducedBy(graph.filter(node => node.id >= startIndex));
        const sccs = getAllSCC(subgraph);
        const leastIndexSCC = sccWithLeastIndexNode(sccs);

        if (leastIndexSCC === null) {
            break;
        }

        // Eagerly initialize blockedMap
        for (const node of leastIndexSCC) {
            blockedMap.set(node.id, new Set());
        }

        const leastIndexNode = createSubgraphInducedBy(leastIndexSCC).reduce((prev, curr) => prev.id < curr.id ? prev : curr);
        findCycles(leastIndexNode.id, leastIndexNode);
        startIndex = leastIndexNode.id + 1;
    }

    return cycles;

    function findCycles(startNodeID: number, currentNode: g.GraphNode): boolean {
        let foundCycle = false;
        stack.push(currentNode);
        blockedSet.add(currentNode.id);

        for (const neighbor of currentNode.dependencies) {
            if (neighbor.id === startNodeID) {
                // stack contains the found cycle
                cycles.push([...stack]);
                foundCycle = true;
            }
            else if (!blockedSet.has(neighbor.id)) {
                if (findCycles(startNodeID, neighbor)) {
                    foundCycle = true;
                }
            }
        }

        if (foundCycle) {
            unblock(currentNode.id);
        }
        else {
            for (const neighbor of currentNode.dependencies) {
                // sets of every node is eagerly initialized, can assume it exists
                blockedMap.get(neighbor.id)!.add(currentNode.id);
            }
        }

        stack.pop();
        return foundCycle;
    }

    function unblock(nodeID: number) {
        blockedSet.delete(nodeID);
        const blockedNeighborIDs = blockedMap.get(nodeID)!; // blockedMap is eagerly populated

        for (const blockedNeighborID of [...blockedNeighborIDs]) {
            blockedNeighborIDs.delete(blockedNeighborID);

            if (blockedSet.has(blockedNeighborID)) {
                unblock(blockedNeighborID);
            }
        }
    }
}

// Auxiliary functions for Johnson's algorithm
function createSubgraphInducedBy(nodes: g.GraphNode[]) {
    const nodeIDsSet = new Set();
    nodes.forEach(node => nodeIDsSet.add(node.id));

    const newNodes = new Map<number, g.GraphNode>();
    const subgraph: g.GraphNode[] = [];

    for (const node of nodes) {
        let newNode: g.GraphNode;
        if (newNodes.has(node.id)) {
            newNode = newNodes.get(node.id)!;
        }
        else {
            newNode = {
                id: node.id,
                name: node.name,
                importPaths: node.importPaths,
                dependencies: [],
            }
            newNodes.set(node.id, newNode);
        }

        for (const dep of node.dependencies.filter(dep => nodeIDsSet.has(dep.id))) {
            let newDep: g.GraphNode;
            if (newNodes.has(dep.id)) {
                newDep = newNodes.get(dep.id)!;
            }
            else {
                newDep = {
                    id: dep.id,
                    name: dep.name,
                    importPaths: dep.importPaths,
                    dependencies: [],
                }
                newNodes.set(dep.id, newDep);
            }

            newNode.dependencies.push(newDep);
        }

        subgraph.push(newNode);
    }

    return subgraph;
}

function sccWithLeastIndexNode(sccs: g.GraphNode[][]): g.GraphNode[] | null {
    let leastIndex = Infinity;
    let leastIndexNodeSCC: g.GraphNode[] = [];

    for (const scc of sccs) {
        if (scc.length < 2) {
            // Cannot contain cycle
            continue;
        }

        for (const node of scc) {
            if (node.id < leastIndex) {
                leastIndex = node.id;
                leastIndexNodeSCC = scc;
            }
        }
    }

    if (leastIndex === Infinity) {
        return null;
    }
    else {
        return leastIndexNodeSCC;
    }
}

// Tarjan's algorithm
export function getAllSCC(graph: g.GraphNode[]): g.GraphNode[][] {
    const sccs: g.GraphNode[][] = [];
    const stack: g.GraphNode[] = [];
    const onStack = new Set<number>();
    const lowLinks = new Map<number, number>();    // maps node ID to low-link value
    const nodeNumbers = new Map<number, number>(); // maps node ID to traversal number
    let counter = 0;

    for (const node of graph) {
        if (!nodeNumbers.has(node.id)) {
            getAllSCCCore(node);
        }
    }

    function getAllSCCCore(at: g.GraphNode) {
        nodeNumbers.set(at.id, counter);
        lowLinks.set(at.id, counter++); // Initially set to traversal number
        stack.push(at);
        onStack.add(at.id);

        for (const neighbor of at.dependencies) {
            // Neighbor is unvisited if it hasn't been numbered
            if (!nodeNumbers.has(neighbor.id)) {
                getAllSCCCore(neighbor);
                lowLinks.set(
                    at.id,
                    Math.min(
                        lowLinks.get(at.id)!,
                        lowLinks.get(neighbor.id)!
                    )
                );
            }
            // Neighbor has been visited and is on the stack (part of current SCC)
            else if (onStack.has(neighbor.id)) {
                lowLinks.set(
                    at.id,
                    Math.min(
                        lowLinks.get(at.id)!,
                        lowLinks.get(neighbor.id)!
                    )
                );
            }
        }

        // If after traversing neighbors the node's low-link value is it's number, it is the head of a SCC
        if (lowLinks.get(at.id) === nodeNumbers.get(at.id)) {
            const scc = [];
            let stackTop = stack.length - 1;
            while (
                stackTop >= 0 && nodeNumbers.get(stack[stackTop].id)! >= nodeNumbers.get(at.id)!
            ) {
                const node = stack.pop()!;
                onStack.delete(node.id!);
                scc.push(node);
                stackTop--;
            }
            sccs.push(scc);
        }
    }

    return sccs;
}
