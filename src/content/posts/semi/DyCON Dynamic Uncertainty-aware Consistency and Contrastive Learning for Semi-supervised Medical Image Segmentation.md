---
title: DyCON Dynamic Uncertainty-aware Consistency and Contrastive Learning for Semi-supervised Medical Image Segmentation
published: 2026-01-12 16:36:00
expires: 2026-01-31 23:59:59
description: "医学图像分割中的半监督学习"
category: 半监督医学图像分割
tags: [CVPR]
---


::github{repo="CVML-KU/DyCON"}


:::note
本文注重理论的解释和通过实验证明
:::

## 摘要

Semi-supervised learning in medical image segmentation leverages unlabeled data to reduce annotation burdens through consistency learning. However, current methods struggle with class imbalance and high uncertainty from pathology variations, leading to inaccurate segmentation in 3D medical images. To address these challenges, we present DyCON, a Dynamic Uncertainty-aware Consistency and Contrastive Learning framework that enhances the generalization of consistency methods with two complementary losses: Uncertainty-aware Consistency Loss (UnCL) and Focal Entropy-aware Contrastive Loss (FeCL). UnCL enforces global consistency by dynamically weighting the contribution of each voxel to the consistency loss based on its uncertainty, preserving high-uncertainty regions instead of filtering them out. Initially, UnCL prioritizes learning from uncertain voxels with lower penalties, encouraging the model to explore challenging regions. As training progress, the penalty shift towards confident voxels to refine predictions and ensure global consistency. Meanwhile, FeCL enhances local feature discrimination in imbalanced regions by introducing dual focal mechanisms and adaptive confidence adjustments into the contrastive principle. These mechanisms jointly prioritizes hard positives and negatives while focusing on uncertain sample pairs, effectively capturing subtle lesion variations under class imbalance. Extensive evaluations on four diverse medical image segmentation datasets (ISLES’22, BraTS’19, LA, Pancreas) show DyCON’s superior performance against SOTA methods.

## 翻译

医学图像分割中的半监督学习利用未标记数据通过一致性学习来减少标注负担。然而，目前的方法与类别不平衡和病理变化的高不确定性作斗争，导致3D医学图像的分割不准确。为了解决这些挑战，我们提出了DyCON，一个动态不确定性感知一致性和对比学习框架，它增强了具有两种互补损失的一致性方法的泛化:不确定性感知一致性损失(UnCL)和焦点熵感知对比损失(FeCL)。UnCL通过动态加权每个体素对基于其不确定性的一致性损失的贡献来强制全局一致性，保留高不确定性区域而不是过滤它们。最初，unl优先从不确定的体素中学习，惩罚较低，鼓励模型探索具有挑战性的区域。随着训练的进展，惩罚转向自信体素，以改进预测并确保全局一致性。同时，FeCL通过在对比原理中引入双焦点机制和自适应置信度调整，增强了不平衡区域的局部特征辨别能力。这些机制共同优先考虑硬阳性和阴性，同时关注不确定的样本对，有效地捕捉到类别不平衡下的细微病变变化。对四种不同医学图像分割数据集(ISLES ' 22, BraTS ' 19, LA，胰腺)的广泛评估表明，DyCON的性能优于SOTA方法。

## 研究背景

![Snipaste_2026-01-12_19-02-02](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/zj0n/0X0/0343OUooV50W0OPZRFq1Y5.webp)

在医学图像分割领域，半监督学习（SSL）通过利用未标记数据减轻标注负担，已成为重要研究方向。然而，现有方法在处理3D医学图像时面临两大核心挑战：一是**病理变化导致的高度不确定性**，二是**类别不平衡问题**（如病变体素远少于背景体素），这导致分割结果不准确、边界定义模糊。

现有不确定性感知方法多依赖蒙特卡洛 dropout 或深度集成生成多个预测，通过阈值过滤不可靠区域，或利用双解码器/子网络生成差异掩码排除不确定区域。但这些方法因丢弃高不确定性体素，忽视了全局成像上下文，尤其在病变分布分散或不规则时性能受限。此外，对比学习虽能提升特征判别性，但存在采样偏差和类别冲突问题，且未区分样本对难度，在高度不平衡数据中效果有限。

