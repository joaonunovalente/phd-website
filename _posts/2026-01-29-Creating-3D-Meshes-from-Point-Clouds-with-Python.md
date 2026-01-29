---
layout: post
title: "Creating 3D Meshes from Point Clouds with Python"
subtitle: "Using Open3D for surface reconstruction and Level of Detail generation"
date: 2026-01-29
background: /img/posts/01.jpg
---

# Some context...

One of my ideas is to perform a 3D reconstruction of a structure in order to generate its 3D mesh. This involves using [SLAM methods](https://edexheim.github.io/mast3r-slam/) or [similar techniques](https://fast3r-3d.github.io/). Some ask for RGB-D point clouds, and others for 2D images.

## UR10e with FETMO Mega camera

To capture the point clouds needed for 3D reconstruction, I used the UR10e robotic arm equipped with a FEMTO Mega camera. The robot can move around the object, capturing it from multiple angles.

The video below demonstrates this concept in action: the UR10e systematically scans the target structure, generating overlapping point clouds from different perspectives. These raw point clouds are then aligned and merged to form a full 3D representation of the object.

<figure style="text-align: center; margin-bottom: 2em;">
  <div class="responsive-video">
    <iframe 
      src="https://www.youtube.com/embed/S2uVPVofnlU?autoplay=1" 
      title="YouTube video player" 
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</figure>

Implementing reliable methods to achieve this __has been very challenging__. Even with Gonçalo’s invaluable help last weekend, we couldn’t complete a reconstruction.

Therefore, I decided to split the task into two parts:
- 3D reconstruction (postponed)
- 3D mesh surface reconstruction (converting point clouds into 3D meshes)

---

# Creating 3D Meshes from Point Clouds with Python

For our latest experiment, Professor Rui Moreira and I selected a __exhaust manifold__ as the test structure. It presents a challenging geometry with multiple complex surfaces, curves, and cavities, making it an ideal candidate to test the robustness of our 3D reconstruction and mesh generation workflow.

Below is a photograph of the manifold.

<figure style="text-align: center; margin-bottom: 2em;">
  <a href="/img/posts/2026-01-29-Creating-3D-Meshes-from-Point-Clouds-with-Python/exhaust-manifold.png" class="lightbox">
    <img src="/img/posts/2026-01-29-Creating-3D-Meshes-from-Point-Clouds-with-Python/exhaust-manifold.png" class="img-fit" alt="Exhaust Manifold" />
  </a>
</figure>

I generated a detailed point cloud of the manifold, which you can explore interactively below. This dense point cloud is the raw data that will be processed to create the 3D mesh.

<div class="sketchfab-container">
  <iframe
    title="Coletor de Escape - Nuvem de Pontos"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/17ba94f876554fc4baf0948a43706575/embed">
  </iframe>
</div>

> **Info:** The cylinder visible on the top of the point cloud is an artifact from a bad crop and includes part of a hammer that was unintentionally captured during generation of the point cloud.
{: .alert .alert-info}

## 3D mesh conversion

I created 3D meshes from raw point cloud data using Python, following a [practical tutorial](https://medium.com/data-science/5-step-guide-to-generate-3d-meshes-from-point-clouds-with-python-36bad397d8ba)  on automatic mesh generation and surface reconstruction from [Florent Poux](https://github.com/florentPoux).


This post explains the process to transform point clouds into clean, usable 3D meshes, including generating multiple Levels of Detail (LoD).


### My Workflow Overview

I followed these main steps, adapted from the tutorial:

1. **Load and preprocess the point cloud**  
   - Read raw points  
   - Remove noise and outliers  
   - Estimate and orient normals  

2. **Mesh reconstruction using two methods**  
   - Ball Pivoting Algorithm (BPA): rolls a virtual ball over points to form triangles  
   - Poisson Reconstruction: fits a smooth, watertight surface enveloping the points  

3. **Mesh cleanup**  
   - Remove degenerate or duplicated triangles and vertices  
   - Fix non-manifold edges  

4. **Generate Levels of Detail (LoD)**  
   - Simplify the mesh to various triangle counts for performance tuning  

5. **Export and visualize results**  
   - Save meshes in the format `.ply`. But they can also be saved in formats like `.obj`, and `.stl`  


## Results

### Comparison: BPA vs. Poisson

<div class="sketchfab-container">
  <iframe
    title="Coletor de Escape - Nuvem de Pontos"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/ff72aa5962f4415bbce2a5b542cff996/embed">
  </iframe>
</div>


### Generate Levels of Detail using the Poisson method

<div class="sketchfab-container">
  <iframe
    title="Coletor de Escape - Nuvem de Pontos"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking
    execution-while-out-of-viewport
    execution-while-not-rendered
    web-share
    src="https://sketchfab.com/models/5b99393ea79a4372bed4f016fc6f96c0/embed">
  </iframe>
</div>

## Conclusions

Main conclusions:
- The BPA mesh captures sharp edges well but requires cleaner input. It is not suited for this kind of meshes.
- Poisson produces smoother, watertight meshes better suited for our goals.

<div style="margin-bottom: 2em;"></div>

> **Warning:** There are details that the meshes do not show (e.g. some holes on the top and bottom). Which is the result of the input point cloud not being detailed enough.
{: .alert .alert-warning}
---

## Code and Data

The full source code and experimental data used are available on [GitHub PhD repository](https://github.com/joaonunovalente/PhD/tree/main/Code/pointcloud-to-mesh).

The article _5-Step Guide to generate 3D meshes from point clouds with Python_ from __Florent Poux__ can be found [here](/img/posts/2026-01-29-Creating-3D-Meshes-from-Point-Clouds-with-Python/files/5-Step%20Guide%20to%20generate%203D%20meshes%20from%20point%20clouds%20with%20Python%20-%20Florent%20Poux.pdf).


