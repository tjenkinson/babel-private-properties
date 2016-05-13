[![npm version](https://badge.fury.io/js/babel-private-properties.svg)](https://badge.fury.io/js/babel-private-properties)
# babel-private-properties

When building a library it is common practice to mark properties as private by prefixing them with an underscore.

This plugin replaces any properties that are prefixed with an underscore with hashes of their names to make it even clearer that these properties are intended for internal use only. You can provide a custom salt making it possible to generate different hashes for each build.

## Install
```bash
npm install --savedev babel-private-properties
```

## Example

Transforms
```js
function HelloLib(name) {
    // don't want users to access this directly
    this._name = name;
}

// don't want users to call this directly
HelloLib.prototype._getName = function() {
    return this._name;
};

// This method is public and should be called externally
HelloLib.prototype.sayHello = function() {
    var name = this._getName();
    console.log("Hello "+name+"!");
};

module.exports = HelloLib;
```

to
```js
function HelloLib(name) {
    // don't want users to access this directly
    this._9acade405c8dd987b11389613578be32 = name;
}

// don't want users to call this directly
HelloLib.prototype._411c21a26f496f81c64d325c9ac50f93 = function () {
    return this._9acade405c8dd987b11389613578be32;
};

// This method is public and should be called externally
HelloLib.prototype.sayHello = function () {
    var name = this._411c21a26f496f81c64d325c9ac50f93();
    console.log("Hello " + name + "!");
};

module.exports = HelloLib;
```

## Usage

###### .babelrc
```json
{
  "plugins": ["babel-private-properties"]
}
```

Set plugin options using an array of `[pluginName, optionsObject]`.
```json
{
  "plugins": [["babel-private-properties", {
    "prefix": "_",
    "salt": "salt"
  }]]
}
```

###### webpack.config.js
```js
'module': {
  'loaders': [{
    'loader': 'babel-loader',
    'test': /\.js$/,
    'exclude': /node_modules/,
    'query': {
      'plugins': ['babel-private-properties']
    }
  }]
}
```

### Vary Hashes Per Build
If you supply the config with webpack you can change the salt dynamically.

```js
'module': {
  'loaders': [{
    'loader': 'babel-loader',
    'test': /\.js$/,
    'exclude': /node_modules/,
    'query': {
      'plugins': [["babel-private-properties", {
        "prefix": "_",
        "salt": Math.random() // Each build will have unique private property names
      }]]
    }
  }]
}
```