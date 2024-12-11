import { log } from 'node:console';
import * as g from './graph';

// Johnson's Algorithm
export function markAllCycles(graph: g.GraphNode[]) {
}

// Tarjan's algorithm
export function getAllSCC(graph: g.GraphNode[]): g.GraphNode[][] {
    const sccs: g.GraphNode[][] = [];
    const stack: g.GraphNode[] = [];
    const onStack = new Set<number>();
    const lowLinks = new Map<number, number>(); // maps node number to low-link value
    let counter = 0;

    for (const node of graph) {
        if (node.num === null) {
            getAllSCCCore(node);
        }
    }

    function getAllSCCCore(at: g.GraphNode) {
        at.num = counter++;
        stack.push(at);
        log("Start. Node is", at.name, stack)
        onStack.add(at.num);
        lowLinks.set(at.num, at.num); // Initially set to itself

        for (const neighbor of at.dependencies) {
            // Neighbor is unvisited
            if (neighbor.num === null) {
                getAllSCCCore(neighbor);
                lowLinks.set(
                    at.num, 
                    Math.min(
                        lowLinks.get(at.num)!, 
                        lowLinks.get(neighbor.num!)!
                    )
                );
            }
            // Neighbor has been visited
            else if (onStack.has(neighbor.num)) {
                lowLinks.set(
                    at.num, 
                    Math.min(
                        lowLinks.get(at.num)!, 
                        lowLinks.get(neighbor.num!)!
                    )
                );
            }
        }
        log("End. Node is", at.name, "lowlink is", lowLinks.get(at.num))

        // If after traversing neighbors the node's low-link value is it's number, it is the head of a SCC
        if (lowLinks.get(at.num) === at.num) {
                log("scc", stack)
                const scc = [];
                let stackTop = stack.length - 1;
                while (stackTop >= 0 && stack[stackTop].num! >= at.num) {
                    const node = stack.pop()!;
                    onStack.delete(node.num!);
                    scc.push(node);
                    stackTop--;
                }
                sccs.push(scc);
        }
    }

    return sccs;
}
