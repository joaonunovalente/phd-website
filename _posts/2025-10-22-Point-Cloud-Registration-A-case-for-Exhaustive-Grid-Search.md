---
layout: post
title: "Point Cloud Registration: A case for Exhaustive Grid Search (EGS)"
subtitle: "Using EGS to determine the reflection angles on 3D laser vibrometry"
date: 2025-10-22
background: /img/posts/01.jpg
---

# Point Cloud Registration: A case for Exhaustive Grid Search

## Introduction to Point Cloud Registration

Point cloud registration is a fundamental task in computer vision and robotics, aiming to align two or more 3D point clouds into a common coordinate system. It serves as a cornerstone for numerous applications, including 3D reconstruction, autonomous navigation, object recognition, and augmented or virtual reality.

The goal of registration is to estimate the rigid transformation — composed of a rotation and a translation — that best aligns a source point cloud to a target point cloud. This process is often complicated by challenges such as partial overlap, sensor noise, and occlusions.


## What is Exhaustive Grid Search?
**Exhaustive Grid Search (EGS)** is a featureless, non-learning method for 3D point cloud registration introduced by [Bojanić et al. (2024)](/img/posts/2025-10-22-Point-Cloud-Registration-A-case-for-Exhaustive-Grid-Search/files/EGS.pdf) <a href="#ref1">[1]</a>. Unlike deep learning–based approaches that rely on neural networks to extract and match features, EGS directly explores the entire transformation space to find the best alignment.

Because EGS does not depend on feature extraction, correspondences, or training data, it generalizes well across different datasets. Despite its simplicity, EGS has been shown to outperform many deep learning–based methods on standard benchmarks such as ETH and FAUST-partial.

## Benchmarks for several datasets

This plot shows the Registration Recall (RR) performance of methods across all four benchmarks — *3DMatch, KITTI, ETH, and FAUST-partial* — as a function of publication year.


<div style="overflow-x: auto; max-width: 100vw; margin: 0; padding: 0;">
  <div id="registrationPlotAll" style="width: 700px; height: 600px;"></div>
</div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

{% raw %}
<script> 
document.addEventListener("DOMContentLoaded", function() {
// ---------- Data ----------

// 3DMatch
const matchMethods = [
  { name: "Super4PCS", year: 2016, result: 0.216 },
  { name: "GO-ICP", year: 2015, result: 0.229 },
  { name: "FPFH+FGR", year: 2016, result: 0.429 },
  { name: "FPFH+RANSAC", year: 2016, result: 0.661 },
  { name: "3DMatch", year: 2017, result: 0.734 },
  { name: "FCGF", year: 2020, result: 0.909 },
  { name: "GeDi", year: 2022, result: 0.930 },
  { name: "PointDSC", year: 2021, result: 0.928 },
  { name: "CSCE-Net", year: 2021, result: 0.935 },
  { name: "RegTR", year: 2022, result: 0.930 },
  { name: "GeoTransformer", year: 2022, result: 0.950 },
  { name: "EGS (proposed)", year: 2024, result: 0.841 }
];

// KITTI
const kittiMethods = [
  { name: "FPFH+RANSAC", year: 2016, result: 0.108 },
  { name: "FPFH+SC2-PCR", year: 2020, result: 0.987 },
  { name: "D3Feat-rand", year: 2020, result: 0.185 },
  { name: "D3Feat-pred", year: 2020, result: 0.368 },
  { name: "DIP", year: 2020, result: 0.517 },
  { name: "SpinNet", year: 2021, result: 0.814 },
  { name: "GeDi", year: 2022, result: 0.829 },
  { name: "PointDSC", year: 2021, result: 0.941 },
  { name: "FCGF+PointDSC", year: 2021, result: 0.967 },
  { name: "FCGF+SC2-PCR", year: 2020, result: 0.976 },
  { name: "GeoTransformer", year: 2022, result: 0.679 },
  { name: "YOHO", year: 2022, result: 0.821 },
  { name: "EGS (proposed)", year: 2024, result: 0.950 }
];

// ETH
const ethMethods = [
  { name: "FPFH+RANSAC", year: 2016, result: 0.350 },
  { name: "FPFH+SC2-PCR", year: 2020, result: 0.970 },
  { name: "3DMatch", year: 2017, result: 0.290 },
  { name: "FCGF", year: 2020, result: 0.860 },
  { name: "D3Feat", year: 2020, result: 0.590 },
  { name: "SpinNet", year: 2021, result: 0.895 },
  { name: "GeDi", year: 2022, result: 0.903 },
  { name: "PointDSC", year: 2021, result: 0.925 },
  { name: "SC2-PCR", year: 2020, result: 0.930 },
  { name: "CSCE-Net", year: 2021, result: 0.940 },
  { name: "GeoTransformer", year: 2022, result: 0.975 },
  { name: "EGS (proposed)", year: 2024, result: 0.998 }
];

// FAUST-partial
const faustMethods = [
  { name: "FPFH+RANSAC", year: 2016, result: 0.000 },
  { name: "FPFH+SC2-PCR", year: 2020, result: 0.020 },
  { name: "3DMatch", year: 2017, result: 0.015 },
  { name: "FCGF", year: 2020, result: 0.026 },
  { name: "D3Feat", year: 2020, result: 0.017 },
  { name: "SpinNet", year: 2021, result: 0.021 },
  { name: "GeDi", year: 2022, result: 0.030 },
  { name: "GeoTransformer", year: 2022, result: 0.031 },
  { name: "EGS (proposed)", year: 2024, result: 0.994 }
];

// ---------- Helper ----------
function makeTrace(data, color, name) {
  return {
    x: data.map(m => m.year + (Math.random() - 0.5) * 1),
    y: data.map(m => m.result),
    text: data.map(m => `${name}<br>${m.name}<br>Year: ${m.year}<br>RR: ${m.result}`),
    type: "scatter",
    mode: "markers",
    name: name,
    marker: { size: 12, opacity: 0.85, color: color },
    hovertemplate: "%{text}<extra></extra>"
  };
}

// ---------- Combine and Plot ----------
const traces = [
  makeTrace(matchMethods, "#1f77b4", "3DMatch"),
  makeTrace(kittiMethods, "#2ca02c", "KITTI"),
  makeTrace(ethMethods, "#ff7f0e", "ETH"),
  makeTrace(faustMethods, "#d62728", "FAUST-partial")
];

const layout = {
  title: "Registration Recall Across 3DMatch, KITTI, ETH, and FAUST-partial Benchmarks",
  xaxis: { title: "Year of Publication", tickmode: "linear", dtick: 2 },
  yaxis: { title: "Registration Recall (RR)", range: [-0.05, 1.05] },
  legend: { orientation: "h", y: -0.2 },
  hovermode: "closest",
  margin: { t: 60, b: 60, l: 60, r: 40 }
};

Plotly.newPlot("registrationPlotAll", traces, layout);
  });
