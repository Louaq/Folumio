---
title: Inconsistency-Aware Uncertainty Estimation for Semi-Supervised Medical Image Segmentation
published: 2025-11-25 12:00:00
expires: 2025-12-21 23:59:59
mathjax: true
category: 半监督医学图像分割
tags: [半监督医学图像分割]
description: In semi-supervised medical image segmentation
---


:::note
理论性较强！！！
:::

::github{repo="koncle/CoraNet"}


## 摘要

In semi-supervised medical image segmentation,most previousworks drawon the common assumption that **higher entropy means higher uncertainty**. In this paper, we investigate a novel method of estimating uncertainty. We observe that, when assigned different misclassification costs in a certain degree, if the segmentation result of a pixel becomes inconsistent, this pixel shows a relative uncertainty in its segmentation. Therefore, we present a new semi-supervised segmentation model, namely, conservative-radical network (CoraNet in short) based on our uncertainty estimation and separate self-training strategy. In particular, our CoraNet model consists of three major components: a conservative-radical module (CRM), a certain region segmentation network (C-SN), and an uncertain region segmentation network (UC-SN) that could be alternatively trained in an end-to-end manner. We have extensively evaluated our method on various segmentation tasks with publicly available benchmark datasets, including CT pancreas, MR endocardium, and MR multi-structures segmentation on the ACDC dataset. Compared with the current state of the art, our CoraNet has demonstrated superior performance. In addition, we have also analyzed its connection with and difference from conventional methods of uncertainty estimation in semi-supervised medical image segmentation.

## 翻译

在半监督医学图像分割中，之前的大多数研究都基于一个常见的假设，即更高的熵意味着更高的不确定性。在本文中，我们研究了一种新的不确定性估计方法。我们观察到，当在一定程度上分配不同的误分类成本时，如果一个像素的分割结果变得不一致，这个像素在其分割中表现出相对的不确定性。因此，我们提出了一种新的半监督分割模型，即基于我们不确定性估计和独立自训练策略的保守激进网络（简称CoraNet）。特别是，我们的CoraNet模型由三个主要组件组成：保守激进模块（CRM）、确定区域分割网络（C-SN）和不确定区域分割网络（UC-SN），它们可以以端到端的方式交替训练。我们在各种分割任务上对我们的方法进行了广泛评估，使用了公开可用的基准数据集，包括CT胰腺、MR心内膜和ACDC数据集上的MR多结构分割。与当前最先进的方法相比，我们的CoraNet表现出了卓越的性能。此外，我们还分析了其与传统半监督医学图像分割不确定性估计方法的联系和差异。



## 研究背景

医学图像分割中，精确的**器官和组织边界分割**是重要但具有挑战性的任务。传统深度学习分割模型多采用全监督学习，需大量人工标注数据，而医学图像标注耗时费力且易受主观因素影响，限制了模型在临床场景的部署。半监督学习可利用大量未标注图像缓解这一问题，但现有半监督分割方法多基于“**熵值越高不确定性越大**”的假设估计不确定性，通过设定阈值区分可靠区域，存在两方面问题：一是初始伪标签预测易引入误差并传播；二是将确定性和不确定性区域输入同一网络，难以充分利用确定性区域信息且可能低估不确定性区域复杂性。因此，本文旨在从新视角估计不确定性并分别处理不同区域分割，提出保守-激进网络（CoraNet）框架。



## 研究现状

1. **监督学习主导**：基于深度学习的医学图像分割模型（如U-Net及其变体）依赖大量精确标注数据，在CT/MRI等模态取得高精度，但标注耗时且易受主观因素影响。
2. **半监督学习兴起**：通过少量标注数据与大量无标注数据结合，缓解标注压力，主流方法分为熵最小化（EM）和一致性正则化（CR）两类，如Mean Teacher、UA-MT等模型。
3. **不确定性估计方法**：传统方法基于像素熵值或置信度阈值（如softmax输出）区分可靠区域，但依赖经验阈值，难以平衡精度与召回率。



## 提出的模型

![Snipaste_2025-11-26_09-43-28](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/t9b1/1265X424/7hzBIZ910PkXFbYzpbYqA2.png)



本文提出的半监督医学图像分割模型为**Conservative-Radical Network（CoraNet，保守-激进网络）**，其核心创新在于通过**不一致性感知的不确定性估计**和**分离自训练策略**，解决传统半监督分割中对标注数据依赖强、不确定性估计单一的问题。

### **CoraNet模型结构**

模型包含三个关键组件，以端到端交替训练方式协同工作：

#### 1. **保守-激进模块（Conservative-Radical Module, CRM）**

- **功能**：通过引入不同误分类成本，生成像素级不确定性掩码，区分“确定区域”和“不确定区域”。
- **实现**：
  - 共享编码器（Encoder）与三个独立解码器（Decoder）：主解码器（D）、保守解码器（Dcon）、激进解码器（Drad）。
  - **保守设置**：对背景类（class 0）赋予高误分类成本（权重α=5），倾向于少预测前景（如器官区域），避免假阳性。
  - **激进设置**：对前景类（class 1）赋予高误分类成本（权重α=5），倾向于多预测前景，避免假阴性。
  - **不确定性定义**：通过保守与激进解码器输出的**像素级异或（XOR）操作**，将预测不一致的区域标记为“不确定区域”，一致区域标记为“确定区域”（见图1）。

