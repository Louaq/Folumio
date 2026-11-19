---
title: MATR Multimodal Medical Image Fusion via Multiscale Adaptive Transformer
published: 2025-07-25 13:59:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "多模态医学图像融合是一种将不同模态中的互补信息合并的有效方法"
categories: 多模态医学图像分割
tags: [Adaptive Transform, Adaptive Convolution]
---

## 摘要

Owing to the limitations of imaging sensors, it is challenging to obtain a medical image that simultaneously contains functional metabolic information and structural tissue details. Multimodal medical image fusion, an effective way to merge the complementary information in different modalities, has become a significant technique to facilitate clinical diagnosis and surgical navigation. With powerful feature representation ability, deep learning (DL)-based methods have improved such fusion results but still have not achieved satisfactory performance. Specifically, existing DL-based methods generally depend on convolutional operations, which can well extract local patterns but have limited capability in preserving global context information. To compensate for this defect and achieve accurate fusion, we propose a novel unsupervised method to fuse multimodal medical images via a multiscale adaptive Transformer termed MATR. In the proposed method, instead of directly employing vanilla convolution, we introduce an adaptive convolution for adaptively modulating the convolutional kernel based on the global complementary context. To further model long-range dependencies, an adaptive Transformer is employed to enhance the global semantic extraction capability. Our network architecture is designed in a multiscale fashion so that useful multimodal information can be adequately acquired from the perspective of different scales. Moreover, an objective function composed of a structural loss and a region mutual information loss is devised to construct constraints for information preservation at both the structural-level and the feature-level. Extensive experiments on a mainstream database demonstrate that the proposed method outperforms other representative and state-of-the-art methods in terms of both visual quality and quantitative evaluation. We also extend the proposed method to address other biomedical image fusion issues, and the pleasing fusion results illustrate that MATR has good generalization capability. The code of the proposed method is available at https://github.com/tthinking/MATR.

## 翻译

由于成像传感器的限制，同时获取包含功能代谢信息和结构组织细节的医学图像具有挑战性。多模态医学图像融合是一种将不同模态中的互补信息合并的有效方法，已成为促进临床诊断和手术导航的重要技术。借助强大的特征表示能力，基于深度学习（DL）的方法改善了这种融合结果，但仍未达到令人满意的性能。具体来说，现有的基于DL的方法通常依赖于卷积操作，虽然可以很好地提取局部模式，但在保持全局上下文信息方面能力有限。为弥补这一缺陷并实现精确融合，我们提出了一种新的无监督方法，通过多尺度自适应Transformer（称为MATR）融合多模态医学图像。在所提出的方法中，我们引入了一种自适应卷积，以根据全局互补上下文自适应地调整卷积核，而不是直接使用普通卷积。为了进一步建模长距离依赖关系，采用自适应Transformer以增强全局语义提取能力。我们的网络架构以多尺度方式设计，以便从不同尺度的视角充分获取有用的多模态信息。此外，设计了一种由结构损失和区域互信息损失组成的目标函数，以在结构层次和特征层次上构建信息保留的约束。在主流数据库上进行的大量实验表明，所提出的方法在视觉质量和量化评估方面优于其他具有代表性和最先进的方法。我们还扩展了所提出的方法以解决其他生物医学图像融合问题，令人满意的融合结果表明MATR具有良好的泛化能力。所提出方法的代码可在https://github.com/tthinking/MATR 获取。

## 研究背景

本文聚焦于多模态医学图像融合，写作背景基于以下原因：

- **临床需求**：功能代谢信息与结构组织细节难以同时呈现于单张医学图像，而多模态医学图像融合可结合不同模态图像的互补信息，在肿瘤分割、细胞分类等临床应用中意义重大。例如，SPECT图像能反映代谢信息但分辨率低，MRI图像含丰富解剖信息且分辨率高，二者融合有助于准确诊断。
- **传统方法局限**：以往多模态医学图像融合方法，如基于变换域、稀疏表示、混合及其他方法，需手动设计特征提取和融合策略，使方法复杂且耗时。
- **深度学习方法不足**：虽深度学习在图像融合中表现良好，但现有基于卷积运算的方法，难以捕捉长距离上下文依赖，且多采用单尺度网络、基于像素级损失函数，导致全局信息提取受限、重要信息丢失及噪声影响等问题。

