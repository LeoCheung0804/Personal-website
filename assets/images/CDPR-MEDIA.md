# CDPR media

## Real photographs

Supplied by Leo Cheung on 27 October 2026. These project copies preserve the supplied image bytes:

- `cdpr-system.jpg`: landscape photograph, originally `WhatsApp Image 2026-10-27 at 17.42.50.jpeg`. Used for the project lead, catalog card, and social image.
- `cdpr-frame-and-winches.jpg`: portrait photograph, originally the filename ending `(2).jpeg`.
- `cdpr-drive-layout.jpg`: portrait photograph, originally the filename ending `(1).jpeg`.

The portrait photographs are available in the page's expandable system-photo section. Responsive WebP versions are made by the existing image optimizer.

## Explanatory figures

The three editable SVGs were drawn directly as vector diagrams:

- `cdpr-system-diagram.svg`: representative structural frame, winch drives, cables, tool carrier, and example nozzle/feed hose. Numbered keys are translated in the page caption. Cable count, routing, proportions, and component positions are illustrative; this is not an as-built or dimensioned CAD drawing.
- `cdpr-kinematics-diagram.svg`: a conceptual planar sketch relating platform pose to cable lengths. It is not a calculated workspace map.
- `cdpr-statics-diagram.svg`: illustrative cable-force directions and an external load, with force and moment equilibrium. The arrows do not encode measured force magnitudes. Tension limits are discussed in the caption without inventing numerical values.

The subject matter follows the owner's confirmed kinematic and static workspace analysis. General feasibility terminology was checked against [Gouttefarde, Merlet and Daney, Wrench-Feasible Workspace of Parallel Cable-Driven Mechanisms](https://www-sop.inria.fr/hephaistos/PDF/gouttefarde_merlet_icra2007.pdf). The figures do not imply that this particular method was used in the project.

## Nozzle concept

`cdpr-nozzle-concept.png` was made with the built-in image-generation tool, then refined to lower the coupling into the existing small tool-carrier frame. It is saved separately from the real photographs and explicitly labelled as an AI-edited concept in both languages. It illustrates an example integration, not installed hardware or a printing trial. No API/CLI fallback was used.

### Initial edit prompt

Use case: precise-object-edit.
Edit target: the provided real landscape laboratory photograph (1080 × 810), showing a large aluminium cable robot frame and a small empty rectangular metal tool-carrier frame near the bottom centre.
Make only this localized addition: place one plausible example concrete-printing nozzle assembly INSIDE that existing small bottom-centre metal frame, and connect one concrete feeding hose to the top of the nozzle.
Critical scale/position: the small existing frame occupies roughly x=520–608, y=590–713 in the original photo. Preserve it exactly. The complete rigid nozzle must fit within its inner opening, approximately x=540–590, y=610–695. The nozzle should occupy roughly 65–75% of the frame's inner height and 30–40% of its inner width. A compact vertical stainless-steel barrel tapering to a downward outlet, with a discreet mounting bracket inside the frame. The outlet remains ABOVE the lower frame rails. Do not enlarge the nozzle or frame. It must be a small component in this wide laboratory shot, not a large foreground machine.
A dark industrial concrete delivery hose, proportionate to the small nozzle, connects naturally to its top through the frame opening. Let the flexible hose curve gently in from the right side of the work area, resting partly on the floor. It can extend outside the small frame; the rigid nozzle cannot. Use a realistic bend radius and a simple coupling.
Preserve the exact original wide composition, camera perspective, laboratory, overhead crane, structural posts, bracing, cables, winches, floor, shelves, lighting and objects. Do not remove, bend or redesign the existing small metal frame. Occlude the nozzle correctly behind its front rails. Match the ambient light, metal texture, subtle shadows and photographic grain.
No concrete extrusion, printed parts, people, added labels, dimensions, text, logos or arrows. This will be captioned on the website as an illustrative example nozzle integration, not an as-built photograph. Keep the output landscape with the original 4:3 composition.

### Refinement prompt

Use case: precise-object-edit. Refine this generated concept image with ONE small local adjustment.
The example nozzle is in the correct small metal frame near the bottom centre. Make the ENTIRE rigid nozzle assembly, including its metal hose coupling, fit inside that frame. Currently the coupling protrudes above the top rails. Lower the coupling BELOW the top rail plane and slightly shorten the stainless barrel as needed. Keep the downward nozzle tip above the bottom rails. The hose may curve through the open top to the lowered coupling; the flexible hose can remain outside. The rigid nozzle should occupy about two-thirds of the inner frame height and about one-third of its width. Preserve the existing small frame's exact size and location; do not move or enlarge it. Preserve the large frame, cables, winches, crane, floor, workshop and camera composition exactly. No extrusion, labels, arrows or new parts. Keep this 4:3 landscape photograph, with only the compact nozzle/coupling geometry corrected.