</script>
{% endraw %}

EGS can be found in the cluster on the top right. It was published on the year 2024.

> **Note:** Some methods appear in every benchmark, while others are included in only a few.
{: .alert .alert-secondary}

## Conclusion

The comparative performance of EGS across several standard 3D registration benchmarks is summarized in the table below. It highlights how EGS performs relative to leading deep learning methods in both in-domain and cross-domain scenarios.

<div style="overflow-x: auto; max-width: 100vw; margin: 0; padding: 0; box-sizing: border-box;">
  <table style="width: 200%; border-collapse: collapse; font-family: Arial, sans-serif; min-width: 600px; margin: 0; padding: 0; box-sizing: border-box; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px; background-color:#fff;">
    <thead>
      <tr style="background-color:#f4f6f8; position:sticky; top:0;">
        <th style="border:1px solid #ddd; padding:12px; text-align:left;">Benchmark</th>
        <th style="border:1px solid #ddd; padding:12px; text-align:left;">Type / Domain</th>
        <th style="border:1px solid #ddd; padding:12px; text-align:left;">RR Metric (%)</th>
        <th style="border:1px solid #ddd; padding:12px; text-align:left;">Best Deep Learning RR (%)</th>
        <th style="border:1px solid #ddd; padding:12px; text-align:left;">Observations</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #ddd; padding:12px;"><strong>3DMatch</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Indoor RGB-D (training domain for most DL methods)</td>
        <td style="border:1px solid #ddd; padding:12px;"><strong>84.11</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">95.0 (GeoTransformer, 2023)</td>
        <td style="border:1px solid #ddd; padding:12px;">Deep methods dominate here — they were trained and tuned on this dataset.</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:12px;"><strong>KITTI</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Outdoor lidar (cross-domain)</td>
        <td style="border:1px solid #ddd; padding:12px;"><strong>94.95</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">97.7 (SC2-PCR, PointDSC)</td>
        <td style="border:1px solid #ddd; padding:12px;">EGS nearly matches or surpasses most DL models — strong generalization.</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:12px;"><strong>ETH</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Outdoor vegetation (different geometry)</td>
        <td style="border:1px solid #ddd; padding:12px;"><strong>≈90–95</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Comparable or slightly worse</td>
        <td style="border:1px solid #ddd; padding:12px;">EGS performs on par or better, showing robustness to noisy, irregular data.</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:12px;"><strong>FAUST-partial (FP)</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Human body scans (unseen data)</td>
        <td style="border:1px solid #ddd; padding:12px;"><strong>≈80–90</strong></td>
        <td style="border:1px solid #ddd; padding:12px;">Deep models drop below 70</td>
        <td style="border:1px solid #ddd; padding:12px;">EGS clearly outperforms deep methods on unseen shapes.</td>
      </tr>
    </tbody>
  </table>
