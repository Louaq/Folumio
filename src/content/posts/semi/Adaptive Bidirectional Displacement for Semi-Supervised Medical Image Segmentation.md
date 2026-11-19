---
title: Adaptive Bidirectional Displacement for Semi-Supervised Medical Image Segmentation
published: 2026-01-09 14:24:00
expires: 2026-08-21 23:59:59
description: "一致性学习是解决半监督医学图像分割"
category: 半监督医学图像分割
tags: [CVPR]
---

::github{repo="Star-chy/ABD"}

## 摘要

Consistency learning is a central strategy to tackle unlabeled data in semi-supervised medical image segmentation (SSMIS), which enforces the model to produce consistent predictions under the perturbation. However, most current approaches solely focus on utilizing a specific single perturbation, which can only cope with limited cases, while employing multiple perturbations simultaneously is hard to guarantee the quality ofconsistency learning. In this paper, we propose an Adaptive Bidirectional Displacement (ABD) approach to solve the above challenge. Specifically, we first design a bidirectional patch displacement based on reliable prediction confidence for unlabeled data to generate new samples, which can effectively suppress uncontrollable regions and still retain the influence of input perturbations. Meanwhile, to enforce the model to learn the potentially uncontrollable content, a bidirectional displacement operation with inverse confidence is proposed for the labeled images, which generates samples with more unreliable information to facilitate model learning. Extensive experiments show that ABD achieves new state-of-the-art performances for SSMIS, significantly improving different baselines. Source code is available at https://github.com/chyupc/ABD.

## 翻译

一致性学习是解决半监督医学图像分割(SSMIS)中未标记数据的核心策略，它强制模型在扰动下产生一致的预测。然而，目前大多数方法只关注于利用特定的单个扰动，这只能处理有限的情况，而同时使用多个扰动很难保证一致性学习的质量。在本文中，我们提出一种自适应双向位移(ABD)方法来解决上述挑战。具体而言，我们首先针对未标记数据设计基于可靠预测置信度的双向patch位移生成新样本，可以有效地抑制不可控区域，同时仍然保留输入扰动的影响。同时，为了增强模型对潜在不可控内容的学习能力，对标记后的图像进行双向逆置信度置换操作，生成的样本中不可靠信息较多，便于模型学习。大量的实验表明，ABD在SSMIS中实现了新的最先进的性能，显着改善了不同的基线。源代码可从https://github.com/chyupc/ABD

## 研究背景

![Snipaste_2026-01-09_18-58-39](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/xunU/0X0/0343OU9eGzkXTrQytvUJxj.webp)



医学图像分割在临床应用中至关重要，但获取大规模精确标注数据成本高昂，半监督医学图像分割（SSMIS）成为解决数据标注瓶颈的关键技术。一致性学习作为SSMIS的核心策略，通过在扰动下强制模型产生一致预测来利用未标记数据。然而现有方法存在显著局限：多数仅采用**单一扰动**（输入、特征或网络扰动），只能处理有限场景；而同时使用多种扰动时，易导致一致性学习失控，降低预测质量。

具体表现为：单一扰动限制模型性能，难以构建精准决策边界；混合扰动虽能扩展学习场景，但会引发不可控区域，如交叉伪监督（CPS）模型在添加输入扰动后会错误分类背景与前景。为解决混合扰动导致的一致性学习质量下降问题，本文提出自适应双向位移（ABD）方法，通过动态调整样本区域提升模型对扰动的适应能力，突破现有方法在单一/混合扰动下的性能瓶颈。

## 研究现状

半监督医学图像分割（SSMIS）通过结合少量标注数据与大量未标注数据降低标注成本，核心策略为一致性学习，即通过扰动（输入/特征/网络）使模型预测一致。当前方法可分三类：**输入扰动（如数据增强）、特征扰动（如噪声注入）、网络扰动（如不同初始化网络）**。主流方法如CPS、Mean Teacher等，多依赖单一扰动类型，性能受限。

## 提出的模型

![Snipaste_2026-01-09_19-01-23](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/q9NU/1164X850/5WUHsqoHcBUDVUfoxVCGwg.png)

### **1. 模型核心创新**

#### **（1）基于可靠置信度的双向位移（ABD-R）**

