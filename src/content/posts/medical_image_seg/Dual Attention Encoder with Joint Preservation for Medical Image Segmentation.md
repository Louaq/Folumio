---
title: Dual Attention Encoder with Joint Preservation for Medical Image Segmentation
published: 2025-05-26 12:28:21
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "DANIE医学图像分割网络"
categories: 医学图像分割
tags: [Medical Image Segmentation, Dual Attention Encoder]
---



> 四川大学、中国科学院大学

## 摘要

Transformers have recently gained considerable popularity for capturing long-range dependencies in the medical image segmentation. However, most transformer-based segmentation methods primarily focus on modeling global dependencies and fail to fully explore the complementary nature of different dimensional dependencies within features. These methods simply treat the aggregation of multi-dimensional dependencies as auxiliary modules for incorporating context into the Transformer architecture, thereby limiting the model’s capability to learn rich feature representations. To address this issue, we introduce the Dual Attention Encoder with Joint Preservation (DANIE) for medical image segmentation, which synergistically aggregates spatial-channel dependencies across both local and global areas through attention learning. Additionally, we design a lightweight aggregation mechanism, termed Joint Preservation, which learns a composite feature representation, allowing different dependencies to complement each other. Without bells and whistles, our DANIE significantly improves the performance of previous state-of-the-art methods on five popular medical image segmentation benchmarks, including Synapse, ACDC, ISIC 2017, ISIC 2018 and GlaS.

## 翻译

近年来，**Transformers** 在医学图像分割中因捕捉长距离依赖关系而受到广泛关注。然而，大多数基于 Transformer 的分割方法主要关注于建模全局依赖关系，而未能充分探索特征中不同维度依赖关系的互补性。这些方法仅将多维依赖关系的聚合作为将上下文融入 Transformer 架构的辅助模块，从而限制了模型学习丰富特征表示的能力。为了解决这一问题，我们引入了用于医学图像分割的联合保留双重注意编码器（DANIE），通过注意力学习协同聚合局部和全局区域的空间-通道依赖关系。此外，我们设计了一种名为联合保留的轻量级聚合机制，学习复合特征表示，使不同的依赖关系互为补充。不加修饰，我们的 DANIE 在包括 **Synapse、ACDC、ISIC 2017、ISIC 2018 和 GlaS** 在内的五个流行医学图像分割基准上显著提升了先前最先进方法的性能。

## 研究背景

医学图像分割是计算机视觉的关键任务，能为疾病诊断提供重要信息。但医学图像组织复杂、边缘模糊，高效分割特定目标极具挑战。

 早期基于卷积神经网络（CNNs）的方法，如Unet，虽结构简单、性能高效，但卷积算子固定的感受野使其难以捕捉医学图像中远距离像素间的长程关系。 

近年来，基于Transformer的分割方法兴起，利用其全局关系建模能力解决了CNNs的部分局限，可交互长距离像素信息。然而，这些方法大多仅关注全局依赖建模，未充分挖掘特征内不同维度依赖的互补性，只是将多维依赖聚合作为辅助模块，限制了模型学习丰富特征表示的能力。 为解决上述问题，本文提出了用于医学图像分割的双注意力编码器联合保留（DANIE）架构，通过注意力学习协同聚合局部和全局区域的空间 - 通道依赖，并设计了轻量级聚合机制“联合保留”，使不同依赖相互补充，以提升模型对解剖结构的定位能力和分割性能。 

## 研究现状

- **CNN 方法**：Unet 开创了 CNN 在医学图像分割的应用，后续如 UNet++、nnUNet 等采用 U 形全卷积网络设计。Han 等开发 2.5D 24 层 FCN 用于肝脏分割。
- **Transformer 方法**：Transformer 在医学图像分割中流行，如 TransUNet 结合 CNN 和 Transformer，SwinUNet 基于纯 Swin Transformer 块设计架构，部分研究将注意力机制作为辅助模块与 Transformer 结合。
- **注意力机制**：广泛应用于视觉任务，如 Hu 等设计通道注意力模块，Wang 等将非局部操作引入神经网络，部分研究将注意力机制用于医学图像分割。



## 提出的模型

![Snipaste_2025-05-26_11-18-01](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/1Ca0/0X0/0343OUkmebOjobbunTLDe5.webp)



本文提出了用于医学图像分割的双注意力编码器与联合保留（Dual Attention Encoder with Joint Preservation，DANIE）架构，以下是该模型的详细介绍： 

### 整体架构 DANIE框架主要包含三个关键组件： 