#### 2. **确定区域分割网络（Certain Region Segmentation Network, C-SN）**

- **功能**：利用确定区域的高置信度伪标签进行自训练，补充标注数据。
- **实现**：对确定区域的预测结果直接作为伪标签，通过交叉熵损失优化主解码器，强化模型对高置信区域的学习。

#### 3. **不确定区域分割网络（Uncertain Region Segmentation Network, UC-SN）**

- **功能**：针对不确定区域（如边界、模糊区域）采用更鲁棒的标签分配策略，减少误差传播。
- **实现**：引入**均值教师模型（Mean Teacher）**，通过学生模型（主解码器）与教师模型（权重滑动平均）的一致性约束（MSE损失），优化不确定区域的预测。

## 实验（Compared with SOTA）

1. **数据集**
   - **CT胰腺分割**：82个对比增强腹部CT容积数据，图像大小512×512×181至512×512×466体素，预处理包括强度归一化（[-100, 240]）、裁剪（192×240）和数据增强（旋转、缩放、翻转）。
   - **MR心内膜分割**：7,980张心脏MR图像（256×256像素），目标为左心室（LV）心内膜边界分割。
   - **ACDC多结构分割**：100个 cine MR序列，需分割右心室（RV）、左心室（LV）和心肌（Myo）三类结构，图像统一resize为256×256像素。
2. **模型配置**
   - 骨干网络：2D实验采用U-Net，3D实验采用V-Net和ResNet-18。
   - 训练参数：Adam优化器（学习率0.001，β=(0.5, 0.999)），批大小4，α=5（错分成本权重），平衡损失权重1:1。
   - 评估指标：Dice相似系数（DSC）、精确率（Precision）、召回率（Recall）、Hausdorff距离（HD）、Jaccard指数、平均表面距离（ASD）。

### 二、主要实验内容

1. **不确定性估计方法验证**
   - **CRM模块可靠性**：对比传统基于softmax置信度的阈值法（阈值0.5/0.7/0.9），在初始预测阶段，CoraNet的关键成功指数（CSI）更高，且能更好平衡精确率与召回率，减少后续误差传播。
   - **不同不确定性方法对比**：替换CRM为测试增强、MC Dropout、随机不确定性等方法，CoraNet在2D/3D胰腺分割任务上的DSC均显著优于对比方法（2D：67.01% vs 58.2-63.5%；3D：78.3% vs 72.1-76.5%）。
2. **分离自训练策略有效性**
   - **组件消融实验**：在CT胰腺分割上验证各模块作用：
     - 仅使用主分割损失（seg）：DSC=58.2%
     - seg+自训练（无掩码）：DSC=62.3%
     - seg+自训练（带掩码）：DSC=64.1%
     - seg+均值教师（带掩码）：DSC=65.7%
     - 完整模型（ours）：DSC=67.01%
   - **不确定性区域动态变化**：训练过程中，不确定性区域从前景中心逐渐迁移至边界，验证模型对复杂区域的逐步学习能力。
3. **与现有方法的对比**
   - **CT胰腺分割**：在2D和3D设置下均优于当前SOTA方法（如UA-MT、UMCT、ADVNET），3D实验中DSC达78.3%（对比UMCT的77.6%），且训练时间更短（3小时 vs 24小时）。
   - **MR心内膜分割**：DSC=89.2%，显著高于均值教师（81.5%）和UA-MT（83.7%）。
   - **ACDC多类分割**：平均DSC=85.6%，超过伪标签法（76.3%）、VAT（78.5%）和均值教师（81.2%），接近全监督上限（87.3%）。
4. **超参数敏感性分析**
   - **错分成本权重α**：在α=2/5/10中，α=5时性能最优（胰腺DSC=67.01%，心内膜DSC=89.2%），过大会引入噪声，过小则不确定性区域划分粗糙。

### 三、实验结论

CoraNet通过基于成本敏感学习的不确定性估计（CRM模块）和分离自训练策略，在单类/多类医学图像分割任务中均实现了优于现有方法的性能，且保持了训练和推理效率。



## 结论

在半监督医学图像分割中，如何估计和处理不确定性仍是一个关键问题。本文通过捕捉多成本敏感设置之间的不一致预测，提出了一种新的不确定性估计方法。该不确定性定义直接依赖分类输出，无需任何预定义的边界感知假设。基于此定义，本文还提出了一种分离自训练策略，对确定区域和不确定区域进行差异化处理。为实现端到端训练，本文开发了保守-激进模块（CRM）、确定区域分割网络（C-SN）和不确定区域分割网络（UC-SN）三个组件来训练半监督分割模型。通过在CT胰腺、MR心内膜和多类别ACDC分割等多种医学图像分割任务上的广泛评估，结果表明该方法在分割精度上优于其他相关基线方法。



> 思考：本文提出的基于不一致性不确定性评估的方法是一个新颖的思路，可以参考这个