</div>

While deep learning methods excel on benchmarks that match their training distributions (e.g., 3DMatch), their performance often drops significantly when evaluated on unseen or cross-domain data such as KITTI, ETH, or FAUST-partial. 

In contrast, EGS — despite being a featureless, non-learning approach — achieves competitive or superior RR across all benchmarks.

---
# Determing the reflection angles on 3D laser Vibrometry


The experiment aims to determine the laser reflection angle when a vibrometer measures the vibration of a point on a plate.
The process consists in performing a point cloud registration to extract the angular orientation of each measurement node.

**Setup**

- A 3D laser vibrometer is positioned at a orthogonal location to measure surface vibrations at a single point.

- The point is measured at different positions or viewing angles (nodes 1–12), resulting in a separate point cloud for each position.

- These point clouds are aligned relative to a reference position (node 1) using EGS, which finds the optimal rigid transformation (rotation + translation) between scans. 

**Goal**

- Determine how each measurement node (i.e., each reflected beam) is rotated relative to the reference — these rotations correspond directly to reflection angles.

- The rotation matrices are extracted from the EGS alignment results and compiled into the table presented in this report.

- By analyzing these transformations, we can map directional reflections (x, y and z).

<div style="overflow-x: auto; max-width: 100vw; margin: 0; padding: 0; box-sizing: border-box;">
<div id="vibrometer-plot" style="width:100%;max-width:800px;height:600px;margin:auto;"></div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {

  // Main node data
  const positions = [
    { num: 1, angle: 0 },
    { num: 4, angle: -0.24 },
    { num: 5, angle: -0.62 },
    { num: 6, angle: -0.92 },
    { num: 7, angle: 0.37 },
    { num: 8, angle: 0.74 },
    { num: 9, angle: 1.10 }
  ];

  // Plot points
  const traceNodes = {
    x: positions.map(p => p.angle),
    y: Array(positions.length).fill(1),
    mode: 'markers+text',
    text: positions.map(p => p.num),
    textposition: 'middle center',
    marker: {
      size: 40,
      color: 'white',
      line: { color: 'black', width: 2 }
    },
    textfont: { size: 16, color: 'black' },
    type: 'scatter',
    showlegend: false
  };

  // Center node (special color)
  const traceCenter = {
    x: [0],
    y: [0],
    mode: 'markers+text',
    text: [''],
    textposition: 'middle center',
    marker: {
      size: 20,
      color: 'red',
      line: { color: 'black', width: 2 }
    },
    textfont: { size: 16, color: 'white' },
    type: 'scatter',
    name: 'Measuring point',
    showlegend: false,
  };

  // Manual legend items (no plotted data)
  const legendEntries = [
    { name: 'Node 1:   0°' },
    { name: 'Node 4:   -13.5°' },
    { name: 'Node 5:   -31.9°' },
    { name: 'Node 6:   -42.5°' },
    { name: 'Node 7:   20.6°' },
    { name: 'Node 8:   36.8°' },
    { name: 'Node 9:   47.9°' }
  ].map(item => ({
    x: [null],
    y: [null],
    mode: 'markers',
    marker: { size: 12, color: 'white', line: { color: 'black', width: 2 } },
    name: item.name,
    type: 'scatter'
  }));

  const legendEntries2 = [
    { name: 'Measuring Point' },
  ].map(item => ({
    x: [null],
    y: [null],
    mode: 'markers',
    marker: { size: 12, color: 'red', line: { color: 'black', width: 2 } },
    name: item.name,
    type: 'scatter'
  }));

  const layout = {
    title: { text: 'Vibrometer Positions' },
    xaxis: {
      title: 'Position [m]',
      zeroline: true,
      range: [-1.2, 1.2],
      tickvals: [-1, -0.5, 0, 0.5, 1]
    },
    yaxis: {
      zeroline: true,
      range: [-0.1, 1.2],
      tickvals: [-2, 2]
    },
    legend: {
      x: 0.02,
      y: 0.15, // slightly above the plot area
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: 'lightgray',
      borderwidth: 1
    },
    showlegend: true,
    margin: { t: 100, b: 60, l: 40, r: 40 },
    plot_bgcolor: '#fff'
  };

  Plotly.newPlot('vibrometer-plot', [traceNodes, traceCenter, ...legendEntries2, ...legendEntries], layout);
});
</script>
</div>

