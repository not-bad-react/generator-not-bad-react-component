# Not Bad Generator For React Component Scaffolding
### Made with 💟 to DX

- PureComponent by default
- An option to use stateless component
- An option to omit props even
- An option to choose files extensions
- ES6 syntax for the component

## How To Use

Install Yeoman locally for better DX.
```
npm i -g yo
```
Add Not Bad generator to dev dependencies for your React-based project:
```
npm i --save-dep generator-not-bad-react-component
```
Then add special script inside `package.json`, similar to
```
...
"scripts": {
  "scaffold:component": "yo not-bad-react-component"
}
...
```
So everybody in your team can just type `npm run scaffold:component` in order to create a folder for the new React component.

## What To Expect

The structure of the component folder is a little bit excessive:
```
/components
|-- UiComponent
|  |-- UiComponent.css
|  |-- UiComponent.jsx
|  `-- index.js
```

## Roadmap
- redux support
- Jest support

## Ancestor
https://github.com/booxood/generator-react-new-component
