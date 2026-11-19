---
title: MsgFusion Medical Semantic Guided Two-Branch Network for Multimodal Brain Image Fusion
published: 2025-07-15 14:20:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "多模态图像融合在医学图像分析和应用中起着至关重要的作用"
categories: 多模态医学图像融合
tags: [MR, CT, PET, SPECT]
---

作者单位

## 摘要

Multimodal image fusion plays an essential role in medical image analysis and application, where computed tomography (CT), magnetic resonance (MR), single-photon emission computed tomography (SPECT), and positron emission tomography (PET) are commonly-used modalities, especially for brain disease diagnoses. Most existing fusion methods do not consider the characteristics of medical images, and they adopt similar strategies and assessment standards to natural image fusion. While distinctive medical semantic information (MS-Info) is hidden in different modalities, the ultimate clinical assessment of the fusion results is ignored. Our MsgFusion first builds a relationship between the key MS-Info of the MR/CT/PET/SPECT images and image features to guide the CNN feature extractions using two branches and the design of the image fusion framework. For MR images, we combine the spatial domain feature and frequency domain feature (SF) to develop one branch. For PET/SPECT/CT images, we integrate the gray color space feature and adapt the HSV color space feature (GV) to develop another branch. A classification-based hierarchical fusion strategy is also proposed to reconstruct the fusion images to persist and enhance the salient MS-Info reflecting anatomical structure and functional metabolism. Fusion experiments are carried out on many pairs of MR-PET/SPECT andMR-CT images. According to seven classical objective quality assessments and one new subjective clinical
quality assessment from 30 clinical doctors, the fusion results of the proposed MsgFusion are superior to those of the existing representative methods.

## 翻译

**多模态图像融合**在医学图像分析和应用中起着至关重要的作用，其中计算机断层扫描（CT）、磁共振成像（MR）、单光子发射计算机断层扫描（SPECT）和正电子发射断层扫描（PET）是常用的模态，尤其在脑疾病诊断中。大多数现有的融合方法没有考虑医学图像的特征，采用与自然图像融合类似的策略和评估标准。尽管不同模态中隐藏着独特的医学语义信息（MS-Info），但融合结果的最终临床评估被忽视。我们的MsgFusion首先建立了MR/CT/PET/SPECT图像的关键MS-Info与图像特征之间的关系，以指导使用两个分支的CNN特征提取和图像融合框架的设计。对于MR图像，我们结合空间域特征和频率域特征（SF）来开发一个分支。对于PET/SPECT/CT图像，我们整合灰度颜色空间特征并调整HSV颜色空间特征（GV）以开发另一个分支。还提出了一种基于分类的分层融合策略，用于重建融合图像，以保持和增强反映解剖结构和功能代谢的显著MS-Info。融合实验在多组MR-PET/SPECT和MR-CT图像上进行。根据七种经典客观质量评估和来自30位临床医生的一项新的主观临床质量评估，所提出的MsgFusion的融合结果优于现有的代表性方法。

## 研究背景

本文聚焦**多模态脑图像融合**方法研究，撰写目的在于解决现有方法的局限，其研究背景主要如下：
1. **多模态脑图像融合的重要性**：多模态图像融合在医学图像分析与应用中作用重大，特别是在脑部疾病诊断方面。CT、MR、SPECT 和 PET 是常用的成像方式，融合这些图像能让医生更方便观察和诊断病情。 
2. **现有方法的局限性**：多数现有融合方法未考虑医学图像特性，采用与自然图像融合相似的策略和评估标准，忽略了不同模态中独特的医学语义信息（MS - Info），以及对融合结果的最终临床评估。 
3. **研究的必要性**：为更好地保留和增强关键 MS - Info，提高脑部疾病诊断的准确性，作者提出 MsgFusion 方法，旨在深入分析医学图像特性，设计专用网络模型，实现多模态脑图像的有效融合。 

## 研究现状

1. **传统融合方法**：受人工认知驱动，依赖手动提取特征，需专业知识和复杂参数调整，且针对特定应用场景。
2. **深度学习融合方法**：数据驱动，能学习大量样本获取抽象特征，具有较强的鲁棒性和泛化能力，但在医学图像分析领域仍处于早期发展阶段。
3. **应用情况**：图像融合已广泛应用于计算机视觉、遥感、交通等领域，在医学领域自20世纪90年代开始发展，常用于脑疾病诊断。

## 提出的模型

 ### 整体架构 

设计了一个双分支网络，包括**SF分支和GV分支**，通过结合多模态医学图像的关键医学语义信息（MS - Info）与图像特征，引导CNN特征提取和图像融合框架的设计。

