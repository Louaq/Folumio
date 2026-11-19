---
title: Bidirectional Copy-Paste for Semi-Supervised Medical Image Segmentation
published: 2026-01-06 20:08:00
expires: 2026-01-31 23:59:59
description: "在半监督医学图像分割中"
category: 半监督医学图像分割
tags: [CVPR]
---

::github{repo="DeepMed-Lab-ECNU/BCP"}

## 摘要

In semi-supervised medical image segmentation, there exist empirical mismatch problems between labeled and unlabeled data distribution. The knowledge learned from the labeled data may be largely discarded if treating labeled and unlabeled data separately or in an inconsistent manner. We propose a straightforward method for alleviating the problem − copy-pasting labeled and unlabeled data bidirectionally, in a simple Mean Teacher architecture. The method encourages unlabeled data to learn comprehensive common semantics from the labeled data in both inward and outward directions. More importantly, the consistent learning procedure for labeled and unlabeled data can largely reduce the empirical distribution gap. In detail, we copypaste a random crop from a labeled image (foreground) onto an unlabeled image (background) and an unlabeled image (foreground) onto a labeled image (background), respectively. The two mixed images are fed into a Student network and supervised by the mixed supervisory signals of pseudo-labels and ground-truth. We reveal that the simple mechanism of copy-pasting bidirectionally between labeled and unlabeled data is good enough and the experiments show solid gains (e.g., over 21% Dice improvement on ACDC dataset with 5% labeled data) compared with other state-of-the-arts on various semi-supervised medical image segmentation datasets. Code is available at https: //github.com/DeepMed-Lab-ECNU/BCP.

## 翻译

在半监督医学图像分割中，存在标记数据与未标记数据分布不匹配的问题。如果单独或以不一致的方式处理标记和未标记数据，则从标记数据中获得的知识可能在很大程度上被丢弃。我们提出了一种直接的方法来缓解这个问题-在一个简单的Mean Teacher架构中双向复制粘贴标记和未标记的数据。该方法鼓励未标记的数据在内向和外向两个方向上从标记的数据中学习全面的公共语义。更重要的是，标记和未标记数据的一致学习过程可以大大减少经验分布差距。详细地说，我们分别将随机裁剪的标记图像(前景)复制粘贴到未标记的图像(背景)和未标记的图像(前景)到标记的图像(背景)上。将这两幅混合图像输入到一个学生网络中，并由伪标签和真实值的混合监督信号进行监督。我们发现，与各种半监督医学图像分割数据集相比，标记和未标记数据之间双向复制粘贴的简单机制足够好，并且实验显示出坚实的收益(例如，在ACDC数据集上使用5%的标记数据，Dice改进超过21%)。代码可从https: //github.com/DeepMed-Lab-ECNU/BCP

## 研究背景

在半监督医学图像分割中，标记数据与未标记数据的经验分布不匹配问题显著。由于医学图像标注需繁琐昂贵的人工勾勒，标记数据稀缺，而未标记数据丰富，现有方法常将两者分开处理或采用不一致学习策略，导致标记数据中学习的知识大量流失。尽管现有方法（如Mean Teacher架构）通过弱-强增强对一致性正则化利用未标记数据，但现有Copy-Paste等数据增强技术仅在未标记数据间操作，或简单将标记数据前景粘贴到其他图像，忽视标记与未标记数据的一致性学习策略，无法有效缩小分布差距。同时，CutMix等混合图像仅依赖低精度伪标签监督，难以实现高性能。因此，需设计方法促进未标记数据从标记数据学习共同语义，并通过一致性学习缩小分布差距，本文提出双向Copy-Paste（BCP）方法解决该问题。

## 研究现状

1. **半监督医学图像分割**：因标注数据稀缺，半监督方法成为主流，通过少量标注数据与大量无标注数据协同训练，主流框架包括Mean Teacher、自训练、一致性正则化等。
2. **数据增强技术**：Copy-Paste（如CutMix）作为强增强手段被广泛应用，但现有方法多局限于无标注数据内部或单向复制（如从标注数据复制到无标注数据），未实现双向一致性学习。
3. **分布对齐挑战**：标注与无标注数据存在经验分布 mismatch，现有方法多单独处理两类数据，导致知识迁移效率低，模型泛化能力受限。

