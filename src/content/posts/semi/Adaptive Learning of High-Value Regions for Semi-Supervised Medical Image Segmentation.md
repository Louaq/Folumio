---
title: Adaptive Learning of High-Value Regions for Semi-Supervised Medical Image Segmentation
published: 2026-01-19 20:44:00
expires: 2026-01-31 23:59:59
description: "现有的半监督学习方法通常"
category: 半监督医学图像分割
tags: [ICCV]
---

::github{repo="ziziyao/ALHVR"}


## 摘要

Existing semi-supervised learning methods typically mitigate the impact of unreliable predictions by suppressing low-confidence regions. However, these methods fail to explore which regions hold higher learning value and how to design adaptive learning strategies for these regions. To address these issues, we propose a novel adaptive learning of high-value regions (ALHVR) framework. By exploiting the diversity ofpredictions from dual-branch networks, the prediction regions are classified into three groups: reliable stable region, reliable unstable region, and unreliable stable region. For high-value regions (reliable unstable region and unreliable stable region), different training strategies are designed. Specifically, for reliable unstable region, we propose a confidence-guided cross-prototype consistency learning (CG-CPCL) module, which enforces prototype consistency constraints in the feature space. By leveraging confidence information, the high-confidence predictions from one network selectively supervise the low-confidence predictions from the other, thus helping the model learn inter-class discrimination more stably. Additionally, for unreliable stable region, we design a dynamic teacher competition teaching (DTCT) module, which dynamically selects the most reliable pixels as teachers by evaluating the unperturbed predictions from both networks. These selected pixels are then used to supervise perturbed predictions, thereby enhancing the model’s learning capability in unreliable region. Experimental results show that our method outperforms state-of-the-art approaches on three public datasets. Code is available at https://github.com/ziziyao/ALHVR.

## 翻译

现有的半监督学习方法通常通过抑制低置信度区域来减轻不可靠预测的影响。然而，这些方法未能探索哪些区域具有更高的学习价值以及如何针对这些区域设计自适应学习策略。为了解决这些问题，我们提出了一种新的高价值区域自适应学习(ALHVR)框架。利用双分支网络预测的多样性，将预测区域分为可靠稳定区域、可靠不稳定区域和不可靠稳定区域三组。对于高值区域(可靠不稳定区域和不可靠稳定区域)，设计了不同的训练策略。具体而言，对于可靠的不稳定区域，我们提出了一个置信度引导的跨原型一致性学习(CG-CPCL)模块，该模块在特征空间中强制原型一致性约束。通过利用置信度信息，来自一个网络的高置信度预测有选择地监督来自另一个网络的低置信度预测，从而帮助模型更稳定地学习阶级间歧视。此外，对于不可靠的稳定区域，我们设计了一个动态教师竞争教学(DTCT)模块，该模块通过评估来自两个网络的无扰动预测来动态选择最可靠的像素作为教师。然后使用这些选定的像素来监督扰动预测，从而增强模型在不可靠区域的学习能力。实验结果表明，我们的方法在三个公共数据集上优于最先进的方法。代码可从https://github.com/ziziyao/ALHVR

## 研究背景

![Snipaste_2026-01-19_20-45-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/MrRI/0X0/0343OUBz1qPBfQH1AhZhOy.webp)

![Snipaste_2026-01-19_20-49-22](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/tAH3/575X265/7kZDsuA3YPnhbICxdOhKKj.png)

在半监督医学图像分割中，现有方法多通过抑制**低置信区域**减轻不可靠预测影响，但未能明确高值学习区域及针对性学习策略。医学图像组织解剖结构复杂，目标区域与周围组织边界模糊，导致模型在边界区域分割困难。单网络预测存在偏差，基于双网络预测的方法（如MCF、MLRP）虽尝试解决此问题，但仍存在处理双网络均错误预测的局限性，且缺乏对高价值区域（如组织边界等分割难点区域）的自适应学习策略。此外，现有方法依赖简单一致性损失，未针对不同区域数据特征设计差异化训练策略，限制了模型在关键区域的学习能力。因此，本文旨在通过分析双分支网络预测多样性，识别高价值区域并设计自适应学习策略，以提升半监督医学图像分割性能。

