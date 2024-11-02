import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

// Function to create a directory if it does not exist
function createDirectoryIfNotExists(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

// Function to create a file if it does not exist
function createFileIfNotExists(filePath: string, content: string = ''): void {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
  }
}

function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error('Usage: npm run create:module <module-name>');
    process.exit(1);
  }

  const srcDir = join(__dirname, '..', 'src', moduleName);
  const directories = [
    'abstract',
    'dto',
    'repositories',
    'controllers',
    'entities',
    'services',
  ];

  // Create module directory and subdirectories
  createDirectoryIfNotExists(srcDir);
  directories.forEach((dir) => {
    createDirectoryIfNotExists(join(srcDir, dir));
  });

  // Create the module file
  createFileIfNotExists(
    join(srcDir, `${moduleName}.module.ts`),
    `// ${moduleName} module`,
  );

  console.log(
    `Module ${moduleName} created with all subdirectories and initial files.`,
  );
}

// Run the main function
main();
