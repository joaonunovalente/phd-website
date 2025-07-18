---
layout: post
title: "Designing a Support Structure for a Vibrometer and 3D Camera"
subtitle: "CAD modeling and technical drawings for the UR10e robotic-arm and tripod integration"
date: 2025-07-08
background: /img/posts/06.jpg
---

This project aimed to design a modular support structure for a **Polytec vibrometer OFV-505** and an **ORBBEC Femto Mega 3D camera**. The system needed to be lightweight, robust, and compatible with both a **UR10e robotic arm** and a standard tripod.

The objectives are the following:

- Create a versatile support structure for lab and robotic applications.  
- Generate technical drawings for manufacturing.  

## 3D CAD Modeling

The system was modeled as an assembly with four main custom parts:  

1. **Base Plate** – tripod mounting interface.  
2. **Top Plate** – UR10e mounting adapter.  
3. **Side Plates** – enabling horizontal adjustment.  
4. **Drawer** – holding the ORBBEC camera securely.  

Standard ISO 7380 M6 bolts were selected to simplify assembly and ensure compatibility.

<figure style="text-align: center;">
  <a href="/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/assembly.png" class="lightbox">
    <img src="/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/assembly.png" class="img-fit" alt="3D CAD assembly of support structure for Polytec vibrometer and ORBBEC camera mounted on Nordbo Robotics sensor" />
  </a>
</figure>

## Integration with Nordbo Robotics Sensor

Although the top plate includes an adapter for the **UR10e robotic arm**, the support structure was primarily designed to integrate with a **Nordbo Robotics NRS-6200-D80 sensor**. This configuration allows the vibrometer and camera assembly to benefit from the sensor’s advanced force-torque capabilities, enabling precise alignment and stable operation during robotic tasks.

<figure style="text-align: center">
  <a href="/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/NRS-6200-D80.jpg" class="lightbox">
    <img src="/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/NRS-6200-D80.jpg"  style="width: 500px;" class="img-fit" alt="NRS-6200-D80 Nordbo Robotics sensor" />
  </a>
</figure>

As a result, the structure’s dimensions and mounting interfaces have been designed with the Nordbo sensor as the primary interface, rather than for direct UR10e mounting.

## Technical Drawings

Once the 3D model was finalized, I created detailed 2D technical drawings for each part and the overall assembly using SOLIDWORKS.  

The result is a set of manufacturing-ready drawings including:  

- [Assembly.pdf](/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/files/Assembly.pdf) – Full assembly documentation.  
- [Detail Drawings.pdf](/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/files/Detail-Drawings.pdf) – Detailed definition drawings for each part.  

## Appendices

The datasheets for external components are available here:  

- [Polytec – Vibrometer OFV-505.pdf](/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/files/polytec-vibrometer-ofv-505-datasheet.pdf)  
- [Universal Robots – UR10e.pdf](/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/files/ur10e-datasheet.pdf)  
- [Nordbo Robotics – NRS-6200-D80.pdf](/img/posts/2025-07-09-Designing-a-Support-Structure-for-a-Vibrometer-and-3D-Camera/files/NRS-6200-D80-Datasheet.pdf)  
<br>