<div><br></div>

> **Note:** Only measurements 1 to 7 are showed, since they were measured in the same plane. The other measurements were done on different horizontal planes.
{: .alert .alert-secondary}

### Point Cloud Registration: Example

This is an example of two point clouds being merged using the EGS method.
The red and blue point clouds represent scans of the same space captured from different positions.


<div style="overflow-x: auto; max-width: 100vw; margin: 0; padding: 0; box-sizing: border-box;">
<div class="sketchfab-embed-wrapper"> <iframe title="Point cloud merge: 1-6" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share width="720" height="500" src="https://sketchfab.com/models/8ad23a74a3954584a5540ef59f9d6d27/embed"> </iframe> <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> <a href="https://sketchfab.com/3d-models/point-cloud-merge-1-6-8ad23a74a3954584a5540ef59f9d6d27?utm_medium=embed&utm_campaign=share-popup&utm_content=8ad23a74a3954584a5540ef59f9d6d27" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Point cloud merge: 1-6 </a> by <a href="https://sketchfab.com/joaonunovalente?utm_medium=embed&utm_campaign=share-popup&utm_content=8ad23a74a3954584a5540ef59f9d6d27" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> João Nuno Valente </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=8ad23a74a3954584a5540ef59f9d6d27" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div>
</div>

## Results

The following table shows the results of rotation transformations between point clouds, which can be used to infer reflection angles.

<div style="overflow-x: auto; max-width: 100vw; margin: 0; padding: 0; box-sizing: border-box;">
  <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; min-width: 600px; margin: 0; padding: 0; box-sizing: border-box;">
  <thead>
    <tr style="background-color:#f2f2f2;">
      <th style="border:1px solid #ddd; padding:16px; text-align:center;">Point Cloud</th>
      <th style="border:1px solid #ddd; padding:8px; text-align:center;">Point Cloud</th>
      <th style="border:1px solid #ddd; padding:8px; text-align:center;">Rotation Transformation</th>
      <th style="border:1px solid #ddd; padding:8px; text-align:center;">Direction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">2</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace; ">(3.22°, -0.01°, 0.71°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Up</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">3</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(7.46°, -0.04°, 1.57°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Up</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">13</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(21.84°, -0.64°, 0.28°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Up</td>
    </tr>    
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">4</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(-0.03°, -13.47°, 0.13°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Left</td>
    </tr>    
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">6</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(-0.22°, -42.50°, 1.05°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Left</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">4</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">5</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(0.02°, -18.42°, 0.50°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Left</td>
    </tr>    
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">7</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(-0.31°, 20.57°, -0.52°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">1</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">8</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(-0.68°, 36.83°, -1.44°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">8</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">        
      <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">9</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(0.08°, 11.03°, -0.20°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">5</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">6</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(0.11°, -10.73°, 0.39°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">9</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">10</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(8.08°, -0.12°, 2.05°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right & Up</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">10</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">12</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(13.23°, -3.47°, 3.44°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right & Up</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">9</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">12</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(21.21°, -4.03°, 5.33°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right & Up</td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd; padding:12px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">13</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center;">
        <div style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; line-height: 32px; font-size: 14px;">12</div>
      </td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px; font-family:monospace;">(5.26°, 41.08°, 24.60°)</td>
      <td style="border:1px solid #ddd; padding:8px; text-align:center; font-size: 18px;">Right & Up</td>
    </tr>    
  </tbody>
</table>
</div>

## Conclusion

The EGS method worked successfully for this experiment, allowing accurate alignment of the 3D point clouds and determination of reflection angles.

These results show that EGS can be effectively used in future experiments involving 3D laser vibrometry.

## Code and Data

The full source code and experimental data used are available on [GitHub PhD repository](https://github.com/joaonunovalente/phd).

---

# References
<div><br></div>
<div class="ref-row mb-3" style="font-size: 1.1rem;" id="ref1">
  <div class="ref-index">[1]</div>
  <div >
    D. Bojanić, K. Bartol, J. Forest, T. Petković, and T. Pribanić, “Addressing the generalization of 3D registration methods with a featureless baseline and an unbiased benchmark,” <em>Machine Vision and Applications</em>, vol. 35, no. 3, p. 41, <strong>2024</strong>. <span class="doi-block">DOI: <a href="https://doi.org/10.1007/s00138-024-01510-w" target="_blank">https://doi.org/10.1007/s00138-024-01510-w</a></span>
  </div>
</div>
    

