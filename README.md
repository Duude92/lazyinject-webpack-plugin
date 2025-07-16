# lazyinject-webpack-plugin

Webpack plugin designed to bundle application which uses [LazyInject DI](https://github.com/Duude92/lazyinject)
container.

## Installation

```bash
npm install @duude92/lazyinject-webpack-plugin --save-dev
```

## Quick start

 - Setup `lazyinject.config.js` with catalogs, which has dependencies.<br>
Example:

```js
// lazyinject.config.js
module.exports = {
    catalogs: ['src', 'src/implementations'],
};
```
 - Setup chosen webpack config.
 - Setup webpack plugin within your webpack configuration:
`plugins: [new LazyInjectWebpackPlugin()]`

## Example
 - `01-webpack-sample` contain example of application, which uses LazyInject as DI container, and bundled using webpack
 - [battleship-backend](https://github.com/Duude92/battleship-backend) - example of bundling in 'real' application

## License
This project is open source and available under the MIT License.

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.