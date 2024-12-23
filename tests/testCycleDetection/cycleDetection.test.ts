import { describe, test, expect } from 'vitest';
import * as g from '../../src/graph';
import { getAllSCC, findAllCycles } from "../../src/cycleDetection";

// Helper function for identifying SCCs by node numbers
function byNumber(sccs: g.GraphNode[][]): Set<Set<number>> {
    const numberSCCs = new Set<Set<number>>();
    for (const scc of sccs) {
        const numberSCC = new Set<number>;
        for (const node of scc) {
            numberSCC.add(node.id!);
        }
        numberSCCs.add(numberSCC);
    }
    return numberSCCs;
}

describe("Tarjan's Algorithm to find SCCs", () => {
    test("Standard case 1", () => {
        const n0: g.GraphNode = {
            id: 0,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            id: 5,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };
        const n6: g.GraphNode = {
            id: 6,
            name: "N6",
            importPaths: [],
            dependencies: [],
        };
        const n7: g.GraphNode = {
            id: 7,
            name: "N7",
            importPaths: [],
            dependencies: [],
        };

        n0.dependencies.push(n1);
        n1.dependencies.push(n2);
        n2.dependencies.push(n0);
        n3.dependencies.push(n4, n7);
        n4.dependencies.push(n5);
        n5.dependencies.push(n0, n6);
        n6.dependencies.push(n0, n2, n4);
        n7.dependencies.push(n3, n5);

        const graph = [n0, n1, n2, n3, n4, n5, n6, n7];

        const expected = new Set<Set<number>>([
            new Set([0, 1, 2]),
            new Set([4, 5, 6]),
            new Set([3, 7]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);
    });

    test("Standard case 2", () => {
        const n0: g.GraphNode = {
            id: 0,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };

        n0.dependencies.push(n1);
        n1.dependencies.push(n2, n0);
        n2.dependencies.push(n1);

        const graph = [n0, n1, n2];

        const expected = new Set<Set<number>>([
            new Set([0, 1, 2]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);
    });

    test("Standard case 3", () => {
        const n0: g.GraphNode = {
            id: 0,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            id: 5,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };

        n0.dependencies.push(n1, n4, n3);
        n1.dependencies.push(n2);
        n2.dependencies.push(n3, n5);
        n3.dependencies.push(n0, n4);
        n4.dependencies.push(n1, n2);
        n5.dependencies.push(n4);

        const graph = [n0, n1, n2, n3, n4, n5];

        const expected = new Set<Set<number>>([
            new Set([0, 1, 2, 3, 4, 5]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);

    });

    test("Standard case 4", () => {
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            id: 5,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };
        const n6: g.GraphNode = {
            id: 6,
            name: "N6",
            importPaths: [],
            dependencies: [],
        };
        const n7: g.GraphNode = {
            id: 7,
            name: "N7",
            importPaths: [],
            dependencies: [],
        };
        const n8: g.GraphNode = {
            id: 8,
            name: "N8",
            importPaths: [],
            dependencies: [],
        };
        const n9: g.GraphNode = {
            id: 9,
            name: "N9",
            importPaths: [],
            dependencies: [],
        };

        n1.dependencies.push(n2, n5, n8);
        n2.dependencies.push(n9, n7, n3);
        n3.dependencies.push(n1, n6, n2, n4);
        n4.dependencies.push(n5);
        n5.dependencies.push(n2);
        n6.dependencies.push(n4);
        n8.dependencies.push(n9);
        n9.dependencies.push(n8);

        const graph = [n1, n2, n3, n4, n5, n6, n7, n8, n9];

        const expected = new Set<Set<number>>([
            new Set([1, 2, 3, 4, 5, 6]),
            new Set([7]),
            new Set([8, 9]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);

    });

    test("Tree", () => {
        const n0: g.GraphNode = {
            id: 0,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            id: 5,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };

        n0.dependencies.push(n1, n2);
        n2.dependencies.push(n3, n4, n5);

        const graph = [n0, n1, n2, n3, n4, n5];

        const expected = new Set<Set<number>>([
            new Set([0]),
            new Set([1]),
            new Set([2]),
            new Set([3]),
            new Set([4]),
            new Set([5]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);
    });

    test("Complete graph (K_5)", () => {
        const n0: g.GraphNode = {
            id: 0,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };

        n0.dependencies.push(n1, n2, n3, n4);
        n1.dependencies.push(n0, n2, n3, n4);
        n2.dependencies.push(n0, n1, n3, n4);
        n3.dependencies.push(n0, n1, n2, n4);
        n4.dependencies.push(n0, n1, n2, n3);

        const graph = [n0, n1, n2, n3, n4];

        const expected = new Set<Set<number>>([
            new Set([0, 1, 2, 3, 4]),
        ]);

        // Assert
        expect(byNumber(getAllSCC(graph))).toEqual(expected);
    });
});

// Johnson's
describe("Johnson's algorithm to find all cycles in a directed graph", () => {
    test("Standard case 1", () => {
        const n1: g.GraphNode = {
            id: 1,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            id: 2,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            id: 3,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            id: 4,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            id: 5,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };
        const n6: g.GraphNode = {
            id: 6,
            name: "N6",
            importPaths: [],
            dependencies: [],
        };
        const n7: g.GraphNode = {
            id: 7,
            name: "N7",
            importPaths: [],
            dependencies: [],
        };
        const n8: g.GraphNode = {
            id: 8,
            name: "N8",
            importPaths: [],
            dependencies: [],
        };
        const n9: g.GraphNode = {
            id: 9,
            name: "N9",
            importPaths: [],
            dependencies: [],
        };

        n1.dependencies.push(n2, n5, n8);
        n2.dependencies.push(n9, n7, n3);
        n3.dependencies.push(n1, n6, n2, n4);
        n4.dependencies.push(n5);
        n5.dependencies.push(n2);
        n6.dependencies.push(n4);
        n8.dependencies.push(n9);
        n9.dependencies.push(n8);

        const graph = [n1, n2, n3, n4, n5, n6, n7, n8, n9];

        const expected = new Set<Set<number>>([
            new Set([1, 2, 3]),
            new Set([1, 5, 2, 3]),
            new Set([2, 3]),
            new Set([2, 3, 4, 5]),
            new Set([2, 3, 6, 4, 5]),
            new Set([8, 9]),
        ]);

        // Assert
        expect(byNumber(findAllCycles(graph))).toEqual(expected);

    });
})