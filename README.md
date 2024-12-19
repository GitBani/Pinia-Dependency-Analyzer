# Pinia Dependency Analyzer
A visualization and analysis tool to build a dependency graph out of your Pinia stores, and mark all circular dependencies.

## Requirements
- Your stores are all in `src/stores`
- Your store files do not have any syntax errors
- Only one store is defined per file

## Demo
Steps:
1. Install dependencies 
```
npm i
```
2. Run `pinia` command, passing in the path to your project's `src/` directory
```
npm run pinia -- <your_src_path>
```
3. Generate an svg from the output DOT code
```
npm run gen
```

I have a demo directory, and running the program on it resulted in:
![demo-dependency-graph](demo/dependency-graph.svg)

## Reflection and Future Plans
I love graph theory, so I enjoyed learning about Tarjan's algorithm and Johnson's algorithm, and implementing them in order to find all cycles in the dependency graph. This was also the first time I read the actual papers to learn something, and not limiting myself to online tutorials.

My future plan is to extend this to detect circular dependencies in Python projects. I wonder how `__init.py__`'s may complicate the task.