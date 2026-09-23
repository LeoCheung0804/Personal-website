// Procedural PBR surface detail, sampled in coordinates attached to the CAD parts.
// Triplanar blending avoids stretching where a curved surface changes direction.
export function createTapperFinishes(THREE, renderer) {
  function surfaceData(carbon) {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let shade = 1, roughness, height;
      if (carbon) {
        // Seamless 2-over/2-under twill. Each four-bundle tile spans 16 mm.
        const vertical = ((Math.floor(x / 64) - Math.floor(y / 64) + 4) % 4) < 2;
        const strand = vertical ? x : y;
        const crown = Math.pow(Math.sin(Math.PI * ((strand % 64) + .5) / 64), .6);
        const fibers = Math.sin(strand * Math.PI / 4);
        shade = .38 + .48 * crown + .045 * fibers + (vertical ? .07 : 0);
        roughness = .34 + .16 * (1 - crown) + .025 * fibers;
        height = .2 + .55 * crown + .035 * fibers;
      } else {
        // Integer harmonics make the fine directional brushing tile seamlessly.
        const grain = .5 + .22 * Math.sin(y * Math.PI * 2 * 43 / size)
          + .14 * Math.sin((y * 61 + x) * Math.PI * 2 / size)
          + .07 * Math.sin(y * Math.PI * 2 * 97 / size);
        roughness = .32 + .2 * grain;
        height = grain;
      }
      data[i] = Math.round(shade * 255);
      data[i + 1] = Math.round(roughness * 255);
      data[i + 2] = Math.round(height * 255);
      data[i + 3] = 255;
    }
    const map = new THREE.DataTexture(data, size, size);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.generateMipmaps = true;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    map.needsUpdate = true;
    return map;
  }
  function surfaceMaterial(carbon) {
    const material = new THREE.MeshPhysicalMaterial({
      color: carbon ? 0x30363d : 0xb9c1ca,
      metalness: carbon ? .02 : .98,
      roughness: .42,
      clearcoat: carbon ? .22 : 0,
      clearcoatRoughness: .4,
      side: THREE.DoubleSide
    });
    const map = surfaceData(carbon);
    material.customProgramCacheKey = () => `tapper-triplanar-${carbon ? 'carbon' : 'brushed'}-1`;
    material.onBeforeCompile = shader => {
      shader.uniforms.finishData = { value: map };
      shader.uniforms.finishScale = { value: carbon ? 62.5 : 180 };
      shader.uniforms.finishRelief = { value: carbon ? .00035 : .00004 };
      shader.vertexShader = shader.vertexShader.replace('#include <common>', `
        #include <common>
        attribute vec3 finishPosition;
        attribute vec3 finishNormal;
        varying vec3 vFinishPosition;
        varying vec3 vFinishNormal;
      `).replace('#include <begin_vertex>', `
        #include <begin_vertex>
        vFinishPosition = finishPosition;
        vFinishNormal = finishNormal;
      `);
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
        #include <common>
        uniform sampler2D finishData;
        uniform float finishScale;
        uniform float finishRelief;
        varying vec3 vFinishPosition;
        varying vec3 vFinishNormal;
        vec3 sampleFinish() {
          vec3 weights = pow(abs(normalize(vFinishNormal)), vec3(8.0));
          weights /= max(dot(weights, vec3(1.0)), 0.0001);
          vec3 p = vFinishPosition * finishScale;
          return texture2D(finishData, p.yz).rgb * weights.x
            + texture2D(finishData, p.xz).rgb * weights.y
            + texture2D(finishData, p.xy).rgb * weights.z;
        }
      `).replace('#include <map_fragment>', `
        #include <map_fragment>
        vec3 finishSample = sampleFinish();
        diffuseColor.rgb *= finishSample.r;
      `).replace('#include <roughnessmap_fragment>', `
        #include <roughnessmap_fragment>
        roughnessFactor = finishSample.g;
      `).replace('#include <normal_fragment_maps>', `
        #include <normal_fragment_maps>
        // Derivative bump detail uses the original smooth CAD normal as its base.
        vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
        vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
        float determinant = dot(sx, r1) * faceDirection;
        float height = finishSample.b * finishRelief;
        vec3 gradient = sign(determinant) * (dFdx(height) * r1 + dFdy(height) * r2);
        normal = normalize(abs(determinant) * normal - gradient);
      `);
    };
    return material;
  }
  const materials = {
    aluminum: surfaceMaterial(false),
    carbon: surfaceMaterial(true),
    hardware: new THREE.MeshStandardMaterial({ color: 0xbfc8d0, metalness: .82, roughness: .28, side: THREE.DoubleSide }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x161a20, metalness: .05, roughness: .75, side: THREE.DoubleSide }),
    motor: new THREE.MeshStandardMaterial({ color: 0x282e36, metalness: .45, roughness: .4, side: THREE.DoubleSide })
  };
  function mapSurface(node) {
    const geometry = node.geometry.clone();
    const count = geometry.attributes.position.count;
    const position = new Float32Array(count * 3), normal = new Float32Array(count * 3);
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(node.matrixWorld);
    const point = new THREE.Vector3(), direction = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      point.fromBufferAttribute(geometry.attributes.position, i).applyMatrix4(node.matrixWorld).toArray(position, i * 3);
      direction.fromBufferAttribute(geometry.attributes.normal, i).applyMatrix3(normalMatrix).normalize().toArray(normal, i * 3);
    }
    geometry.setAttribute('finishPosition', new THREE.BufferAttribute(position, 3));
    geometry.setAttribute('finishNormal', new THREE.BufferAttribute(normal, 3));
    node.geometry = geometry;
  }
  return { materials, mapSurface };
}