为此，本文提出 DyCON 框架，通过**动态不确定性感知一致性损失（UnCL）**和**焦点熵感知对比损失（FeCL）**，分别从全局和局部层面解决上述问题，提升半监督医学图像分割的泛化能力。

## 研究现状

### 1. **半监督医学图像分割的主流策略**

- **伪标签法**：通过自训练为无标签数据生成伪标签以扩充训练集，如文献[2,20,27,40]利用伪标签结合交叉域信息提升性能。
- **一致性学习**：通过数据扰动或多模型协作增强预测一致性，主流框架包括Mean-Teacher（MT）[35,50,52]、Co-Training[3,8,37]及双解码器互一致性方法[12,33,40]。

### 2. **现有方法的核心挑战**

- **类别不平衡**：病变体素远少于背景体素，导致模型倾向于忽略小病灶区域。
- **高不确定性**：病理变化（如病灶大小、形状差异）导致预测可靠性低，尤其在3D医学图像中边界模糊问题突出。
- **全局上下文缺失**：现有方法（如[16,37,44,52]）通过过滤高不确定性体素或双解码器差异掩码排除“不可靠”区域，导致全局成像上下文利用不足，对散在或不规则病灶分割效果差（见图8）。

### 3. **不确定性感知方法的局限性**

- **过滤机制缺陷**：依赖蒙特卡洛 dropout 或深度集成估计不确定性时，通常过滤高方差区域，丢失潜在有用信息[20,23,29,32,42,49]。
- **计算成本高**：双解码器或子网络差异方法[37,39]需额外计算资源，且仅聚焦局部区域修正，忽略全局一致性。

### 4. **对比学习在医学分割中的瓶颈**

- **采样偏差与类别碰撞**：现有对比学习方法[6,16,22,34]未区分样本对难度，对难区分样本（如边界模糊区域）处理不足，在类别不平衡数据中性能受限[5,9]。

### 5. **本文的改进动机**

针对上述问题，DyCON提出动态不确定性感知的一致性损失（UnCL）和聚焦熵感知对比损失（FeCL），通过保留高不确定性区域并动态调整权重，同时增强局部特征辨别力，以解决全局一致性与类别不平衡问题。

## 提出的模型

![Snipaste_2026-01-12_19-07-54](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/H3ux/1128X580/3CAGsw057dptEhGcKEOoPx.png)

本文提出的模型是**DyCON**（Dynamic Uncertainty-aware Consistency and Contrastive Learning），这是一个用于半监督医学图像分割的动态不确定性感知一致性与对比学习框架。其核心设计目标是解决医学图像分割中因类别不平衡和病理变化导致的高不确定性问题，提升模型对复杂病变区域的分割精度。

### DyCON的核心创新：

1. **UnCL（Uncertainty-aware Consistency Loss，不确定性感知一致性损失）**
   - **动态权重调整**：基于体素级熵（不确定性度量）动态调整每个体素对一致性损失的贡献，而非过滤高不确定性区域。
   - **训练阶段自适应**：训练初期优先学习不确定性区域（低惩罚），随训练进展逐渐转向高置信区域（高惩罚），实现全局一致性。
   - **公式表达**：
     ![Snipaste_2026-01-12_19-09-49](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/1sa0/572X157/7ffduBDjVzOGDKFqSFi0qH.png)
2. **FeCL（Focal Entropy-aware Contrastive Loss，焦点熵感知对比损失）**
   - **双重焦点机制**：通过焦点权重，优先关注难分正负样本对（如低相似度正样本和高相似度负样本）。
   - **不确定性感知**：结合Gambling Softmax熵$H_{gs}$调整权重，增强对模糊边界区域的关注。
   - **跨网络硬负样本挖掘**：从教师模型中选取与学生模型高相似的负样本，提升特征判别性。

### 整体框架：

- **基础架构**：基于Mean-Teacher（MT）范式，包含学生模型和教师模型（教师模型为学生模型的指数移动平均）。
- **损失函数组合**：
  ![Snipaste_2026-01-12_19-10-50](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/YjHY/536X82/4Lbl4PUClRvP81DJWBNagp.png)

