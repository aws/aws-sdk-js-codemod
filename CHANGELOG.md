# aws-sdk-js-codemod

## 0.2.1

### Patch Changes

- ed78aae: Remove .promise() from API calls which use await

## 0.2.0

### Minor Changes

- a4dc900: Remove .promise() from client API calls

## 0.1.5

### Patch Changes

- c38b72a: Update existing v3 import if already present

## 0.1.4

### Patch Changes

- 62ba488: Sort v3 client imports
- 18ee5bb: Add test for multiple API callbacks

## 0.1.3

### Patch Changes

- ca6077d: Move test files next to source files
- 1112f3f: Update unit tests to follow team jest standards

## 0.1.2

### Patch Changes

- fcd1e82: Removes unused v2 default import

## 0.1.1

### Patch Changes

- 369d337: Update README with instructions to use aws-sdk-js-codemod

## 0.1.0

### Minor Changes

- a8be757: Send updated transform file if a custom transform is selected

### Patch Changes

- e13f64c: Copy code which performs basic transformation of AWS SDK for JavaScript client from v2 to v3
- dbd8346: Adds a placeholder for transforms with information under help option

## 0.0.5

### Patch Changes

- 0baf388: Use npm exec instead of ./node_modules/.bin

## 0.0.4

### Patch Changes

- 978e21a: Make aws-sdk-js-codemod in bin folder executable

## 0.0.3

### Patch Changes

- 3c20ee0: Remove simple-git-hooks on postinstall

## 0.0.2

### Patch Changes

- 91ec885: Copy configuration from trivikr/aws-sdk-js-v2-to-v3
- baafe94: Add a basic wrapper over jscodeshift
