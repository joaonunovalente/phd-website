---
layout: post
title: "Revopoint MetroY Ultra and 3D printing its markers"
subtitle: "Laser scanning a droner propeller to obtain a point cloud and a mesh"
date: 2026-06-09
background: /assets/img/posts/12.jpg
tags:
  - 3d-printing
  - revopoint
---


## Revopoint MetroY Ultra

Revopoint is a Chinese company known for manufacturing professional 3D scanners. Its latest model, the MetroY Ultra, is designed for high-precision scanning and reverse engineering of small to medium-sized objects.

<figure class="mt-5 mb-5" style="text-align: center; margin-bottom: 2em;">
  <div class="responsive-video">
    <iframe 
      src="https://www.youtube.com/embed/9fhJ4RLwo-8" 
      title="YouTube video player" 
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</figure>

### Scanning a bust

I started by testing the scanner and I managed to get the point cloud and mesh of the bust.

<div class="sketchfab-container mt-5 mb-5">
  <iframe
    title="Drone Propeller"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/31aff621a6114034ae3287b9b79f4ab2/embed">
  </iframe>
</div>


The software also allows you to create and export the mesh file. The mesh quality still depends on the scan performed, but I was very impressed by the results I have obtained. 

<div class="sketchfab-container mt-5 mb-5">
  <iframe
    title="Drone Propeller"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/ebfe6fe8bb8c4bfb8da9a24def31f62c/embed">
  </iframe>
</div>


## Makers

One of the challenges of laser scanning a component has to do with the placement of markers. The markers can be stuck directly to the component or on reusable objects. Here is where the markers come in. The image below shows a 10 mm marker attached to a metallic door with a magnet.

<figure class="mt-5 mb-5" style="text-align: center;">
  <a href="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/marker.jpg" class="lightbox">
    <img src="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/marker.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

I have decided to 3D print several markers so that the reflective circles could be attached. By searching what other people have already created and with the invaluable help of Gonçalo, I managed to obtain several shapes.

I also 3D printed a tower that is useful to scan bigger objects. And it also serves as a box for the other markers.


<figure class="mt-5 mb-5" style="text-align: center;">
  <a href="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/bust.jpg" class="lightbox">
    <img src="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/bust.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

## Example of Drone Propeller scanned

This propeller was scanned using a Revopoint laser scan. With the aid of several towers, since the rotating table was not enough to get all the angles of the propeller.

<div class="sketchfab-container mt-5 mb-5">
  <iframe
    title="Drone Propeller"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/cb9c2df59ab94ec5b1023336d05923e2/embed">
  </iframe>
</div>

## Files

All files of the markers can be found bellow.

- [Body.stl](/assets/files/revopoint/Body.stl)
- [Cap.stl](/assets/files/revopoint/Cap.stl)
- [Dodecahedron.stl](/assets/files/revopoint/Dodecahedron.stl)
- [Dodecahedron cutted 3 sides.stl](/assets/files/revopoint/Dodecahedron-cutted-3-sides.stl)
- [Dodecahedron cutted 6 sides.stl](/assets/files/revopoint/Dodecahedron-cutted-6-sides.stl)
- [Dodecahedron raised.stl](/assets/files/revopoint/Dodecahedron-raised.stl)
- [Equilateral Pyramid.stl](/assets/files/revopoint/Equilateral_Pyramid.stl)

As an example of how they look, you can find the Body & Cap and also smaller markers.

<figure class="mt-5 mb-5" style="text-align: center;">
  <a href="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/black-markers.jpg" class="lightbox">
    <img src="/assets/img/posts/2026-06-09-Revopoint-and-3d-printing-its-makers/black-markers.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>