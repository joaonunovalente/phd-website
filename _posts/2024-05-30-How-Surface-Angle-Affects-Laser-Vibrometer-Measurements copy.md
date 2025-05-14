---
layout: post
title: How Surface Angle Affects Laser Vibrometer Measurements
subtitle: A practical study of vibrometer alignment effects on FRF estimates
date: 2024-05-30 00:00:00 0000
background: /img/posts/06.jpg
---

## Introduction

This experiment investigates how varying the surface reflection angle affects laser vibrometer measurements. A vibrometer is aligned at several angles relative to the motion of a shaker’s stinger — orthogonally (0º), and at ±20º, ±30º, and ±45º. The results are compared to assess the accuracy of angle-corrected reconstructions.<br/><br/>

---

## Protocol

1. **Baseline Measurement**: The vibrometer is initially aligned orthogonally (0º) to the shaker stinger. This measurement serves as the ground truth reference.

2. **Angled Measurements**: The measurement surface is tilted to ±20º, ±30º, and ±45º, and the corresponding velocity responses are recorded for each angle.

3. **Correction and Averaging**: Opposing angle pairs are averaged and corrected using cosine projection to estimate the longitudinal component.

<figure style="text-align: center;">
  <a href="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Setup.png" class="lightbox">
    <img src="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Setup.png" class="img-fit" alt="Chart" />
  </a>
</figure>


---

## Mathematical Background

### 1. Projection Correction

The vibrometer measures the velocity projected onto its axis. For a laser angled at θ, the measured velocity is:

$$
V_{\text{meas}} = V_z \cdot \cos(\theta)
$$

To recover the true longitudinal velocity:

$$
V_z = \frac{V_{\text{meas}}}{\cos(\theta)}
$$

### 2. Averaging Symmetrical Angles

Opposing measurements (e.g., +θ and -θ) are averaged and corrected:

$$
V_z^{(\theta)} = \frac{V_{+\theta} + V_{-\theta}}{2 \cos(\theta)}
$$

The full estimate uses all three angle pairs:

$$
V_z^{\text{avg}} = \frac{1}{3} \left( V_z^{(20^\circ)} + V_z^{(30^\circ)} + V_z^{(45^\circ)} \right)
$$

### 3. Relative Error in Decibels

To quantify the difference between an estimated velocity and the orthogonal reference, we use:

$$
\mathrm{Error}_{\mathrm{dB}}(f) = 20 \log_{10} \left| \frac{ \hat{V}(f) }{ V_{\text{ref}}(f) } \right|
$$

Where:

- 0 dB means perfect match  
- Positive values indicate overestimation  
- Negative values indicate underestimation<br/><br/>

---

## Results

### Orthogonal vs. Reconstructed Velocity

Comparison of the orthogonal velocity measurement and the averaged reconstruction from all corrected angle pairs:

<figure style="text-align: center;">
  <a href="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Orthogonal_vs_Estimates_Magnitude.jpg" class="lightbox">
    <img src="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Orthogonal_vs_Estimates_Magnitude.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

### Individual Angle Contributions

This plot shows the corrected measurements from each angle pair individually:

<figure style="text-align: center;">
  <a href="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Angle_Pairs_Magnitude.jpg" class="lightbox">
    <img src="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Angle_Pairs_Magnitude.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

### Relative Error with Respect to Orthogonal Measurement

The relative error (in decibels) quantifies how much each estimate deviates from the orthogonal reference:

<figure style="text-align: center;">
  <a href="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Relative_Error.jpg" class="lightbox">
    <img src="/img/posts/2025-04-25-How-Surface-Angle-Affects-Laser-Vibrometer-Measurements/Relative_Error.jpg" class="img-fit" alt="Chart" />
  </a>
</figure>

---

## Conclusions

Here's the two main conclusions:

- Non-orthogonal angles can be corrected using cosine projection.
- Averaging across pair angles improves the results, since it cancels the in-plain vibrations (x and y).<br/><br/>


---

## Code and Data

The full source code and experimental data used are available on [GitHub PhD repository](https://github.com/joaonunovalente/phd).<br/><br/>