1. **嵌入层（Embedding Layer）**：输入图像首先通过单独的嵌入层提取信息表示，再输入到双注意力编码器。对于自注意力感知（Self-attentional Perception，SAP）流，嵌入层将输入图像划分为多个图像块，并为每个图像块学习一个向量表示；对于分层注意力感知（Hierarchical-attentional Perception，HAP）流，嵌入层应用卷积滤波器提取分层特征，保留图像中的局部关系。 
2. **双注意力编码器（Dual Attention Encoder，DAE）**：将特征图输入到双流模块学习多维特征。    
     - **自注意力感知（SAP）**：采用多头自注意力（Multi-head Self-attention，MHA）捕获全局空间关系。MHA是自注意力机制的扩展，通过并行应用多个自注意力块，将输出拼接并投影回原始维度，得到编码全局空间依赖关系的潜在表示。    
      - **分层注意力感知（HAP）**：引入分层注意力流，包括通道注意力和空间注意力，以突出重要特征，并设计动态校准有效集成这些特征，确保精确定位细节。 
3. **联合保留（Joint Preservation，JP）**：有效聚合空间 - 通道依赖关系，对自注意力感知和分层注意力感知进行轻量级处理，实现特征的互补融合。   
     - **增强自注意力感知器（Enhancing Self-Attentional Perceptron，ES）**：在自注意力块之后对特征的通道维度进行全局建模，捕获通道依赖关系，补充自注意力机制在捕获通道间相关性方面的不足。    
     - **增强分层注意力感知器（Enhancing Hierarchical-Attentional Perceptron，EH）**：在提取局部精细特征的基础上引入非局部交互，增强模型准确分割目标的能力。   
     - **聚合（Aggregation）**：融合来自两个感知器模块的特征，经过卷积块处理后，通过加法聚合生成最终预测图。
### 模型优势 
- **特征表示强大**：聚合全局和局部空间 - 通道特征，获得强大的复合表示，更深入理解复杂细节。
- **有效利用依赖关系**：设计DAE捕获全局空间信息和局部区域的空间 - 通道依赖关系，JP学习复合特征表示，整合多种维度依赖关系并确保相互补充。
- **性能优越**：在五个具有挑战性的基准数据集（Synapse、ACDC、ISIC 2017、ISIC 2018和GlaS）上表现优于现有最先进的方法，同时在计算成本上更具优势。 

## 实验（Compared with SOTA）

> 数据集：Synapse、ACDC、Skin Lesion Segmentation、GlaS
>

![Snipaste_2025-05-26_11-23-35](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-23-35.png)



![Snipaste_2025-05-26_11-23-40](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-23-40.png)



![Snipaste_2025-05-26_11-23-24](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-23-24.png)

![Snipaste_2025-05-26_11-23-56](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-23-56.png)



- **Synapse数据集**：DANIE - L在平均DICE、mIoU和ASD分数上相比主流分割方法TransUNet有显著提升，且在8个器官中的6个上得分高于SOTA模型，在分割胆囊、胰腺和胃等难以描绘的器官方面更具优势。
- **ACDC数据集**：DANIE - L的平均DICE分数、RV DICE分数、Myo DICE分数和LV DICE分数均优于其他SOTA方法，证明了该方法在不同医学成像数据模态上的可扩展性。
- **皮肤病变分割数据集**：在ISIC 2017和ISIC 2018数据集中，DANIE - L的各项指标均优于当前SOTA方法HiFormer等。
- **GlaS数据集**：DANIE - L在mDice和mIoU上取得了最高分数，优于其他竞争方法。



## 实验（Ablation Experiments）

- **双注意力编码器的有效性**：通过一系列不同结构的消融实验，验证了从全局和局部角度提取依赖关系有助于模型更有效地分割图像细节，整合多个依赖关系比仅依赖自注意力在单一维度上捕获特征依赖更有效。
- **分层注意力感知的有效性**：分析了分层注意力中组件编排顺序对模型的影响，发现通道优先顺序略优于空间优先顺序，且包含动态校准可以更好地细化特征，提高分割精度。
- **联合保留的有效性**：不同融合机制的实验结果表明，联合保留优于当前主流的融合机制（逐元素相加和拼接），能有效增强双注意力流的融合。

![Snipaste_2025-05-26_11-27-26](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-27-26.png)



![Snipaste_2025-05-26_11-27-30](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-27-30.png)

## 可视化

![Snipaste_2025-05-26_11-28-55](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-28-55.png)

![Snipaste_2025-05-26_11-28-45](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-26_11-28-45.png)

## 结论

作者提出了用于**医学图像分割的DANIE**网络，通过实验分析得出以下结论：

1. **方法优势**：DANIE利用双注意力编码器逐步、有选择地学习目标的关键部分，联合保留设计提升了分割性能，使编码器能捕捉互补特征。
2. **性能表现**：在Synapse、ACDC、ISIC 2017、ISIC 2018和GlaS五个流行医学数据集上，DANIE显著优于先前的先进方法，能准确分割大小器官，在不同医学成像数据模态上表现良好。
3. **平衡特性**：DANIE实现了计算复杂度和分割精度的最佳平衡，证明了利用各种依赖关系协同建模语义信息的有效性。 