### 核心优势：

1. **全局与局部不确定性处理**：UnCL处理全局体素级不确定性，FeCL优化局部特征判别性。
2. **类别不平衡鲁棒性**：通过硬样本挖掘和动态权重，缓解背景-病灶样本比例失衡问题。
3. **通用性**：可集成于任意半监督框架（如MT、Co-Training），无需修改训练 pipeline。

## 实验（Compared with SOTA）

- **数据集**：
  - **ISLES’22**：250例3D MRI脑卒中病灶数据，使用DWI序列，评估小病灶和散在病灶分割能力。
  - **BraTS’19**：335例脑肿瘤MRI数据，关注T2-FLAIR序列的全肿瘤分割。
  - **LA**：100例左心房MRI数据，评估器官边界分割精度。
  - **Pancreas-CT**：82例胰腺CT数据，验证对邻近器官干扰的鲁棒性。
- **标注比例**：采用5%、10%、20%的标注数据，其余为无标注数据，模拟半监督场景。
- **基线模型**：使用3D UNet/VNet作为骨干网络，对比Mean-Teacher（MT）、Co-Training（CT）等10余种主流半监督方法。



> 在四个数据集上的对比实验结果

![Snipaste_2026-01-12_19-12-52](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Ty46/714X838/5ZkFU1LuIUXZUosl8MxzkS.png)



![Snipaste_2026-01-12_19-12-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/pY1l/683X601/36iJaI6fVG1562S2Oylxw6.png)



![Snipaste_2026-01-12_19-13-07](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Cxau/685X575/03ob8SiM6i2vWX45aZmiyK.png)



![Snipaste_2026-01-12_19-13-12](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/TxzK/691X317/2Q5dXRG7LJhJkNYigb6x5J.png)



- **ISLES’22（5%标注）**：
  DyCON的Dice分数达61.48%，显著优于BCP（53.53%）和GALoss（53.29%），HD95降低至17.61（单位：mm），ASD仅0.75。
- **BraTS’19（10%标注）**：
  Dice分数87.05%，超越CML（85.26%）和UA-MT（82.82%），HD95为7.41，接近全监督3D-UNet（7.21）。
- **LA（5%标注）**：
  3D UNet+DyCON的Dice达90.96%，VNet+DyCON进一步提升至91.18%，HD95仅5.16。
- **Pancreas-CT（20%标注）**：
  Dice分数84.81%，优于BCP（82.91%）和UA-MT（77.26%），HD95降至5.41。

## 实验（Ablation Experiments）​​

![Snipaste_2026-01-12_19-14-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/FDHI/838X475/3juC0fCYnJSprV0IKPp5XQ.png)

![Snipaste_2026-01-12_19-15-04](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/zjuz/839X302/3tT9gCLtSMJooENdjsb7ln.png)



- **UnCL的有效性**：
  对比不同β值（动态调整vs固定值），动态β策略使ISLES’22的Dice从60.97%（β=0.5）提升至64.52%，BraTS’19从83.11%提升至85.97%。
- **FeCL的组件分析**：
  双焦点机制（F++F−）+ 熵感知（Entropy）+ 跨网络难负样本（HN）组合最优，ISLES’22的Dice达66.07%，较仅用F++F−提升2.29%。



![Snipaste_2026-01-12_19-16-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/0fA4/1043X739/7CayIqpiXf08k3EhUwHRUI.png)

## 结论

我们提出了DyCON，这是一种半监督框架，用于在有限监督下解决医学图像分割中由于病变变异和类别不平衡引起的不确定性。DyCON通过两个专门的损失函数改进了一致性框架的鲁棒性：UnCL利用熵（不确定性的代理）在训练初期指导模型关注模糊区域，并逐渐转向自信的预测；FeCL通过增强局部辨别来补充UnCL，以强调难以处理和不确定的样本，从而有效解决类别不平衡问题。大量实验证实了DyCON在边界精度和分割准确性上优于现有的SSL方法。





