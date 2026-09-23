# Robosun Tapper model

`robosun-tapper.glb` is a browser derivative of `Scissor_mechanism_V2.SLDASM`,
exported through STEP and tessellated locally with occt-import-js. The source
configuration was retracted; suppressed components are not recovered.

Two original flat guards were replaced with curved enclosed guards reconstructed
from the user's reference image. Their 370 mm diameter follows the original CAD;
cage depth, rib thickness and curvature are visual approximations. Other parts
retain their original geometry before web optimization. This asset is a portfolio
visualization, not manufacturing CAD or a verified model of every latest revision.

The GLB uses meters and source CAD axes. The viewer rotates it upright, centers
it, and applies display scale. Source assembly names remain available for grouping.
It contains 422 rendered meshes and 618,639 triangles, approximately 4.60 MB.

Conversion: 0.35 mm linear / 0.35 rad angular tessellation deflection; glTF
Transform 4.5.0 simplification ratio 0.35 with error 0.001 of each mesh extent,
then Meshopt compression. Flatten, join, and GPU instancing were disabled to
preserve individually movable assembly nodes. The loader supports
EXT_meshopt_compression and KHR_mesh_quantization.

The website does not need the original CAD files, SolidWorks, or a remote model
service. Original source CAD and intermediate exports were not overwritten.

The viewer reconstructs scissor motion from the CAD link-plane axes and joint spacing. Links undergo rigid rotations and translations; the end carriage and tapping head share a straight translation. The extension stroke is illustrative, not a saved SolidWorks configuration or validated operating limit. Source geometry stays unchanged.