### 分支设计
1.  **SF分支**：
主要用于提取MR图像的深度特征。结合空间域和频率域信息，通过傅里叶变换将图像从空间域转换到频率域，更方便地提取与关键MS - Info对应的特征，最大程度保留和增强MR图像的关键MS - Info。  
 - **空间域特征提取**：通过神经网络的卷积操作获取源MR图像的深度特征。设置卷积核大小为7×7，步长为1，填充为3，通道放大到64，经过批量归一化和LeakyReLU激活函数处理，输出记为SF1。   
 - **频率域特征提取**：对图像进行二维离散傅里叶变换和逆变换，得到频率域处理后的输出记为SF2。通过计算傅里叶变换后复数的振幅和相位，获取图像的全局和局部信息。最后将空间域和频率域的特征进行融合，采用加权图特征融合多尺度深度特征，得到最终的融合特征图。

2. **GV分支**：用于提取CT/PET/SPECT图像的深度特征。结合多尺度灰度图像和HSV颜色空间的亮度信息，采用多尺度级联策略和HSV颜色空间变换，提取全局轮廓、局部形状特征和亮度信息。   
 - **多尺度级联特征提取**：从灰度空间采用多尺度级联策略，通过卷积层、池化层、上采样和跳跃连接操作，提取源图像的全局轮廓和局部形状特征，补偿不同尺度下的信息损失。采用多尺度和跳跃连接策略，捕获不同尺度和层的信息，减少信息损失。   
 - **HSV颜色空间亮度信息提取**：对PET/SPECT图像进行HSV颜色空间变换，计算V分量，并定义一个新的亮度值V′，以突出功能图像的MS - Info。通过后续处理提取HSV颜色空间的深度特征GV2。



![Snipaste_2025-07-15_16-34-04](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ozO6/0X0/0343OVSRsOSVKEQUenoAKf.webp)

## 实验（Compared with SOTA）

### 数据集

1. **实验数据**：实验在不同的脑图像对上进行，包括MR-SPECT、MR-CT和MR-PET图像对。其中555对MR-PET图像对作为训练集，来自ADNI；测试使用了30对MR-CT、MR-SPECT和MR-PET图像对，来自Whole Brain Atlas，涵盖脑血管疾病（中风）和肿瘤疾病（脑肿瘤）。
2. **对比方法**：将MsgFusion与九种其他代表性方法进行比较，分别是LatLrr、IFCNN、NestFuse、atsIF、FusionDN、FusionGAN、FunFuseAn、WPADCPCNN和OLTPSpS。
3. **评估指标**：采用六种常用评估指标（EN、SD、MI、rSFe、SM、VIFF）和一个相对新颖的指标RQ来评估融合效果。由于不同指标值差异较大，进行了适当的线性变换以便在同一图中比较。

![Snipaste_2025-07-15_16-37-59](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-15_16-37-59.png)

![Snipaste_2025-07-15_16-38-06](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-15_16-38-06.png)



- **MR - SPECT对融合**：源MR图像清晰显示脑脊液等软组织的纹理细节，SPECT的不同颜色和亮度可反映代谢信息。对比各方法融合结果，MsgFusion在多个区域能保留更清晰的结构和纹理细节，其评估指标（如EN、SD、MI、rSFe和VIFF）表现最佳，能保留和增强重要医学信息。
- **MR - CT对融合**：CT图像易显示骨骼等硬轮廓，MR图像显示软组织结构。聚焦六个感兴趣区域（ROI）分析，MsgFusion在各区域能更好地保留和增强重要医学特征，除rSFe外其他评估指标值最佳。



![Snipaste_2025-07-15_16-39-20](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-15_16-39-20.png)

## 其他实验

1. **计算成本**：在特定计算环境下对30对不同数据模态进行测试，记录每种方法的平均运行时间。MsgFusion平均运行时间为2.0048秒，时间成本可接受。
2. **问卷调查**：向30位不同医院神经内科和医学影像科临床医生发放问卷，对融合效果进行主观评价。问卷基于15组融合实验设计15个问题，每个问题提供6种代表性方法的融合图像作为选项，医生根据临床经验选择最有利于观察和诊断的结果。统计结果显示，MsgFusion在8组实验中最常被选为最佳融合图像，在4组中第二常被选，其融合效果远超其他方法。



## 实验（Ablation Experiments）​​

为验证SF分支中结合频域和GV分支中结合HSV颜色空间的必要性和有效性，对MR - PET融合进行消融实验。结果表明，不考虑频域处理会丢失更多MR图像信息，不考虑HSV颜色空间改进亮度则无法反映PET的功能信息，同时考虑两者时融合效果明显更好。

![Snipaste_2025-07-15_16-40-52](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-15_16-40-52.png)

## 结论

作者提出了一种由**医学语义信息**（MS - Info）引导的脑部疾病图像**深度特征融合方法MsgFusion**。分析了MR/CT/PET/SPECT的关键MS - Info，设计了包含SF - 分支和GV - 分支的双分支网络。实验表明，与现有方法相比，该方法具有明显优势，具体体现在：在MR - CT、MR - SPECT、MR - PET图像融合实验中效果更佳；临床医生通过问卷调查评估融合结果，统计数据显示MsgFusion的融合效果最佳。未来，作者将考虑扩展框架，整合CT、MR、PET、SPECT、DTI等更多成像模态，并应用于临床诊断。 


