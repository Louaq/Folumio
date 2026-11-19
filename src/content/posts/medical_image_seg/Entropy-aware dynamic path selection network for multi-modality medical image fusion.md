---
title: Entropy-aware dynamic path selection network for multi-modality medical image fusion
published: 2025-07-29 17:12:00 
expires: 2025-08-21 23:59:59  
mathjax: true
excerpt: "深度学习在多模态医学图像融合（MMIF）中取得了显著成功"
categories: 多模态医学图像分割
tags: [Multi-Modality Medical Image Fusion]
---
上海大学

## 摘要

Deep learning has achieved significant success in multi-modality medical image fusion (MMIF). Nevertheless, the distribution of spatial information varies across regions within a medical image. Current methods consider the medical image as a whole, leading to uneven fusion and susceptibility to artifacts in edge regions. To address this problem,we delve into regional information fusion and introduce an entropy-aware dynamic path selection network (EDPSN). Specifically, we introduce a novel edge enhancement module (EEM) to mitigate artifacts in edge regions through central concentration gradient (CCG). Additionally, an entropy-aware division (ED) module is designed to delineate the spatial information levels of distinct regions in the image through entropy convolution. Finally, a dynamic path selection (DPS) module is introduced to enable adaptive fusion of diverse spatial information regions. Experimental comparisons with some state-of-the-art image fusion methods illustrate the outstanding performance of the EDPSN in three datasets encompassing MRI-CT, MRI-PET, and MRI-SPECT. Moreover, the robustness of the proposed method is validated on the CHAOS dataset, and the clinical value of the proposed method is validated by sixteen doctors and medical students.

## 翻译

深度学习在多模态医学图像融合（MMIF）中取得了显著成功。然而，医学图像中各区域的空间信息分布存在差异。现有方法将医学图像视为整体，导致融合不均匀，并在边缘区域易出现伪影。为解决这一问题，我们深入研究区域信息融合，并引入一种熵感知动态路径选择网络（EDPSN）。具体来说，我们引入了一种新颖的边缘增强模块（EEM），通过中心集中梯度（CCG）来减轻边缘区域的伪影。此外，设计了一个熵感知分割（ED）模块，通过熵卷积来勾画图像中不同区域的空间信息水平。最后，引入了动态路径选择（DPS）模块，以实现对多样空间信息区域的自适应融合。与一些最先进的图像融合方法的实验比较表明，EDPSN在涵盖MRI-CT、MRI-PET和MRI-SPECT的三个数据集中的表现非常出色。此外，在CHAOS数据集上验证了所提出方法的鲁棒性，并通过十六位医生和医学生验证了所提出方法的临床价值

## 研究背景

多模态医学图像融合（MMIF）技术对临床诊断至关重要。不同模态的医学图像，如**CT、MRI、PET和SPECT**，能提供不同的关键信息，但因硬件限制，这些图像在临床应用中存在分辨率低、纹理模糊和有噪声等问题。因此，医学图像处理技术被广泛应用以提升临床诊断准确性，MMIF技术作为其中一种图像增强方法，可将不同来源的医学图像融合，弥补单模态图像信息的局限。

目前，MMIF方法主要包括基于空间域、变换域和深度学习的方法。然而，现有的深度学习方法未充分考虑图像内不同区域空间信息分布的差异，导致图像融合不均，融合图像的边缘易出现伪影。

为解决这一问题，本文提出了熵感知动态路径选择网络（EDPSN）。该网络通过边缘增强模块（EEM）减少边缘伪影，利用熵感知划分（ED）模块探索不同区域的空间信息分布，设计动态路径选择（DPS）模块对不同空间信息区域进行自适应融合，旨在有效缓解融合不均的问题，提高多模态医学图像融合的质量。

## 研究现状

**传统方法**：主要包括空间域和变换域方法。空间域方法如PCA、IHS等适用于模态特征相近的图像，但易在融合边界产生伪影；变换域方法如DWT、NSCT等通用性强，但可能引入模糊。

**深度学习方法**：应用广泛且成果显著。如CNN、GAN等被用于图像融合，部分方法通过设计不同图像、模型结构或创新融合任务来提升效果。

![Snipaste_2025-07-30_14-25-32](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ZV8x/0X0/0343OUrs017jaODYylKi9f.webp)

## 提出的模型

![Snipaste_2025-07-30_14-26-31](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-26-31.png)

### 模型整体概述

EDPSN通过三个阶段实现多模态医学图像的均匀融合，即增强图像边缘、划分不同信息程度的区域以及自适应融合不同信息分布的区域。该网络主要由**边缘增强模块（Edge Enhancement Module，EEM）**、**熵感知划分模块（Entropy-aware Division，ED）**和**动态路径选择模块（Dynamic Path Selection，DPS）**组成。

### 模型模块介绍

1. **边缘增强模块（EEM）**：为减少多模态医学图像融合中边缘区域的伪影，提出了基于中心集中梯度（Central Concentration Gradient，CCG）的EEM。该模块将PET图像转换到HSI空间，对I通道进行CCG处理，计算梯度值并得到梯度图，将梯度图与I通道相加得到增强结果，最后将增强后的I通道与H和S通道堆叠并逆变换到RGB颜色空间，从而有效增强PET图像的边缘信息，为多模态医学图像融合提供更准确的边缘特征。
2. **熵感知划分模块（ED）**：该模块利用熵卷积来捕捉图像中不同区域的空间信息分布。具体做法是计算每个像素附近3×3范围内的整体熵值，根据熵值使用自适应阈值将图像直方图划分为低、中、高三个熵区域，这些区域作为滤波器与浅层特征进行逐元素相乘，得到具有不同空间信息的特征图。
3. **动态路径选择模块（DPS）**：为解决不同空间分布区域融合不均匀的问题，提出了DPS模块。该模块采用路径选择结构，每个分支使用自适应融合模块（Adaptive Fusion Module，AFM）进行特征提取。AFM由多个多尺度特征融合块（Multi-scale Feature Fusion Block，MFB）组成，通过组合不同感受野的特征，可获得更丰富、准确的图像表示。多个MFB能从PET和MRI图像中提取图像颜色和结构的深层语义特征，对提高融合图像的质量有显著效果。

