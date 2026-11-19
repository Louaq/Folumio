---
title: Segment Together A Versatile Paradigm for Semi-Supervised Medical Image Segmentation
published: 2026-01-16 16:55:00
expires: 2026-01-31 23:59:59
description: "标签的缺乏已经成为"
category: 半监督医学图像分割
tags: [TMI]
---

::github{repo="maxwell0027/VerSemi"}

:::note
t-SNE 可视化，本文的观点较新，特别是结论部分提出的数据集之间有冲突的情况
:::

## 摘要

The scarcity of annotations has become a significant obstacle in training powerful deep-learning models for medical image segmentation, limiting their clinical application. To overcome this, semi-supervised learning that leverages abundant unlabeled data is highly desirable to enhance model training. However, most existing works still focus on specific medical tasks and underestimate the potential of learning across diverse tasks and datasets. In this paper, we propose a Versatile Semi-supervised framework (VerSemi) to present a new perspective that integrates various SSL tasks into a unified model with an extensive label space, exploiting more unlabeled data for semi-supervised medical image segmentation. Specifically, we introduce a dynamic task-prompted design to segment various targets from different datasets. Next, this unified model is used to identify the foreground regions from all labeled data, capturing cross-dataset semantics. Particularly, we create a synthetic task with a CutMix strategy to augment foreground targets within the expanded label space. To effectively utilize unlabeled data, we introduce a consistency constraint that aligns aggregated predictions from various tasks with those from the synthetic task, further guiding the model to accurately segment foreground regions during training. We evaluated our VerSemi framework against seven established SSL methods on four public benchmarking datasets. Our results suggest that VerSemi consistently outperforms all competing methods, beating the second-best method with a 2.69% average Dice gain on four datasets and setting a new state of the art for semi-supervised medical image segmentation. Code is available at https://github.com/maxwell0027/VerSemi

## 翻译

标签的缺乏已经成为训练强大的医学图像分割深度学习模型的一个重要障碍，限制了它们的临床应用。为了克服这个问题，利用大量未标记数据的半监督学习是增强模型训练的理想方法。然而，大多数现有的工作仍然集中在特定的医疗任务上，低估了跨不同任务和数据集学习的潜力。在本文中，我们提出了一个多功能半监督框架(VerSemi)，以提供一个新的视角，将各种SSL任务集成到一个具有广泛标签空间的统一模型中，利用更多未标记的数据进行半监督医学图像分割。具体来说，我们引入了一种动态任务提示设计来从不同的数据集中分割不同的目标。接下来，使用该统一模型从所有标记数据中识别前景区域，捕获跨数据集语义。特别是，我们使用CutMix策略创建了一个合成任务，以在扩展的标签空间内增强前景目标。为了有效地利用未标记的数据，我们引入了一致性约束，将来自各种任务的汇总预测与来自合成任务的预测对齐，进一步指导模型在训练过程中准确分割前景区域。我们在四个公共基准测试数据集上针对七个已建立的SSL方法评估了我们的VerSemi框架。我们的研究结果表明，VerSemi始终优于所有竞争方法，在四个数据集上以2.69%的平均Dice增益击败了第二好的方法，并为半监督医学图像分割设定了新的水平。代码可从https://github.com/maxwell0027/VerSemi

## 研究背景

![Snipaste_2026-01-16_20-01-17](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/9jrI/0X0/0343OVyZ6IEWSLftm4F8cE.webp)



医学图像分割中，标注数据稀缺严重限制了深度学习模型的临床应用。半监督学习（SSL）通过利用大量未标注数据缓解这一问题，但现有方法多局限于单一任务，忽略了跨任务和跨数据集学习的潜力。传统SSL范式（如伪标签和一致性正则化）因固定标签空间导致标注与未标注数据分布不匹配，且未标注数据常因与任务标签空间不匹配而利用率低。

通用模型虽能处理多任务，但需任务特定提示信息，无法直接利用无任务信息的未标注数据，且存在任务提示弱化现象（模型可能忽略提示而错误识别目标）。因此，本文提出VerSemi框架，旨在通过统一多任务标签空间、动态任务提示设计及合成任务构建，实现跨任务半监督学习，提升模型泛化能力与未标注数据利用率。

