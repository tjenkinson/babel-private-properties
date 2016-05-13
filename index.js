var crypto = require("crypto");

module.exports = function(babel) {
	return {
		visitor: {
			Identifier: (path, state) => {
				var name = path.node.name;
				var prefix = state.opts.prefix || "_";
				if (name.indexOf("_") !== 0) {
					// not a private property
					return;
				}
				var toHash = name;
				if (state.opts.salt) {
					toHash += ":"+salt;
				}
				// replace the identifier with a hash
				path.node.name = "_"+crypto.createHash('md5').update(toHash).digest("hex");
			}
		}
	};
};