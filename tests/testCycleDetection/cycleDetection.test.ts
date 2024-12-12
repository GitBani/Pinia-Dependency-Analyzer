import { describe, test, expect } from 'vitest';
import * as g from '../../src/graph';
import { getAllSCC } from "../../src/cycleDetection";

// Helper function for identifying SCCs by node numbers
function byNumber(sccs: g.GraphNode[][]): Set<Set<number>> {
    const numberSCCs = new Set<Set<number>>();
    for (const scc of sccs) {
        const numberSCC = new Set<number>;
        for (const node of scc) {
            numberSCC.add(node.num!);
        }
        numberSCCs.add(numberSCC);
    }
    return numberSCCs;
}

describe("Tarjan's Algorithm to find SCCs", () => {
    test("Standard case 1", () => {
        const n0: g.GraphNode = {
            num: null,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            num: null,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            num: null,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            num: null,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            num: null,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            num: null,
            name: "N5",
            importPaths: [],
            dependencies: [],
        };
        const n6: g.GraphNode = {
            num: null,
            name: "N6",
            importPaths: [],
            dependencies: [],
        };
        const n7: g.GraphNode = {
            num: null,
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
            num: null,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            num: null,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            num: null,
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
            num: null,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            num: null,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            num: null,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            num: null,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            num: null,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            num: null,
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

    test("Tree", () => {
        const n0: g.GraphNode = {
            num: null,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            num: null,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            num: null,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            num: null,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            num: null,
            name: "N4",
            importPaths: [],
            dependencies: [],
        };
        const n5: g.GraphNode = {
            num: null,
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
            num: null,
            name: "N0",
            importPaths: [],
            dependencies: [],
        };
        const n1: g.GraphNode = {
            num: null,
            name: "N1",
            importPaths: [],
            dependencies: [],
        };
        const n2: g.GraphNode = {
            num: null,
            name: "N2",
            importPaths: [],
            dependencies: [],
        };
        const n3: g.GraphNode = {
            num: null,
            name: "N3",
            importPaths: [],
            dependencies: [],
        };
        const n4: g.GraphNode = {
            num: null,
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