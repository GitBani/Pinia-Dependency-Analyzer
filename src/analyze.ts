import fs from 'node:fs';
import * as g from './graph';

const sep = (process.platform === 'win32' ? '\\' : '/');

export function analyzeProject(srcDirectoryPath: string): g.GraphNode[] {
    const stack = [];
    const visited = new Set();
    const existingNodes = new Map<string, g.GraphNode>(); // maps path to node

    const storesPath = srcDirectoryPath + sep + 'stores'
    if (fs.existsSync(storesPath) && fs.statSync(storesPath).isDirectory()) {
        for (let path of getFiles(storesPath)) {
            const node = g.create(path);
            existingNodes.set(path, node);
            stack.push(node);
        }
    }
    else {
        console.error(`${storesPath} must be an existing directory containing your Pinia stores.`);
        process.exit(1);
    }

    while (stack.length > 0) {
        const curr = stack.pop()!;
        if (visited.has(curr)) {
            continue;
        }

        visited.add(curr);

        for (let path of curr.importPaths) {
            if (path.startsWith('@')) {
                path = path.replace('@', srcDirectoryPath);
            }
            if (process.platform === 'win32') {
                path = path.replace(/\//g, '\\');
            }
            if (!path.endsWith('.ts')) {
                path += '.ts';
            }

            if (!fs.existsSync(path)) {
                console.error(`Could not find file ${path}, does it exist?`);
                continue;
            }

            let dependencyNode;
            if (existingNodes.has(path)) {
                dependencyNode = existingNodes.get(path)!;
            } else {
                console.log(`The file ${path} used by ${curr.name} is not in your "stores" directory.`);
                dependencyNode = g.create(path);
                existingNodes.set(path, dependencyNode);
            }
            g.addEdge(curr, dependencyNode);
        }
    }

    return Array.from(existingNodes.values());
}

// * credit: https://www.learnwithparam.com/blog/get-all-files-in-a-folder-using-nodejs
// Recursive function to get files
function getFiles(dir: string, files: string[] = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir)
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        if (file.startsWith('__') && file.endsWith('__')) continue;
        const name = dir + sep + file

        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files)
        } else {
            // If it is a file, push the full path to the files array
            files.push(name)
        }
    }
    return files
}