![Snipaste_2026-01-16_20-01-54](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/AAzR/636X426/20X9xqoVoSt7UP5ZFDaW0Q.png)

## 研究现状

1. **半监督学习（SSL）应用**：针对医学图像分割标注稀缺问题，主流SSL方法分为伪标签法（如PEFAT、SoftMatch）和一致性正则化（如FixMatch、DTC），但多局限于单任务学习，依赖单一数据集的标签空间。
2. **通用模型探索**：多任务统一模型（如DoDNet、UniSeg）通过整合多源数据提升泛化能力，但主要依赖全监督或自监督学习，未有效结合有标签和无标签数据。
3. **跨任务知识整合**：现有方法缺乏对不同任务间语义关联的利用，导致无标签数据利用率低，尤其当数据与预定义任务标签空间不匹配时。

> 我们的贡献有三方面：
>
> •我们提出了VerSemi，这是一个创新的框架，擅长将各种相关的SSL任务集成到一个统一的框架中，挑战传统的特定任务SSL方法。
>
> •我们通过“合成任务”的创新，从未标记的数据中实现任务无关学习，培养统一的前景分割能力。当将此功能用作约束时，允许在没有特定于任务的信息的情况下探索未标记的数据。
>
> •在四个公共数据集上的广泛实验证实了VerSemi的优势，证明了对任务特定SSL模型(例如，BCP [15]， CauSSL[26])和任务统一模型(例如，Uni-BCP, Uni-CauSSL)的显着改进。

## 提出的模型

![Snipaste_2026-01-16_20-04-19](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/uDjh/1246X676/1DBAIX0iRXISoDpAqjXolO.png)

#### **1）动态任务提示头（Dynamic Task-Prompted Head）**

- **设计**：采用动态卷积（Dynamic Convolution）生成任务特定的卷积核，通过任务提示（如独热编码`[Prompt#k]`）自适应处理不同分割任务（如胰腺、左心房、脾脏、肺肿瘤）。
- **优势**：避免多任务场景下的计算冗余，无需为每个任务设计独立头部，仅通过动态参数生成实现多任务兼容。

![Snipaste_2026-01-16_20-07-45](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/KF2F/613X113/67CJhGz9IjbqTeyJwHcUa5.png)

#### **（2）合成任务（Synthetic Task#5）**

- **构建方法**：基于CutMix策略混合不同任务的有标签数据，生成包含多种前景目标的合成图像及标签
- **作用**：引导模型学习跨任务的通用前景语义，为无标签数据学习提供统一的前景分割目标。

![Snipaste_2026-01-16_20-08-12](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Pzc6/521X109/56GLjncjiOyvkNeTlhhys0.png)



#### **（3）无任务信息的无标签数据学习**

