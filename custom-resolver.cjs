module.exports = (path, options) => {
    // Call the defaultResolver, so we leverage its cache, error handling, etc.
    return options.defaultResolver(path, {
        ...options,
        // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
        packageFilter: (pkg) => {
            // Not sure why this is needed, as uint8arrays and multiformats are both successfully resolving in did-jwt with the same testEnvironment...
            // https://github.com/decentralized-identity/did-jwt/blob/master/jest.config.mjs
            if (pkg.name === 'uint8arrays' || pkg.name.startsWith('multiformats')) {
                const exports = pkg.exports;
                const newExports = {};

                for (const key in exports) {
                    newExports[key] = exports[key];
                    // uint8arrays and multiformats only have an "import" export, which makes them fail during jest resolver
                    // "import" is not a default condition when resolving using https://www.npmjs.com/package/resolve.exports
                    // (used by jest resolver) for "node" testEnvironment
                    if (!exports[key]['node']) newExports[key]['node'] = exports[key]['import'];
                }

                return {
                    ...pkg,
                    exports: newExports,
                };
            }

            return pkg;
        },
    });
};