### 模型损失函数

为监督训练过程，模型使用了回归损失“均方误差（Mean Square Error，MSE）”，同时引入梯度损失和感知损失。梯度损失用于模拟融合图像的物理精细细节，感知损失用于模拟融合图像与输入图像之间的高层语义相似性。最终的总损失通过计算输入图像、融合特征和融合图像之间的损失得到。

## 实验设置

- **数据集**：使用了**哈佛全脑图谱（Harvard Whole Brain Atlas）医学图像融合数据集**，包含MRI - CT（205对）、MRI - PET（311对）和MRI - SPECT（417对）三种多模态图像对，图像大小均为**256×256** ，MRI和CT为单通道图像，PET和SPECT为三通道图像，像素强度范围为[0, 255]。将所有数据集按9:1分为训练数据和测试集，训练数据再按8:2分为训练集和验证集。
- **参数设置**：使用Adam作为优化器，学习率设为0.0001，模型以100个批次进行训练。将EDPSN与传统方法（PCA、DWT、Curvelet、NSCT、DTCWT）和深度学习方法（IFCNN、U2Fusion、DILRAN、MATR、CDDFuse、FATF、BSA、LFDT）进行比较，所有方法均使用作者设置的默认参数。实验环境使用Pytorch在NVIDIA TITAN XP GPUs上实现。选择熵（EN）、标准差（SD）、相关差异总和（SCD）、$Q_{AB/F}$、视觉信息保真度（VIF）、峰值信噪比（PSNR）和结构相似性指数（SSIM）七个指标客观评估融合结果。



## 实验（Compared with SOTA）

- **MRI - CT融合**：需要考虑生理和解剖信息的最佳组合。传统方法融合相对均匀，但难以平衡生理和解剖细节；深度学习方法能实现不同模态结构信息的互补，但将图像作为整体处理，边缘和光滑区域的融合效果有差异。EDPSN针对不同信息分布区域采用不同融合策略，能均匀融合边缘和光滑区域，充分结合MRI的软组织结构和CT的血管钙化信息，辅助医生准确诊断脑血管疾病。
- **MRI - PET和MRI - SPECT融合**：需关注空间信息和颜色信息，重点是结构信息和代谢信息的结合。传统方法融合性能稳定，但融合图像易偏向彩色图像而丢失解剖细节；深度学习方法表现较好，但边缘和光滑区域融合效果仍有差异。EDPSN能均匀融合不同区域，清晰反映PET和SPECT的代谢信息，同时保留MRI的结构信息，辅助医生准确识别脑肿瘤。

![Snipaste_2025-07-30_14-31-12](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-31-12.png)

![Snipaste_2025-07-30_14-30-56](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-30-56.png)

![Snipaste_2025-07-30_14-30-47](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-30-47.png)

![Snipaste_2025-07-30_14-31-40](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-31-40.png)

## 实验（Ablation Experiments）​​

在**MRI-PET**上进行，设置6个消融实验，分别验证边缘增强模块（EEM）、熵感知划分模块（ED）和动态路径选择模块（DPS）的作用。结果表明，单独使用EEM和ED对提高融合质量有一定影响，结合使用效果更显著；DPS结构对结果影响大，利用不同层次的网络结构处理不同信息区域能使自适应融合模块（AFM）发挥最大作用。

![Snipaste_2025-07-30_14-32-25](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-32-25.png)

## **鲁棒性研究**
在CHAOS数据集上进行实验，该数据集包含190对腹部器官的MRI - CT图像。结果显示，EDPSN在腹部数据集上具有良好的泛化能力，能清晰显示腹部器官结构和软组织信息，适应不同解剖结构和图像特征的变化。

![Snipaste_2025-07-30_14-33-58](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-33-58.png)

## **用户研究**

咨询16位医生和医学生，对12种方法的融合图像进行评估。每种方法向参与者展示18张图像，包括每种模态的两对融合前后结果。调查问卷包含6个问题，参与者根据这些问题对融合方法进行评估，评分范围为1 - 5分。结果显示，与其他方法相比，EDPSN获得更多“5分”和“4分”评价，更少“1分”和“2分”评价，表明该方法在真实性、空间保真度和融合准确性方面能实现最佳主观视觉效果，可应用于临床诊断。

![Snipaste_2025-07-30_14-34-52](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-30_14-34-52.png)

## 结论

> 作者提出了一种新颖的**熵感知动态路径选择网络（EDPSN）**来解决医学多模态图像因空间信息分布导致的融合不均问题。通过边缘增强模块（EEM）对融合图像进行预处理，并提出了熵感知划分（ED）模块和动态路径选择（DPS）模块。实验结果表明，EDPSN不仅能有效去除边缘伪影，还能确保同一图像内不同空间区域的信息充分融合。在三种模态上的实验验证了EDPSN的出色性能，其基于不同区域的自适应融合机制为提高多模态医学图像协同诊断的准确性提供了新的技术途径。未来，作者旨在设计一个能适应多模态成像不同场景的通用模型，以提高其泛化能力。
>





