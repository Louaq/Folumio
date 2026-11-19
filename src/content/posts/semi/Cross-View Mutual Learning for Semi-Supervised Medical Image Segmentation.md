---
title: Cross-View Mutual Learning for Semi-Supervised Medical Image Segmentation
published: 2026-01-14 11:11:00
expires: 2026-01-31 23:59:59
description: "半监督医学图像分割因其减轻人工标注负担"
category: 半监督医学图像分割
tags: [ACM MM]
---


::github{repo="SongwuJob/CML"}


:::note
理论很新
:::


## 摘要

Semi-supervised medical image segmentation has gained increasing attention due to its potential to alleviate the manual annotation burden. Mainstream methods typically involve two subnets, and conduct a consistency objective to ensure them producing consistent predictions for unlabeled data. However, they often ignore that the complementarity of model predictions is equally crucial. To realize the potential of the multi-subnet architecture, we propose a novel cross-view mutual learning method with a two-branch co-training framework. Specifically, we first introduce a novel conflict-based feature learning (CFL) that encourages the two subnets to learn distinct features from the same input. These distinct features are then decoded into complementary model predictions, allowing both subnets to understand the input from different views. More importantly, we propose a cross-view mutual learning (CML) to maximize the effectiveness of CFL. This approach requires only modifications to the model inputs and supervisory signals, and implements a heterogeneous consistency objective to fully explore the complementarity ofmodel predictions. Consequently, the aggregated predictions can effectively capture both consistency and complementarity across two subnets. Experimental results on three public datasets demonstrate the superiority of CML over previous SoTA methods. Code is available at https://github.com/SongwuJob/CML

## 翻译

半监督医学图像分割因其减轻人工标注负担的潜力而受到越来越多的关注。主流方法通常涉及两个子网，并执行一致性目标以确保它们对未标记数据产生一致的预测。然而，他们往往忽略了模型预测的互补性同样至关重要。为了实现多子网架构的潜力，我们提出了一种新的跨视图互学习方法，该方法采用两分支协同训练框架。具体来说，我们首先引入了一种新的基于冲突的特征学习(CFL)，它鼓励两个子网从相同的输入中学习不同的特征。然后将这些不同的特征解码为互补的模型预测，允许两个子网从不同的角度理解输入。更重要的是，我们提出了一个跨视图相互学习(CML)，以最大限度地提高CFL的有效性。该方法只需要修改模型输入和监督信号，并实现异构一致性目标，以充分探索模型预测的互补性。因此，聚合的预测可以有效地捕获两个子网之间的一致性和互补性。在三个公共数据集上的实验结果表明，cml方法优于以往的SoTA方法。代码在https://github.com/SongwuJob/CML

## 研究背景

半监督医学图像分割旨在通过少量标注数据结合大量未标注数据缓解手动标注负担，成为研究热点。主流方法多采用双子网架构，通过一致性目标确保对未标注数据的预测一致。然而现有方法普遍忽视模型预测的互补性，未能充分发挥多子网架构潜力。

具体而言，Mean Teacher类方法依赖指数移动平均（EMA）更新教师网络，限制其独立推理能力；协同训练框架虽允许子网从不同视角学习，但缺乏显式约束来维持预测互补性，导致子网在交叉监督下逐渐趋同。作者通过实验观察到：EMA机制使教师网络性能受限于学生网络，浪费学习能力；传统协同训练方法在交叉监督下会丧失视角差异性。因此，如何促使双子网保持视角多样性并实现互补预测，成为提升半监督分割性能的关键问题。

![Snipaste_2026-01-14_13-59-55](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/qMDp/0X0/0343OUec96cB8wBrZQbBZk.webp)

![Snipaste_2026-01-14_14-00-27](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/s1Cz/1149X403/3g3skcaAK46w9hJU80aDeZ.png)

## 研究现状

半监督医学图像分割（SSMIS）通过结合少量标注数据与大量无标注数据，缓解了医学图像标注成本高的问题，主要方法分为两类：

1. **一致性正则化**（如Mean Teacher、FixMatch）：采用师生网络结构，通过EMA维持教师网络稳定性，对无标注数据施加一致性约束，要求模型对相同输入的不同增强版本输出一致预测。
2. **协同训练框架**（如MC-Net、MCF）：使用多子网结构，通过交叉伪监督实现子网间知识迁移，探索多视角一致性，但缺乏显式约束以鼓励子网学习互补语义。

## 提出的模型

![Snipaste_2026-01-14_14-02-46](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/cAH4/1146X862/20ZubVGHWcqgYnF0FTuGHV.png)