为解决上述挑战，作者提出基于多尺度自适应Transformer的多模态医学图像融合方法MATR，以提升融合效果和性能。

## 研究现状

- **传统方法**：**多尺度变换**（MST）等传统方法遵循“分解-融合-重建”规则，但在处理不同输入模态时未考虑其自身特征，手动设计的融合策略保留互补信息能力有限。
- **深度学习方法**：**基于深度学习**（DL）的方法凭借强大的特征表示能力被广泛应用于多模态医学图像融合。**如卷积神经网络（CNN）、生成对抗网络（GAN）**等方法可将活动级测量和融合规则视为整体，避免手动设计，但大多基于卷积操作。

## 提出的模型

文章提出了一种基于多尺度自适应Transformer的无监督深度学习方法MATR（Multiscale Adaptive Transformer），用于多模态医学图像融合。以下是该模型的详细介绍： 
1. **框架概述**    
 - 为解决通道不匹配问题，将SPECT图像从RGB色彩空间转换为YUV色彩空间，然后将Y分量$I_{Y}^{SPE}$与MRI图像在通道维度上拼接后输入到多尺度自适应Transformer网络。   
 - 由于MATR是端到端模型，可避免手动设计融合策略。网络输出融合后的Y分量$I_{Y}^{F}$，最后通过YUV - RGB颜色转换生成最终的融合结果$I_{F}$。 
2. **网络架构**    
 - **基本模块（BM）**：由自适应卷积（AC）、批量归一化（BN）层和修正线性单元（ReLU）组成，用于初步特征提取。公式为$F_{Out}^{BM} = ReLU(BN(AC(F_{In}^{BM})))$，其中$F_{In}^{BM}和F_{Out}^{BM}$分别表示输入和输出特征。    
 - **多尺度结构**：为了提取多模态尺度间的互补特征，模型采用多尺度设计，设置了三个分支处理BM的输出。       
   - 顶部分支：包含一个BM和三个自适应Transformer模块（ATM），用于表示潜在特征。       
   - 中间分支：有两个BM和三个ATM。       
   -  底部分支：拥有三个BM和三个ATM。分支中BM越多，提取的特征越深，信息提取能力越强。    - **自适应Transformer模块（ATM）**：有两个加法操作。       
   - 第一个加法操作：$F_{Out}^{ATM1} = MSA(LN(F_{In}^{ATM})) + F_{In}^{ATM}$，其中$F_{In}^{ATM}$和$F_{Out}^{ATM1}$分别表示输入和第一个加法操作的结果，LN是层归一化，MSA是多头自注意力。       
   -  第二个加法操作：$F_{Out}^{ATM} = MLP(LN(F_{Out}^{ATM1})) + F_{Out}^{ATM1}$，$F_{Out}^{ATM}$表示ATM的输出，MLP是多层感知器。
3. **损失函数**：由于多模态医学图像融合缺乏真实标签，损失函数从结构级和区域级两个角度设计。    
3. **结构级损失$(L_{SSIM})$**：使用结构相似性指数测量（SSIM）来约束融合图像与源图像的相似性，确保融合结果具有足够的结构细节。

![Snipaste_2025-07-26_15-16-58](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/YGUx/0X0/0343OVNPq3ma7SmCW5QzWB.webp)

## 数据集和训练细节

