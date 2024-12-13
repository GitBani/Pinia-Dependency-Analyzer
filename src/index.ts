import { Command } from 'commander';
import { analyzeProject } from './analyze';
import { markAllCycles } from './cycleDetection';
import { generateDOTCode } from './generateDOTCode';

const program = new Command();

program
    .version('0.1.0')
    .description('Analyze Pinia store dependency graph')
    .argument('<sourceDirectoryPath>', 'Path to the `src` directory of the project to analyze')
    .action((srcDirectoryPath: string) => {
        const graph = analyzeProject(srcDirectoryPath);
        graph.forEach(node => console.log(node.id))
        // markAllCycles(graph);
        generateDOTCode(graph);
    });

program.parse(process.argv);
