Three.js 0.180.0 (MIT), vendored from the published npm package through jsDelivr.

- https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js
- https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.min.js
- https://cdn.jsdelivr.net/npm/three@0.180.0/LICENSE

Keep both modules on the same version. The project viewer imports the module
locally and only when near the viewport; no CDN request is made by the viewer.

The addons loaders/GLTFLoader.js, utils/BufferGeometryUtils.js and libs/meshopt_decoder.module.js are from the same Three.js 0.180.0 npm package. Bare Three.js imports in the loader and utility are adjusted to the local module path. MeshoptDecoder retains its embedded MIT copyright notice.