- **目标**：解决未标记数据在多扰动下的预测不一致问题。
- **方法**：
  1. 对同一张未标记图像进行弱增强（如随机旋转）和强增强（如颜色抖动、模糊），生成两个输入样本。
  2. 通过网络预测生成置信度矩阵（衡量像素分类可靠性）和输出分布（KL散度衡量区域语义相似性）。
  3. **双向替换**：将弱增强样本中**最低置信度区域**替换为强增强样本中**语义最相似的高置信度区域**（反之亦然），生成新样本。
- **作用**：去除不可控区域，保留互补语义信息，提升一致性学习稳定性。

#### **（2）基于逆置信度的双向位移（ABD-I）**

- **目标**：强化模型对标记数据中潜在不可控区域的学习。
- **方法**：
  1. 对标记图像进行弱/强增强，计算置信度矩阵。
  2. **逆替换**：将弱增强样本中**最高置信度区域**替换为强增强样本中**最低置信度区域**（反之亦然），同时对标签执行相同位移。
- **作用**：主动引入难样本，增强模型对复杂区域的学习能力。

### **2. 损失函数设计**

总损失由**监督损失**和**半监督损失**组成：

- **监督损失**：包含原始增强标记样本的交叉熵+Dice损失和ABD-I生成样本的损失。
- **半监督损失**：包含原始增强未标记样本的交叉伪监督损失和ABD-R生成样本的交叉监督损失。



:::warning

原文中表述错误的地方：应该是未标记图像的数量远大于标记图像的数量，即N<<M，而不是N>>M。

![Snipaste_2026-01-09_19-03-16](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/TOZg/588X132/0NZMMAHTbciaL1esvEoDng.png)

:::

## 实验（Compared with SOTA）



> 数据集：
>
> - **ACDC数据集**：包含200例心脏 cine-MR 图像，4个类别（左心室、右心室、心肌、背景）。训练集70例、验证集10例、测试集20例。
>   - 评价指标：Dice相似系数（DSC）、Jaccard指数、95% Hausdorff距离（95HD）、平均表面距离（ASD）。
> - **PROMISE12数据集**：50例前列腺MRI图像，2D切片处理。
>   - 评价指标：DSC、ASD。
> - **基线方法**：
>   1. **Cross Teaching**：双网络（UNet和Swin-UNet）交叉监督，结合网络扰动与输入扰动（弱/强数据增强）。
>   2. **BCP**：均值教师框架，输入扰动（弱/强增强）+ 双学生网络（不同初始化）。
> - **数据增强**：
>   - 弱增强：随机旋转、翻转；
>   - 强增强：颜色抖动、模糊、Cutout。

![Snipaste_2026-01-09_19-07-52](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/EuL9/942X673/1mFAmm0wvZf9YkQdeUQczM.png)



![Snipaste_2026-01-09_19-08-02](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/qFNR/585X386/4wTKuDou6YYs5oZZuaTDWB.png)

（1）ABD在5%标记数据下较Cross Teaching提升20.75% DSC，较BCP提升1.37% DSC；10%标记数据下达到SOTA，95HD和ASD显著降低（如BCP基线95HD从3.98降至1.46）。

（2）ABD较SCP-Net提升5.0% DSC，ASD从3.52降至1.33。

![Snipaste_2026-01-09_19-09-06](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/XGz1/872X799/6p45blXKWICZjEd4sZJHSL.png)

## 实验（Ablation Experiments）​​

![Snipaste_2026-01-09_19-09-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/hbsN/568X251/20JS41ZQrnbNCfVziKRdEk.png)

![Snipaste_2026-01-09_19-10-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/P7Er/576X629/5LSFBlYdMlsK5Wo1r7CFOp.png)

BD通过双向位移策略解决了混合扰动导致的一致性学习不稳定问题，在半监督医学图像分割中实现SOTA性能，且可灵活嵌入不同基线框架（Cross Teaching/BCP），验证了其泛化性。

## 结论

本文提出了一种基于自适应双向位移的半监督医学图像分割方法。我们的关键思想是减轻混合扰动对一致性学习的约束，从而提高一致性学习的上限。为了实现这一目标，我们在ABD中设计了两个新的模块:ABD-R模块减少了未标记样本中的不可控区域，并从输入扰动中捕获了全面的语义信息;ABD-i模块增强了对标记样本中不可控区域的学习能力，以弥补ABD- r的不足。通过两个模块的合作，我们的方法实现了最先进的性能，并且很容易嵌入到不同的方法中。在未来，我们将设计一个补丁自适应位移策略来处理更复杂的情况。





