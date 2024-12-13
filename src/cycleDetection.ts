import * as g from './graph';

// Johnson's Algorithm
export function markAllCycles(graph: g.GraphNode[]) {
    const cycles: g.GraphNode[][] = [];
    const blockedMap = new Map<number, Set<number>>();
    const blockedSet = new Set<number>();
    const stack: g.GraphNode[] = [];
    let counter = 0;

    function unblock(nodeID: number) {
        blockedSet.delete(nodeID);
        const blockedNeighborIDs = blockedMap.get(nodeID)!;

        for (const blockedNeighborID of blockedNeighborIDs) {
            blockedNeighborIDs.delete(blockedNeighborID);

            if (blockedSet.has(blockedNeighborID)) {
                unblock(blockedNeighborID);
            }
        }
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