## 提出的模型

### 核心思路

1. **双向数据混合**
   - **向外复制粘贴（Outward）**：将标记图像的随机 crop（前景）粘贴到未标记图像（背景）上，生成混合图像 。
   - **向内复制粘贴（Inward）**：将未标记图像的随机 crop（前景）粘贴到标记图像（背景）上，生成混合图像 。
   - 通过双向混合，强制标记与未标记数据学习共同语义，减少分布差异。
2. **混合监督信号**
   - 教师网络为未标记图像生成伪标签，与标记图像的真实标签通过相同的双向复制粘贴策略生成混合监督信号 
   - 学生网络以混合图像为输入，通过混合监督信号（真实标签+伪标签）进行训练，实现一致的学习过程。
3. **损失函数**
   - 结合 Dice 损失和交叉熵损失，通过权重 平衡标记与未标记数据对损失的贡献：
     $\mathcal{L}_{all}=\mathcal{L}^{in}+\mathcal{L}^{out}$

## 实验（Compared with SOTA）

#### **1. 实验数据集**

- **LA 数据集**（左心房MRI分割）：100例3D增强MRI图像，评估5%和10%标记数据比例下的性能。
- **Pancreas-NIH 数据集**（胰腺CT分割）：82例腹部CT图像，采用20%标记数据比例。
- **ACDC 数据集**（心脏MRI分割，四分类）：100例心脏MRI图像，评估5%和10%标记数据比例。

#### **2. 对比方法**

与当前主流半监督分割方法对比，包括：

- **UA-MT**、**SASSNet** 、**DTC** 、**URPC**、**MC-Net** 、**SS-Net** 等。

#### **3. 评估指标**

- **Dice系数**（重叠率，↑）、**Jaccard指数**（交并比，↑）、**95% Hausdorff距离**（边界距离，↓）、**平均表面距离**（ASD，↓）。

![Snipaste_2026-01-06_20-27-07](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/9g1Y/0X0/0343OUKSXteA9FQ5jmMPwY.webp)

![Snipaste_2026-01-06_20-27-27](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/YLbU/542X766/3syfO9aQHeGVEMFw9PDHcz.png)

![Snipaste_2026-01-06_20-27-57](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/QljI/1010X477/7duxaPZtdXyUG2omtUZYY6.png)

## 实验（Ablation Experiments）​​

验证BCP核心组件的有效性：

- **双向复制粘贴方向**：仅单向（In/Out）或同类数据内复制（CP）性能均低于双向（BCP），证明双向交互对分布对齐的必要性（表4）。
- **掩码策略**：零中心掩码（本文采用）优于随机掩码和接触掩码，可更好保留前景结构完整性（表6）。
- **混合系数β**：零值区域比例β=2/3时性能最优，平衡前景与背景信息融合（表7）。
- **预训练策略**：带复制粘贴的标记数据预训练可提升模型初始化效果，降低过拟合（表9）。

![Snipaste_2026-01-06_20-29-03](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/FFQD/980X229/0OrDKF3aN1XC2a7P6Zs7q8.png)

## 结论

1. **双向复制粘贴（BCP）有效减小分布差距**：通过将标记图像前景复制到未标记图像背景，以及将未标记图像前景复制到标记图像背景，实现了标记与未标记数据的双向语义迁移，显著降低了二者的经验分布不匹配问题。
2. **在多种医学影像数据集上性能优越**：在LA、Pancreas-NIH和ACDC数据集上均超越现有半监督分割方法。尤其在ACDC数据集5%标记数据下，Dice指数提升超21%，验证了BCP在小样本场景下的有效性。
3. **无需额外参数与计算成本**：BCP基于Mean Teacher框架设计，未引入新网络参数或增加计算复杂度，仅通过数据增强策略优化学习过程，具有良好的实用性和可扩展性。
4. **双向策略优于单向/内部复制**：消融实验表明，单独的向内/向外复制或同类数据内部复制（如标记-标记）性能均低于双向机制，证明双向对称学习对语义对齐的关键作用。
5. **伪标签质量与预训练优化增益显著**：结合最大连通域后处理（NMS）和带复制粘贴的预训练策略，可进一步提升伪标签可靠性，在ACDC数据集上使Dice从83.26%提升至87.59%。





