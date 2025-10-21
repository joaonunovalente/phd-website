---
layout: post
title: "Point Cloud Registration: A case for Exhaustive Grid Search (EGS)"
subtitle: "Using EGS to determine the reflection angles on 3D laser vibrometry"
date: 2025-10-21
background: /img/posts/01.jpg
---

# Point Cloud Registration: A case for Exhaustive Grid Search

## Introduction to Point Cloud Registration

Point cloud registration is a fundamental task in computer vision and robotics, aiming to align two or more 3D point clouds into a common coordinate system. It serves as a cornerstone for numerous applications, including 3D reconstruction, autonomous navigation, object recognition, and augmented or virtual reality.

The goal of registration is to estimate the rigid transformation — composed of a rotation and a translation — that best aligns a source point cloud to a target point cloud. This process is often complicated by challenges such as partial overlap, sensor noise, occlusions, and varying resolutions between scans.

## What is Exhaustive Grid Search?
**Exhaustive Grid Search (EGS)** is a featureless, non-learning method for 3D point cloud registration introduced by Bojanić et al. (2024). Unlike deep learning–based approaches that rely on neural networks to extract and match features, EGS directly explores the entire transformation space to find the best alignment.

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

Test.

> **Info:** Some methods appear in every benchmark, while others are included in only a few.
{: .alert .alert-info}



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

<div id="vibrometer-plot" style="width:100%;max-width:800px;height:400px;margin:auto;"></div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {

  // Node data (label + angle)
  const positions = [
    { num: 1, angle: 0.0 },
    { num: 4, angle: -1 },
    { num: 5, angle: -2 },
    { num: 6, angle: -3 },
    { num: 7, angle: 1 },
    { num: 8, angle: 2 },
    { num: 9, angle: 3 }
  ];

  // X positions correspond to the angle (or any metric you want)
  const x = positions.map(p => p.angle);
  const y = Array(x.length).fill(1); // same Y coordinate for all points

  const trace = {
    x: x,
    y: y,
    mode: 'markers+text',
    text: positions.map(p => p.num),
    textposition: 'middle center',
    marker: {
      size: 40,
      color: 'white',
      line: { color: 'black', width: 2 }
    },
    textfont: { size: 16, color: 'black' },
    type: 'scatter'
  };

  const layout = {
    title: { text: 'Vibrometer Positions'},
    xaxis: {
      title: 'Position [m]',
      zeroline: true,
      range: [-3.5, 3.5],
      tickvals: [-3, -2, -1, 0, 1, 2, 3],
    },
    yaxis: {
      zeroline: true,
      range: [-0.1, 1.2], // only positive part
      tickvals: [-60, 60],
    },
    showlegend: false,
    margin: { t: 80, b: 60, l: 40, r: 40 },
    plot_bgcolor: '#fff'
  };

  Plotly.newPlot('vibrometer-plot', [trace], layout);
});
</script>


EGS can be applied to determine reflection angles in 3D laser vibrometry, where precise alignment of point clouds is critical for accurate measurements. The following table shows an example of rotation transformations between point clouds, which can be used to infer reflection angles:

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

## References

Some text.