本文提出的模型是**Cross-View Mutual Learning (CML)，一种用于半监督医学图像分割的双分支协同训练框架**。其核心设计目标是通过增强模型预测的互补性和一致性，充分利用未标记数据，缓解医学图像标注成本高的问题。

### **模型核心组件**

1. **冲突特征学习（Conflict-based Feature Learning, CFL）**
   - **目标**：强制两个子网从同一输入中学习**不同视角的特征**，生成互补的预测结果。
   - **实现**：通过最小化两个子网编码器输出特征的余弦相似度（式1），最大化特征空间的差异，使解码器能从不同语义角度解析输入。
2. **跨视角互学习（Cross-View Mutual Learning, CML）**
   - **目标**：在CFL基础上，通过修改输入和监督信号，保留子网的互补性，同时确保预测一致性。
   - **实现**：
     - **CutMix数据增强**：对输入图像和标签（或伪标签）进行混合（式5-9），增强数据多样性并构造异质监督信号。
     - **异质一致性目标**：结合两个子网的伪标签生成混合监督信号（式10），使每个子网既能学习自身视角，又能吸收另一子网的互补信息。

### **训练流程**

1. **预训练**：仅使用标记数据，通过CFL学习特征差异，并结合监督损失（式11）初始化模型。
2. **自训练**：联合优化标记数据监督损失（L<sub>sup</sub>）、未标记数据异质一致性损失（L<sub>u</sub><sup>sup</sup>）和特征差异损失（L<sub>dis</sub>），总损失如式（4）。
3. **推理**：融合两个子网的预测结果（平均概率后取argmax）。

### **创新点**

- **显式互补性约束**：通过CFL强制子网学习不同特征，突破传统方法仅关注一致性的局限。
- **异质监督信号**：结合CutMix和双子网伪标签，避免交叉监督导致的视角趋同问题。
- **结构兼容性**：无需修改网络架构，可嵌入任意分割模型（如3D V-Net、2D U-Net）。

## 实验（Compared with SOTA）

> 数据集：
>
> - **LA数据集**：包含100例 gadolinium增强MRI心脏扫描，目标为左心房分割，分辨率0.625×0.625×0.625 mm³。
> - **ACDC数据集**：包含100例心脏 cine-MRI，需分割左心室（LV）、右心室（RV）和心肌（MYO）。
> - **BraTS2019数据集**：包含335例多模态（FLAIR、T1、T1ce、T2）脑肿瘤扫描，分辨率1 mm³。
>
> 评估指标：
>
> - **Dice系数（%）**：衡量分割区域重叠度，值越高越好。
> - **95% Hausdorff距离（95HD，体素）**：评估边缘相似度，值越低越好。
> - **平均表面距离（ASD，体素）**：衡量预测与真实边缘的平均距离，值越低越好。



- **对比方法**：与7种半监督分割SOTA方法比较，包括UA-MT、SASSNet、DTC、URPC、MC-Net、SS-Net、MCF等。
- **标签比例**：在LA和ACDC数据集上测试5%和10%的标注数据比例；在BraTS2019上测试10%和20%标注数据。
- **网络与训练**：
  - 骨干网络：3D V-Net（LA和BraTS）、2D U-Net（ACDC）。
  - 数据增强：随机裁剪、翻转、旋转，以及CutMix操作（混合输入图像和标签）。
  - 优化器：SGD，初始学习率0.01，批大小8（LA/BraTS）或24（ACDC）。
  - 损失函数：监督损失（Dice+交叉熵）、特征差异损失（CFL）、异构一致性损失（CML）。



## 实验（Ablation Experiments）​​

![Snipaste_2026-01-14_14-09-30](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/A2Cl/566X448/3TH0opySZFx3TFy3mN4ZPw.png)



![Snipaste_2026-01-14_14-08-01](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/B5eM/1077X359/0jsmKo9aHnCg67jgwl6PRR.png)



CML方法通过**冲突特征学习（CFL）** 和**跨视角互学习（CML）**，在三个数据集上均显著优于现有SOTA方法，尤其在低标注比例下（5%~10%）提升明显，验证了其在半监督医疗影像分割中的有效性。



## 结论

本文提出了一种用于半监督医学图像分割的**新型交叉视图互学习（CML）方法**。具体而言，首先引入基于冲突的特征学习（CFL）范式，通过强特征级约束促使两个子网编码交叉视图的互补语义；在此基础上，进一步采用CutMix操作构建异构一致性目标，以充分挖掘模型预测的互补性。需要强调的是，该CML方法不改变原始网络结构，因此可轻松集成到不同的分割模型中。在三个数据集上进行的大量实验证明了CML的卓越分割性能。





