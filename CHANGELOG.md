# aws-sdk-js-codemod

## 0.10.5

### Patch Changes

- Add callExpression arguments in ArrowFunction/Return while remove promise() ([bca11ad](https://github.com/awslabs/aws-sdk-js-codemod/commit/bca11ad))

## 0.10.4

### Patch Changes

- Call JS API of jscodeshift instead of using spawn ([d446899](https://github.com/awslabs/aws-sdk-js-codemod/commit/d446899))

## 0.10.3

### Patch Changes

- Add instructions to clear npx cache to use latest version of aws-sdk-js-codemod ([1c76e12](https://github.com/awslabs/aws-sdk-js-codemod/commit/1c76e12))

## 0.10.2

### Patch Changes

- Support requires with MemberExpression property ([8b09bb6](https://github.com/awslabs/aws-sdk-js-codemod/commit/8b09bb6))

## 0.10.1

### Patch Changes

- Enable transformation when a mixture of require and imports is present ([39b1518](https://github.com/awslabs/aws-sdk-js-codemod/commit/39b1518))

## 0.10.0

### Minor Changes

- Default parser to babylon ([49ec6f4](https://github.com/awslabs/aws-sdk-js-codemod/commit/49ec6f4))

## 0.9.3

### Patch Changes

- Filter client names received from new expressions and TS Types ([a998205](https://github.com/awslabs/aws-sdk-js-codemod/commit/a998205))

## 0.9.2

### Patch Changes

- Use filter API to delete identifiers from require object pattern ([0f4ca88](https://github.com/awslabs/aws-sdk-js-codemod/commit/0f4ca88))

## 0.9.1

### Patch Changes

- Use filter API to shortlist import declarations to be deleted ([e623543](https://github.com/awslabs/aws-sdk-js-codemod/commit/e623543))

## 0.9.0

### Minor Changes

- Support type definitions which are not available in v3 ([915dcfe](https://github.com/awslabs/aws-sdk-js-codemod/commit/915dcfe))

### Patch Changes

- Remove reference to non-existent types from CLIENT_TYPES_MAP records ([ac605d5](https://github.com/awslabs/aws-sdk-js-codemod/commit/ac605d5))
- Generate CLIENT_TYPES_MAP by processing client types from v2 ([2f3a713](https://github.com/awslabs/aws-sdk-js-codemod/commit/2f3a713))

## 0.8.5

### Patch Changes

- Remove client import equals if clients are not created ([88f6998](https://github.com/awslabs/aws-sdk-js-codemod/commit/88f6998))

## 0.8.4

### Patch Changes

- Remove client require if clients are not created ([e64574d](https://github.com/awslabs/aws-sdk-js-codemod/commit/e64574d))
- Remove client import if clients are not created ([135b8ab](https://github.com/awslabs/aws-sdk-js-codemod/commit/135b8ab))

## 0.8.3

### Patch Changes

- Replace types for requires ([6d29b35](https://github.com/awslabs/aws-sdk-js-codemod/commit/6d29b35))

## 0.8.2

### Patch Changes

- Replace TypeScript types created with imports ([6344814](https://github.com/awslabs/aws-sdk-js-codemod/commit/6344814))

## 0.8.1

### Patch Changes

- Add support for ImportEqualsDeclaration ([dc417b9](https://github.com/awslabs/aws-sdk-js-codemod/commit/dc417b9))

## 0.8.0

### Minor Changes

- Use default import/require for types ([25559fe](https://github.com/awslabs/aws-sdk-js-codemod/commit/25559fe))

## 0.7.6

### Patch Changes

- Support updating variable declaration with require CallExpression ([3c5197d](https://github.com/awslabs/aws-sdk-js-codemod/commit/3c5197d))

## 0.7.5

### Patch Changes

- Parse through named imports from global path instead of clients ([35d0638](https://github.com/awslabs/aws-sdk-js-codemod/commit/35d0638))

## 0.7.4

### Patch Changes

- Deep import search only for available clients ([9b3dfb1](https://github.com/awslabs/aws-sdk-js-codemod/commit/9b3dfb1))

## 0.7.3

### Patch Changes

- Reduce number of calls to source API in getV2ClientNamesRecord ([a1134d4](https://github.com/awslabs/aws-sdk-js-codemod/commit/a1134d4))

## 0.7.2

### Patch Changes

- Make transformer async ([5f4e015](https://github.com/awslabs/aws-sdk-js-codemod/commit/5f4e015))

## 0.7.1

### Patch Changes

- Support named imports from "aws-sdk" ([d236d4c](https://github.com/awslabs/aws-sdk-js-codemod/commit/d236d4c))

## 0.7.0

### Minor Changes

- Use local names to minimize transformation ([c77b0d9](https://github.com/awslabs/aws-sdk-js-codemod/commit/c77b0d9))

## 0.6.12

### Patch Changes

- Rename v2DefaultModuleName to v2GlobalName to align with v2ClientName ([10be584](https://github.com/awslabs/aws-sdk-js-codemod/commit/10be584))
- Remove enforcement of v2GlobalName to string ([aba497a](https://github.com/awslabs/aws-sdk-js-codemod/commit/aba497a))

## 0.6.11

### Patch Changes

- Add utility getV2ClientTSTypeRef ([66568ab](https://github.com/awslabs/aws-sdk-js-codemod/commit/66568ab))
- Add utility getV2ClientNamesFromDefault ([9d2c537](https://github.com/awslabs/aws-sdk-js-codemod/commit/9d2c537))
- Add utility getV2ClientNewExpression ([27a2f24](https://github.com/awslabs/aws-sdk-js-codemod/commit/27a2f24))
- Create new object instead of modifying existing expression ([d3f130c](https://github.com/awslabs/aws-sdk-js-codemod/commit/d3f130c))

## 0.6.10

### Patch Changes

- Replace named imports for Request/Response types ([9e64aa4](https://github.com/awslabs/aws-sdk-js-codemod/commit/9e64aa4))

## 0.6.9

### Patch Changes

- Replace named imports for Input/Output types ([222c00c](https://github.com/awslabs/aws-sdk-js-codemod/commit/222c00c))

## 0.6.8

### Patch Changes

- Update TypeScript Type Reference for Input/Output ([c4a97b1](https://github.com/awslabs/aws-sdk-js-codemod/commit/c4a97b1))

## 0.6.7

### Patch Changes

- Check only for client constructors in named imports ([9621c39](https://github.com/awslabs/aws-sdk-js-codemod/commit/9621c39))

## 0.6.6

### Patch Changes

- Remove .promise() from client API request stored in a variable. ([c80233f](https://github.com/awslabs/aws-sdk-js-codemod/commit/c80233f))

## 0.6.5

### Patch Changes

- Refactor to move v2-to-v3 utils into folders ([0c9cfd1](https://github.com/awslabs/aws-sdk-js-codemod/commit/0c9cfd1))
- Support transformation for clients published between 2022-03-02 and 2022-12-21 ([653b11b](https://github.com/awslabs/aws-sdk-js-codemod/commit/653b11b))

## 0.6.4

### Patch Changes

- Remove .promise() calls from class member clients ([43abf32](https://github.com/awslabs/aws-sdk-js-codemod/commit/43abf32))

## 0.6.3

### Patch Changes

- Automatically set parser to ts for TypeScript files ([8ab815a](https://github.com/awslabs/aws-sdk-js-codemod/commit/8ab815a))

## 0.6.2

### Patch Changes

- Remove dependency 'table' ([4ab8452](https://github.com/awslabs/aws-sdk-js-codemod/commit/4ab8452))

## 0.6.1

### Patch Changes

- Skip generation of type definitions ([c27a225](https://github.com/awslabs/aws-sdk-js-codemod/commit/c27a225))

## 0.6.0

### Minor Changes

- Drop support for Node.js 12.x ([ca4eb56](https://github.com/awslabs/aws-sdk-js-codemod/commit/ca4eb56))
- Bump jscodeshift to v0.14.0 ([53d305a](https://github.com/awslabs/aws-sdk-js-codemod/commit/53d305a))

## 0.5.2

### Patch Changes

- Use require for custom changelog script ([9413715](https://github.com/awslabs/aws-sdk-js-codemod/commit/9413715))
- Enable @changesets/changelog-github ([f8ab5e1](https://github.com/awslabs/aws-sdk-js-codemod/commit/f8ab5e1))
- Add GitHub commit links to CHANGELOG ([f1ec4a9](https://github.com/awslabs/aws-sdk-js-codemod/commit/f1ec4a9))
- Add custom changelog script ([c9ff137](https://github.com/awslabs/aws-sdk-js-codemod/commit/c9ff137))

## 0.5.1

### Patch Changes

- Update GitHub user to awslabs ([9b5791a](https://github.com/awslabs/aws-sdk-js-codemod/commit/9b5791a))
- Add Pull Request Template ([fb0c577](https://github.com/awslabs/aws-sdk-js-codemod/commit/fb0c577))
- Add CONTRIBUTING.md ([cfa2e97](https://github.com/awslabs/aws-sdk-js-codemod/commit/cfa2e97))
- Add Code of Conduct ([9a58d12](https://github.com/awslabs/aws-sdk-js-codemod/commit/9a58d12))
- Set Amazon Web Services as author ([c0f7605](https://github.com/awslabs/aws-sdk-js-codemod/commit/c0f7605))
- Add link to LICENSE from README ([f9d1827](https://github.com/awslabs/aws-sdk-js-codemod/commit/f9d1827))
- Add MIT-0 License ([7c7d1c8](https://github.com/awslabs/aws-sdk-js-codemod/commit/7c7d1c8))

## 0.5.0

### Minor Changes

- Process clients from TS Type Reference ([334a834](https://github.com/awslabs/aws-sdk-js-codemod/commit/334a834))

## 0.4.6

### Patch Changes

- Add tests for existing package import/require with services ([af1ba19](https://github.com/awslabs/aws-sdk-js-codemod/commit/af1ba19))
- Rename v2 Modules from Client to Service ([f67d3ea](https://github.com/awslabs/aws-sdk-js-codemod/commit/f67d3ea))
- Remove promise() calls from clients created from service imports ([5b77175](https://github.com/awslabs/aws-sdk-js-codemod/commit/5b77175))

## 0.4.5

### Patch Changes

- Replace <any> with <unknown> ([249dee2](https://github.com/awslabs/aws-sdk-js-codemod/commit/249dee2))
- Add test with no AWS SDK for JavaScript (v2) ([812ab49](https://github.com/awslabs/aws-sdk-js-codemod/commit/812ab49))
- Rename named import to identifier import ([8ef2e6d](https://github.com/awslabs/aws-sdk-js-codemod/commit/8ef2e6d))
- Add test for existing identifier/package require ([3d1b37c](https://github.com/awslabs/aws-sdk-js-codemod/commit/3d1b37c))

## 0.4.4

### Patch Changes

- Run yarn lint on all source files ([4053841](https://github.com/awslabs/aws-sdk-js-codemod/commit/4053841))
- Enable eslint rule array-type with default 'array' ([52fc856](https://github.com/awslabs/aws-sdk-js-codemod/commit/52fc856))
- Enable eslint naming-convention rule with camelCase, UPPER_CASE and PascalCase ([ea133bb](https://github.com/awslabs/aws-sdk-js-codemod/commit/ea133bb))
- Create utility getMergedArrayWithoutDuplicates ([52947af](https://github.com/awslabs/aws-sdk-js-codemod/commit/52947af))

## 0.4.3

### Patch Changes

- Bump typescript to 4.6 ([ea49796](https://github.com/awslabs/aws-sdk-js-codemod/commit/ea49796))
- Support parser=ts ([8b09b2d](https://github.com/awslabs/aws-sdk-js-codemod/commit/8b09b2d))

## 0.4.2

### Patch Changes

- Rename Import to Module wherever required ([a72bd0c](https://github.com/awslabs/aws-sdk-js-codemod/commit/a72bd0c))
- Add utils remove(Require|Import)IdentifierName ([34c3fb7](https://github.com/awslabs/aws-sdk-js-codemod/commit/34c3fb7))
- Add utility getV2ClientModulePath ([4df95bd](https://github.com/awslabs/aws-sdk-js-codemod/commit/4df95bd))
- Split getV2ClientModuleNames into import/require components ([d0d459a](https://github.com/awslabs/aws-sdk-js-codemod/commit/d0d459a))
- Add utils get(Require|Import)IdentifierName ([38a16cc](https://github.com/awslabs/aws-sdk-js-codemod/commit/38a16cc))
- Split getV2DefaultModuleName into import/require components ([dd83c82](https://github.com/awslabs/aws-sdk-js-codemod/commit/dd83c82))
- Store 'aws-sdk' in constant PACKAGE_NAME ([5690340](https://github.com/awslabs/aws-sdk-js-codemod/commit/5690340))

## 0.4.1

### Patch Changes

- Support transformation for client require ([1008a5b](https://github.com/awslabs/aws-sdk-js-codemod/commit/1008a5b))

## 0.4.0

### Minor Changes

- Support transformation for global require ([65c166a](https://github.com/awslabs/aws-sdk-js-codemod/commit/65c166a))

## 0.3.1

### Patch Changes

- Handle v2 client imports in case of ImportNamespaceSpecifier ([339e74a](https://github.com/awslabs/aws-sdk-js-codemod/commit/339e74a))
- Replace jscodeshift-find-imports with source.find() call ([f4d79c8](https://github.com/awslabs/aws-sdk-js-codemod/commit/f4d79c8))

## 0.3.0

### Minor Changes

- Support transformation of v2 client imports ([d5d5e9d](https://github.com/awslabs/aws-sdk-js-codemod/commit/d5d5e9d))

## 0.2.3

### Patch Changes

- Check for source 'aws-sdk' while removing default imports ([24f87df](https://github.com/awslabs/aws-sdk-js-codemod/commit/24f87df))

## 0.2.2

### Patch Changes

- Remove .promise() from API calls in variable declarator ([84c337a](https://github.com/awslabs/aws-sdk-js-codemod/commit/84c337a))

## 0.2.1

### Patch Changes

- Remove .promise() from API calls which use await ([ed78aae](https://github.com/awslabs/aws-sdk-js-codemod/commit/ed78aae))

## 0.2.0

### Minor Changes

- Remove .promise() from client API calls ([a4dc900](https://github.com/awslabs/aws-sdk-js-codemod/commit/a4dc900))

## 0.1.5

### Patch Changes

- Update existing v3 import if already present ([c38b72a](https://github.com/awslabs/aws-sdk-js-codemod/commit/c38b72a))

## 0.1.4

### Patch Changes

- Sort v3 client imports ([62ba488](https://github.com/awslabs/aws-sdk-js-codemod/commit/62ba488))
- Add test for multiple API callbacks ([18ee5bb](https://github.com/awslabs/aws-sdk-js-codemod/commit/18ee5bb))

## 0.1.3

### Patch Changes

- Move test files next to source files ([ca6077d](https://github.com/awslabs/aws-sdk-js-codemod/commit/ca6077d))
- Update unit tests to follow team jest standards ([1112f3f](https://github.com/awslabs/aws-sdk-js-codemod/commit/1112f3f))

## 0.1.2

### Patch Changes

- Removes unused v2 default import ([fcd1e82](https://github.com/awslabs/aws-sdk-js-codemod/commit/fcd1e82))

## 0.1.1

### Patch Changes

- Update README with instructions to use aws-sdk-js-codemod ([369d337](https://github.com/awslabs/aws-sdk-js-codemod/commit/369d337))

## 0.1.0

### Minor Changes

- Send updated transform file if a custom transform is selected ([a8be757](https://github.com/awslabs/aws-sdk-js-codemod/commit/a8be757))

### Patch Changes

- Copy code which performs basic transformation of AWS SDK for JavaScript client from v2 to v3 ([e13f64c](https://github.com/awslabs/aws-sdk-js-codemod/commit/e13f64c))
- Adds a placeholder for transforms with information under help option ([dbd8346](https://github.com/awslabs/aws-sdk-js-codemod/commit/dbd8346))

## 0.0.5

### Patch Changes

- Use npm exec instead of ./node_modules/.bin ([0baf388](https://github.com/awslabs/aws-sdk-js-codemod/commit/0baf388))

## 0.0.4

### Patch Changes

- Make aws-sdk-js-codemod in bin folder executable ([978e21a](https://github.com/awslabs/aws-sdk-js-codemod/commit/978e21a))

## 0.0.3

### Patch Changes

- Remove simple-git-hooks on postinstall ([3c20ee0](https://github.com/awslabs/aws-sdk-js-codemod/commit/3c20ee0))

## 0.0.2

### Patch Changes

- Copy configuration from trivikr/aws-sdk-js-v2-to-v3 ([91ec885](https://github.com/awslabs/aws-sdk-js-codemod/commit/91ec885))
- Add a basic wrapper over jscodeshift ([baafe94](https://github.com/awslabs/aws-sdk-js-codemod/commit/baafe94))
