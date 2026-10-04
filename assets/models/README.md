# CU-Brick model

`cu-brick-end-effector.glb` is a local browser derivative of the supplied
`End Effector Frame 380x380x220 v9.step` (the export identifies a 2022-10-28
revision). Source files are never changed or served by the website.

The derivative retains the aluminium profiles, brackets, eight eyelets, orange
enclosure, geared rotation ring and bearing, gripper motor, guide rails and
racks, opposing jaws, and guided release plates. The GLB retains eight named
CAD subsystems plus a separately grouped printed battery mount (nine groups).
One coincident enclosure duplicate, the extra 100 mm enclosure extension, and
56 small internal motor/fastener bodies were omitted. The lid is lowered 100 mm
onto the original cover to match `EE_Pic_2.jpeg`; the resulting housing is about
137 mm high. Original STEP files are unchanged. The battery is seated in the
actual mount's 95 x 65 mm pocket, just above its 84.378 mm floor. Battery height,
Raspberry Pi enclosure and C920 camera are photo-based approximations added in
JavaScript; the payload brick is illustrative. Its 156 x 95 x 65 mm shape is
held along the two long vertical faces. Each sliding jaw assembly (pad,
upright, bearing blocks, carrier and rack) is posed 30.5 mm inward from the
saved STEP opening. The two contact pads remain separately identifiable;
the fixed motor and guides retain their source positions.

The viewer matches the photographed finishes with satin silver aluminium and
steel, matte orange printed enclosures and gripper parts, a blue battery in its
black printed holder, black electronics and camera, and a red-brown brick.
The moving release plates remain silver, with orange fixed mounts. Camera glass
has a separate dark finish. Subtle neutral selection lighting preserves those
colors in both site themes. Finishes are photo-based approximations; retained
CAD geometry and source material names stay intact.

The end-effector viewer separates five functional modules: cable support frame
(including all eyelets), power and control (enclosure, printed mount and battery),
brick rotation, gripping and release (motor, guides, jaws and release plates),
and vision (camera, bracket and Raspberry Pi enclosure). The Arduino MEGA 2560
and Bluetooth controller are described within the closed power enclosure rather
than shown as invented internal geometry. The user's technical reference supplies
the 120 Wh battery, approximately four-hour runtime, impedance-controlled gripper,
and C920 / Raspberry Pi 4B ArUco localization via TCP with two workspace tags.
The sample brick stays in the gripping module during separation. Each module
translates as a unit; independent motion controls retain the assembled finishes
and original CAD body shapes. The rotation control turns the inner ring and
complete gripper about its vertical axis from -180 to 180 degrees while the cage,
power enclosure and vision hardware stay fixed. Grip/release moves each jaw,
carrier, bearing block and rack up to 30.5 mm outward, with counter-rotation of
the pinion. The guided release rods/plates follow the brick for up to 16 mm and
retract; the sample brick descends 55 mm. A released brick keeps its heading when
the empty gripper turns; reversing the slider aligns and grips it again.
The strokes and timing illustrate operation, not validated travel limits or a
dynamic simulation. Separation offsets explain functions, not disassembly order.

Conversion uses occt-import-js 0.0.23, with 0.6 mm linear and 0.4 rad angular
deflection, followed by glTF Transform 4.5.1 weld/simplification (ratio 0.4, error
0.001), material-based joins within each subsystem, and Meshopt compression.
The result is 598,788 bytes and 84,272 triangles. CAD Z is mapped to display Y,
the outer frame is centered, and units are metres. Quantization transforms stay
inside neutral wrapper groups so labels and offsets use physical units.

`assets/js/cu-brick-model.js` reconstructs the whole-site overview. Its plan
positions use cached component transforms read through the installed SolidWorks
API from `YES_CUBRICK_20200930_3DSiteModel.SLDASM`. That saved configuration
reported suppressed components, so it supplies placement and hierarchy, not a
new mesh export. The four `AssemFullPole` assemblies, eight `AssemWinch_YES_v2`
assemblies, swivel pulleys, `AssemFifthPole` and `Conveyor` guide the model.
The site origin is centered at CAD X=-5.712, Z=-7.501; plan Z is reversed.

Pole numbering and motor pairs follow the supplied site plan: pole 0 / motors
0,4; pole 1 / 1,5; pole 2 / 2,6; pole 3 / 3,7. The PDF
`CU-Brick_CIC_Award_2025_v2.pdf`, `Elevation_2.jpg`, `5th_pole_up.jpeg`, and the
completed pavilion photo supply the cable, elevation and pick-up relationships.
The support profiles, vertical dimensions, conveyor, low brick courses, accessory
positions, pulley stroke, finishes and offsets are approximations. The end
effector is enlarged 2.2x in the site overview for legibility. Cables are idealized
straight spans through their pulleys. This is not a tension/kinematics simulator,
survey model, manufacturing drawing or validated disassembly sequence.

To rebuild the end-effector derivative, install these one-time conversion tools
outside the website, then provide that directory's `node_modules` path:

```powershell
npm install --prefix <temporary-tools> occt-import-js@0.0.23 @gltf-transform/core@4.5.1 @gltf-transform/extensions@4.5.1 @gltf-transform/functions@4.5.1 meshoptimizer@1.3.0
node scripts/build-cu-brick-model.cjs <original-v9.step> <temporary-tools/node_modules>
node scripts/check-cu-brick-model.mjs
```

The converter checks the source revision before applying its subsystem mapping.
The website uses its existing local Three.js and Meshopt modules, with no new
runtime package installation or remote model service.

# RoBosun-Tapper model

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