## 研究现状

半监督医学图像分割通过少量标注数据与大量未标注数据结合，缓解标注成本高的问题。主流方法分为两类：

1. **一致性正则化**：基于平滑假设，通过数据/模型/特征层面扰动（如MT的EMA教师模型、CPS的双网络独立训练）强制预测一致性；
2. **伪标签方法**：基于聚类假设，生成高置信伪标签（如FixMatch保留高置信预测、MLRP通过熵选择可靠伪标签）。

近年来，不确定性引导策略成为研究热点，通过蒙特卡洛 dropout、熵或置信度区分像素可靠性（如UA-MT仅训练低不确定性像素、UFC区分高低性能像素）。

## 提出的模型

![Snipaste_2026-01-19_20-51-26](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Tnqe/1143X732/28KBVlBSqDhCCqoSkUS3yF.png)

### **1. 高值区域分类**

基于双分支网络预测的置信度差异，将像素分为三类区域：

- **可靠稳定区域（Ω₁）**：双网络置信度均高于阈值，易学习，价值较低。
- **可靠不稳定区域（Ω₂）**：一个网络置信度高、另一个低，反映预测歧义，学习价值高。
- **不可靠稳定区域（Ω₃）**：双网络置信度均低于阈值，不确定性高，学习价值高。

**分类依据**：通过自适应阈值γ（基于当前批次数据动态计算）划分区域，公式如下：
Ω₁ = {cona₂ ≥ γ ∧ conb₂ ≥ γ}
Ω₂ = {(cona₂ > γ ∧ conb₂ < γ) ∨ (cona₂ < γ ∧ conb₂ > γ)}
Ω₃ = {cona₂ < γ ∧ conb₂ < γ}

### **2. 核心模块设计**

#### **（1）置信度引导的跨原型一致性学习（CG-CPCL）**

**目标**：优化可靠不稳定区域（Ω₂），解决模型预测分歧问题。
**方法**：

- **原型构建**：计算每个类别的特征原型（class prototype）作为全局参考，通过伪标签筛选特征并取均值生成。
- **跨原型一致性约束**：强制扰动特征与另一网络的原型特征保持余弦相似度，增强类内一致性。
- **置信度条件引导**：仅允许低置信度预测从高置信度预测中学习，避免噪声干扰。

**损失函数**：

- 交叉熵损失（Lce）：约束特征与原型的分类一致性。
- 余弦相似度损失（Lcos）：优化特征与原型的距离，公式为：
  Laₚc = Lce(Fᵈₐ₂, pcᵦ₁) + Lcos(Fᵈₐ₂, pcᵦ₁)

#### **（2）动态教师竞争教学（DTCT）**

**目标**：优化不可靠稳定区域（Ω₃），提升低置信度区域的预测可靠性。
**方法**：

- **动态教师选择**：比较双网络未扰动预测的置信度，选择高置信度像素作为“教师”。
- **概率锐化**：对教师预测应用 sharpening 函数（T=0.1），增强伪标签的置信度分布。
- **不确定性正则化**：引入预测熵（H）作为正则项，降低模型在高不确定性区域的偏差。

**损失函数**：

- 均方误差损失（Lmse）：约束扰动预测与教师伪标签的一致性。
- 熵损失（H）：量化不确定性并最小化，公式为：
  Laₘₕ = Lmse(ŷₐ₂, ŷₛₚₜ) + H(ŷₐ₁) + H(ŷₐ₂)

### **3. 总损失函数**

- **有监督损失**：交叉熵损失（Lce）+ Dice损失，用于标注数据训练。
- **无监督损失**：CG-CPCL损失（Laₚc）+ DTCT损失（Laₘₕ），用于未标注数据的高价值区域学习。
- **总损失**：La = Laₛ + λLaᵤ，其中λ为高斯升温函数（平衡监督与无监督损失）。

## 实验（Compared with SOTA）