- **数据集**：从主流医学图像数据库Harvard下载354对256×256像素的SPECT和MRI图像。
- **数据划分**：随机分为训练集（319对）、验证集（15对）和测试集（20对）。
- **数据增强**：对训练集采用重叠裁剪策略，将图像裁剪成120×120的补丁对，共得到15631对补丁用于网络训练，并将所有样本归一化到[0, 1]。
- **训练设置**：使用PyTorch框架，在NVIDIA GeForce RTX 3090 GPU上进行实验。采用Adam优化器，学习率为0.001，批量大小为64，训练轮数为10。损失函数中的超参数设置为α = 1，β = 1，γ = 2.5，λ固定为0.5。



- **对比方法**：选取7种具有代表性和最先进的方法进行定性和定量比较，包括基于局部拉普拉斯滤波（LLF）的方法、基于非下采样剪切波变换域参数自适应脉冲耦合神经网络（NSST - PAPCNN）的方法、基于PMGI的方法、基于U2Fusion的方法、基于DDcGAN的方法、基于EMFusion的方法和基于SwinFuse的方法。
- **评估指标**：采用9种广泛使用的评估指标进行全面客观评估，包括归一化互信息QMI、Tsallis熵QTE、非线性相关信息熵QNCIE、基于梯度的指标QG、基于图像特征的指标QP、Chen - Varshney指标QCV、局部互信息（LMI）、视觉信息保真度（VIF）和多尺度结构相似性指数（MS - SSIM）。

## 实验（Compared with SOTA）

- **定性比较**：在6对具有代表性的SPECT和MRI图像上，将MATR与7种对比方法的融合结果进行比较。结果表明，MATR在保留源图像互补信息方面表现出更好的融合特性。
- **定量比较**：在测试集上使用9种评估指标进行定量比较。结果显示，MATR在大多数指标上优于其他代表性和最先进的方法，客观性能更好。

![Snipaste_2025-07-26_15-22-04](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-26_15-22-04.png)

![Snipaste_2025-07-26_15-22-23](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-26_15-22-23.png)

## 实验（Ablation Experiments）​​

- **网络结构分析**：通过在验证集上进行消融实验，验证了自适应卷积（AC）、自适应Transformer模块（ATM）和多尺度结构在方法中的有效性。结果表明，完整模型的性能明显优于其他退化模型。
- **损失函数分析**：通过去除结构级损失和区域级损失，验证了这两种损失在训练过程中的重要性。结果表明，同时使用这两种损失时，MATR具有更准确和自然的融合性能。
- **参数设置分析**：通过在验证集上进行大量实验，最终将损失函数中的权衡参数固定为α = 1，β = 1，γ = 2.5。结果表明，在这些参数设置下，模型在验证集上达到了最佳融合性能。

![Snipaste_2025-07-26_15-23-00](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-26_15-23-00.png)

## 扩展实验

- **PET和MRI图像融合**：将MATR扩展到正电子发射断层扫描（PET）和MRI图像融合任务，无需微调。结果表明，MATR在同时利用PET图像的功能信息和MRI图像的组织细节方面表现出最佳融合性能，具有良好的泛化能力。
- **GFP和PC图像融合**：将MATR扩展到绿色荧光蛋白（GFP）和相差（PC）图像融合任务，无需微调。结果表明，MATR在主观和客观比较方面均优于其他竞争方法，进一步证明了其良好的泛化能力。

## 结论

作者提出一种基于多尺度自适应Transformer的深度学习多模态医学图像融合方法MATR，并得出以下结论：

1. **方法有效性**：引入自适应卷积和自适应Transformer提取全局互补上下文信息，多尺度设计捕捉有用的尺度间信息，从结构和特征层面设计目标函数进行无监督训练。大量实验表明，该方法在视觉质量和客观评价上优于其他代表性和先进方法。
2. **泛化能力**：将该方法扩展到处理其他生物医学功能和结构图像融合问题，取得了令人满意的结果，说明MATR具有良好的泛化能力。
3. **应用价值**：该方法具有实际工程应用价值，可促进后续的诊断、治疗规划和手术导航等任务。作者相信MATR模型能够处理更多类型的图像融合问题，并为探索新的图像融合方法提供思路。
