import fs from 'node:fs';
import * as g from './graph';
import * as parse from './parsingUtils';

export function analyzeProject(srcDirectoryPath: string): g.graphNode {
    const sep = (process.platform === 'win32' ? '\\' : '/');
    const appVuePath = srcDirectoryPath + sep + 'App.vue';
    const root = g.create(appVuePath);

    const stack = [root];
    // todo: make this not hardcoded, allowing users to select which directories to include
    const viewsPath = srcDirectoryPath + sep + 'views'
    if (fs.existsSync(viewsPath)) {
        for (let path of getFiles(viewsPath)) {
            if (process.platform === 'win32') {
                path = path.replace(/\//g, '\\');
            }
            stack.push(g.create(path));
        }
    }

    const visited = new Set();
    const existingNodes = new Map<string, g.graphNode>(); // maps path to node, used to determine if new node must be created
    existingNodes.set(srcDirectoryPath, root);

    while (stack.length > 0) {
        const curr = stack.pop()!;
        if (visited.has(curr)) {
            continue;
        }

        visited.add(curr);
        const dependencyPaths = parse.getAllImportedStores(curr.contents);

        for (let path of dependencyPaths) {
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
                dependencyNode = g.create(path)
                existingNodes.set(path, dependencyNode);
            }
            g.addEdge(curr, dependencyNode);
            stack.push(dependencyNode);
        }
    }

    return root;
}

// * credit: https://www.learnwithparam.com/blog/get-all-files-in-a-folder-using-nodejs
// Recursive function to get files
function getFiles(dir: string, files: string[] = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir)
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`
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