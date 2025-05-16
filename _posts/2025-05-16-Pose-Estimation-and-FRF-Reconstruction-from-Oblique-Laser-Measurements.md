---
layout: post
title: "Pose Estimation and FRF Reconstruction from Oblique Laser Measurements"
subtitle: "Combining 3D alignment and projection correction to recover orthogonal velocity components"
date: 2025-05-15 00:00:00 0000
background: /img/posts/04.jpg
---

# Part I – Pose Estimation

To be written...

# Part II – Reconstructing FRF Velocity from Oblique Laser Measurements

This experiment demonstrates how multiple oblique laser vibrometer measurements can be used to reconstruct the longitudinal (orthogonal) component of velocity in a vibration test. 
## Objective

- Reconstruct the FRF velocity vector along the Z-axis from off-axis laser measurements
- Compare different angle pairings and their reconstruction accuracy
- Use cosine projection to correct angled measurements


## Methodology

### Projection Correction

The laser measures the projection of the vibration along its axis. To estimate the true Z-component, each measurement was corrected using:

$$
V_z = \frac{V_{\text{meas}}}{\cos(\theta)}
$$

This correction was applied individually to:

$$
\begin{align*}
\theta_{\text{M3}} &= +44.53^\circ \\
\theta_{\text{M4}} &= +22.61^\circ \\
\theta_{\text{M5}} &= -27.69^\circ \\
\theta_{\text{M6}} &= -46.09^\circ
\end{align*}
$$

### Averaging Strategy

The final reconstruction used a four-angle average:

$$
Z = \frac{M3_{\text{corr}} + M4_{\text{corr}} + M5_{\text{corr}} + M6_{\text{corr}}}{4}
$$

---

## Results

### Reconstructed vs. Reference

<figure style="text-align: center;">
  <a href="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Orthogonal_vs_Estimates_Magnitude.jpg" class="lightbox">
    <img src="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Orthogonal_vs_Estimate_Magnitude.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

### Individual Angle Contributions

This plot shows the magnitude of each corrected measurement compared to the orthogonal reference:

<figure style="text-align: center;">
  <a href="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Angle_Pairs_Magnitude.jpg" class="lightbox">
    <img src="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Angle_Pairs_Magnitude.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

### Relative Error Analysis

Relative error was computed for all pairwise reconstructions:

$$
\mathrm{Error}_{\mathrm{dB}} = 20 \log_{10} \left| \frac{ \hat{V}(f) }{ V_{\text{ref}}(f) } \right|
$$


The best result came from the four-angle average, showing reduced error across the spectrum.

<figure style="text-align: center;">
  <a href="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Relative_Error.jpg" class="lightbox">
    <img src="/img/posts/2025-05-16-Pose-Estimation-and-FRF-Reconstruction-from-Oblique-Laser-Measurements/Relative_Error.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

---

## Conclusions

The main conclusions are the following:

- Projection correction using known incidence angles works effectively.
- Even strongly oblique measurements (such as 46.09°) can contribute valuable information when corrected.
- Averaging multiple corrected angles leads to a better reconstruction of the longitudinal FRF component.

---

## Code and Data

The full source code and experimental data used are available on [GitHub PhD repository](https://github.com/joaonunovalente/phd).