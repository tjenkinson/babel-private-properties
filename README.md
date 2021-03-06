[![npm version](https://badge.fury.io/js/babel-private-properties.svg)](https://badge.fury.io/js/babel-private-properties)
# babel-private-properties

When building a library it is common practice to mark properties as private by prefixing them with an underscore.

This plugin appends a few characters to any properties that are prefixed with an underscore to make it even clearer that these properties are intended for internal use only. The characters are the first part of an md5 hash of the identifier. You can provide a custom salt making it possible to generate different hashes for each build.

## Install
```bash
npm install --save-dev babel-private-properties
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
    this._name9aca = name;
}

// don't want users to call this directly
HelloLib.prototype._getName411c = function () {
    return this._name9aca;
};

// This method is public and should be called externally
HelloLib.prototype.sayHello = function () {
    var name = this._getName411c();
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
    "salt": "salt",
    "hashLength": 4,
    "replaceCompletely": false
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

If the `replaceCompletely` option is `true` the identifiers will be replaced completley with its hash. This isn't recommended as even though it's incredibly unlikely a hash collision could occur. Keeping the original text prevents this.

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
        "salt": Math.random() // Each build will have unique private property names
      }]]
    }
  }]
}
```