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
					toHash += ":"+state.opts.salt;
				}
				var hash = crypto.createHash('md5').update(toHash).digest("hex");
				var hashLength = state.opts.hashLength || 4;
				if (hashLength > 32 || hashLength <= 0) {
					throw new Error("Hash length must be <= 32.");
				}
				hash = hash.substring(0, hashLength);
				if (state.opts.replaceCompletely) {
					// replace the identifier with a hash
					path.node.name = "_"+hash;
				}
				else {
					// append the hash to the current identifier
					path.node.name += hash;
				}
			}
		}
	};
};