> - **数据集**
>   - **ACDC**：100例心脏MRI扫描，3类（右心室、左心室、心肌），按70/10/20划分训练/验证/测试集。
>   - **AbdomenCT-1K**：1000+腹部CT扫描，4类（肝、肾、脾、胰腺），30例训练，11例测试。
>   - **Brats**：335例脑胶质瘤MRI，250/25/60划分训练/验证/测试集。
> - **评估指标**
>   - **区域敏感**：Dice系数、Jaccard指数；
>   - **边缘敏感**：95% Hausdorff距离（95HD）、平均表面距离（ASD）。

![Snipaste_2026-01-19_20-55-44](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/MlA9/688X594/5Rg4wQkXv7W8bEiqRmq3P3.png)

![Snipaste_2026-01-19_20-55-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5Vd0/708X604/22ELAVRIyAoprWOHny25XT.png)

![Snipaste_2026-01-19_20-56-20](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/suJw/887X470/0P3od1dxnsL1aylBXSzXQc.png)

与10种主流半监督分割方法（如MT、CPS、MCF、EVIL等）对比，结果显示ALHVR在所有数据集上均显著优于现有方法：

- **ACDC（10%标记数据）**：Dice达90.56%，较次优方法EVIL提升3.31%；
- **AbdomenCT-1K（5%标记数据）**：Dice达84.75%，较次优方法MC-Net提升3.78%；
- **Brats（10%标记数据）**：Dice达85.14%，较次优方法MLRP提升1.18%。



![Snipaste_2026-01-19_20-57-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/zyHR/687X699/1UaxQlo71QTrmVDA8ImnMm.png)

在ACDC和AbdomenCT-1K数据集上，ALHVR对器官边界和精细结构的分割精度显著优于对比方法（如EVIL、MLRP），尤其在心肌、胰腺等复杂区域表现更优。

## 实验（Ablation Experiments）​​

![Snipaste_2026-01-19_20-56-49](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/CjjG/582X349/6djJDHLdoN5Y0sZUSRII2R.png)

![Snipaste_2026-01-19_20-56-55](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/NYG2/579X187/03NmrfMEWXNP6bbYbwbfX6.png)



验证核心模块（CG-CPCL、DTCT）的有效性：

- **单独使用CG-CPCL**：ACDC数据集Dice提升0.86%，通过跨原型一致性约束增强类间区分性；
- **单独使用DTCT**：Brats数据集Dice提升1.65%，通过动态教师竞争优化不可靠区域学习；
- **联合使用**：所有数据集性能最优，ACDC的Dice从88.58%提升至90.56%，证明区域自适应策略的必要性。

 超参数分析：

- **自适应阈值参数β**：控制低置信度像素比例，在ACDC（β=0.8）、AbdomenCT-1K/Brats（β=0.7）时性能最佳，平衡高/低价值区域学习。

## 结论

本文提出了一种新型半监督学习框架ALHVR，通过探索高价值学习区域并设计自适应训练策略提升医学图像分割性能。主要结论如下：

1. **高价值区域划分**
   将预测区域分为**可靠稳定区、可靠不稳定区和不可靠稳定区**，实验证实后两者为高价值学习区域（通过ACDC数据集掩膜实验，掩盖可靠稳定区时Dice值最高达88.58%）。
2. **区域自适应训练策略**
   - **可靠不稳定区**：提出置信度引导交叉原型一致性学习（CG-CPCL）模块，通过构建类原型和置信度约束，使低置信预测从高置信预测中学习，增强类间判别性。
   - **不可靠稳定区**：设计动态教师竞争教学（DTCT）模块，通过像素级可靠性评估动态选择可靠像素作为教师，监督扰动预测，减少噪声干扰。
3. **实验验证**
   在ACDC、AbdomenCT-1K和Brats三个数据集上，ALHVR均优于现有SOTA方法。例如，ACDC数据集在10%标记数据下Dice达90.56%，较EVIL提升3.31%；Brats数据集Dice达85.14%，较MLRP提升1.18%。
4. **模块有效性**
   消融实验表明，CG-CPCL和DTCT模块分别提升各数据集Dice值1.65%-4.79%，二者结合可进一步提升性能（ACDC数据集Dice从88.58%提升至90.56%）。