- **混合无标签数据**：对无标签数据应用CutMix生成混合输入。
- **一致性约束**：将多任务预测结果（Task#1~#4）聚合（通过元素级最大值）与合成任务（Task#5）预测结果对齐，实现无任务信息的无标签数据利用：
  $L_{\text{unsup}} = \text{Dice}(P_{\text{agg}}, F(X_{\text{syn}}^u(i,j), [\text{Prompt\#5}]))$
  其中$P_{\text{agg}} = \max_k(F(X_{\text{syn}}^u(i,j), [\text{Prompt\#k}]))$。

#### **（4）辅助约束（Auxiliary Constraint）**

- **动机**：解决任务提示弱化问题（模型可能忽略提示而错误分割目标，如图2）。
- **实现**：对合成数据（Task#5）施加任务特定的Dice和交叉熵损失，强化任务提示的唯一性：
  ![Snipaste_2026-01-16_20-09-18](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/63cd/613X131/2biQzbXY6ELmA5SnU6JgdG.png)

## 实验（Compared with SOTA）

![Snipaste_2026-01-16_20-10-12](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/S3eC/1232X523/5eZvHeCkiPxTA8LhvdLZDM.png)



![Snipaste_2026-01-16_20-10-21](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/U7EG/1212X533/1485VqSIov4sXOm7m4oE78.png)

![Snipaste_2026-01-16_20-10-33](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/TOgL/1203X540/0OGGyP9xtOiCN6HHagbFoe.png)

![Snipaste_2026-01-16_20-10-43](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/FpJR/1211X517/2hbeTLVW2UWRt42YznsXrT.png)



> 数据集：
>
> - **ask#1（胰腺分割）**：NIH-Pancreas数据集，82例腹部CT扫描（62例训练，20例测试）。
> - **Task#2（左心房分割）**：Left Atrium数据集，100例心脏MRI（80例训练，20例测试）。
> - **Task#3（脾脏分割）**：MSD-Spleen数据集，41例CT扫描（30例训练，11例测试）。
> - **Task#4（肺肿瘤分割）**：MSD-Lung Tumor数据集，63例CT扫描（50例训练，13例测试）。
>
> 对比方法：
>
> 与12种半监督学习（SSL）方法对比，包括：
>
> - 不确定性感知均值教师（UA-MT）
> - 双任务一致性（DTC）
> - 对抗一致性与动态卷积（ASE-Net）
> - 因果启发半监督分割（CauSSL）
> - 双向复制粘贴（BCP）等
>
> 评估指标：
>
> - **Dice系数**（%）：衡量分割重叠度。
> - **Jaccard指数**（%）：衡量交并比。
> - **平均表面距离（ASD）**：体素级表面距离均值。
> - **95% Hausdorff距离（95HD）**：衡量边界误差的鲁棒指标。



1. **总体性能**
   VerSemi在所有数据集上显著优于对比方法，平均Dice分数比第二名（BCP）高出**2.69%**，95HD降低**8.92体素**（10%标记数据）。
2. **各数据集表现**
   - **胰腺**：10%标记数据下，Dice达78.63%，比MagicNet高3.07%，95HD降低5.66体素。
   - **左心房**：与BCP性能接近（Dice差距<0.5%），但在小数据集上更稳健。
   - **脾脏**：10%标记数据下，Dice比CauSSL高7.36%，95HD降低32.46体素，因整合腹部器官数据提升特征学习。
   - **肺肿瘤**：10%标记数据下，Jaccard指数比MagicNet高5.13%。
3. **泛化能力测试**
   在未见过的BTCV-Spleen数据集上，VerSemi的Dice分数无显著下降（其他方法平均下降2%），证明其跨数据集鲁

## 实验（Ablation Experiments）​​

1. - **辅助约束（Laux）**：提升任务提示的独特性，Dice平均提升**1.8%**。
   - **合成任务（Task#5）**：通过CutMix生成混合数据，增强前景区域识别能力，Dice提升**2.1%**。
   - **动态卷积头**：相比多头部架构，参数减少30%，推理速度提升25%。

![Snipaste_2026-01-16_20-13-38](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/oQ6X/622X359/16SPD6ScxnLcWkgo28IlW2.png)

## 结论

本文提出了一种名为VerSemi的有效模型，用于半监督医学图像分割，该模型创新性地将各种任务整合到一个统一框架中。VerSemi通过任务提示设计动态处理不同任务，并提出一种新的对比约束来提高这些动态任务提示的可控性，从而区分不同的任务信息。在四个公共数据集上的大量实验证明了VerSemi模型的有效性，特别是在训练标签有限的情况下，为半监督医学图像分割树立了新的技术标杆。

此外，VerSemi将多个任务整合到统一框架中的能力使其能够在各种临床任务（如器官、肿瘤和其他解剖结构的分割）中实现泛化。该框架还在不同成像模态（包括CT和MRI）中表现出灵活性，使其高度适用于广泛的医学成像应用。这种广泛的适用性确保VerSemi可以部署在不同的医疗环境中，提高全球医学图像分析的一致性和可靠性。

局限性与未来工作：由于我们的模型是在多个可用数据集上训练的，数据集之间固有的冲突可能会影响训练过程。未来的工作将重点开发一种去偏策略来处理此类数据集间冲突。





