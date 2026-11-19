---
title: Flexible Fusion Network for Multi-Modal Brain Tumor Segmentation
published: 2025-07-08 17:38:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "自动化脑肿瘤分割对于辅助脑疾病诊断和评估疾病进展至关重要"
categories: 多模态医学图像分割
tags: [Medical Image Segmentation]
---
> 南京理工大学、东南大学

## 摘要

Automated brain tumor segmentation is crucial for aiding brain disease diagnosis and evaluating disease progress. Currently, **magnetic resonance imaging** (MRI) is a routinely adopted approach in the field of brain tumor segmentation that can provide different modality images. It is critical to leverage multi-modal images to boost brain tumor segmentation performance. Existing works commonly concentrate on generating a shared representation by fusing multi-modal data, while few methods take into account modality-specific characteristics. Besides, how to efficiently fuse arbitrary numbers of modalities is still a difficult task. In this study, we present a flexible fusion network (termed F2Net) for multi-modal brain tumor segmentation, which can flexibly fuse arbitrary numbers of multi-modal information to explore complementary information while maintaining the specific characteristics of each modality. Our F2Net is based on the encoder-decoder structure, which utilizes two Transformer-based feature learning streams and a cross-modal shared learning network to extract individual and shared feature representations. To effectively integrate the knowledge from the multi-modality data, we propose a cross-modal feature enhanced module (CFM) and a multi-modal collaboration module (MCM), which aims at fusing the multi-modal features into the shared learning network and incorporating the features from encoders into the shared decoder, respectively. Extensive experimental results on multiple benchmark datasets demonstrate the effectiveness of our F2Net over other state-of-the-art segmentation methods.

## 翻译

自动化脑肿瘤分割对于辅助脑疾病诊断和评估疾病进展至关重要。目前，磁共振成像（MRI）是脑肿瘤分割领域常用的方法，可以提供不同的模态图像。利用多模态图像提升脑肿瘤分割性能是关键。现有研究通常关注通过融合多模态数据生成共享表示，而很少有方法考虑模态特异性特征。此外，如何有效地融合任意数量的模态仍是一个困难的任务。在本研究中，我们提出了一种灵活的融合网络（称为F2Net）用于多模态脑肿瘤分割，该网络可以灵活地融合任意数量的多模态信息，以探索互补信息，同时保持每种模态的特异性特征。我们的F2Net基于编码器-解码器结构，利用两个基于Transformer的特征学习流和一个跨模态共享学习网络来提取个体和共享特征表示。为了有效整合多模态数据的知识，我们提出了一个跨模态特征增强模块（CFM）和一个多模态协作模块（MCM），分别旨在将多模态特征融合到共享学习网络中，并将编码器中的特征整合到共享解码器中。多个基准数据集上的广泛实验结果证明了我们的F2Net在其他最新分割方法上的有效性。

## 研究背景

本文聚焦多模态脑肿瘤分割，旨在提升分割性能，其研究背景如下：

-  **临床需求**：脑肿瘤是全球致命疾病之一，及时检测对临床评估和治疗策略至关重要。磁共振成像（MRI）是分析脑肿瘤的常用工具，包含**T1、T2、T1CE和FLAIR四种成像模态**，各模态能提供大脑结构的独特信息和肿瘤不同子区域的互补信息。但自动脑肿瘤分割面临肿瘤大小、形状和位置多样性大等挑战。


-  **现有方法局限**：卷积神经网络（CNNs）在医学分割任务中取得显著成功，如U - Net及其变体，但现有多模态脑肿瘤分割方法存在不足。早期融合策略不能有效保留各模态特征和探索模态间联系；晚期融合模型虽提取独立特征，但未充分利用模态特征提升分割性能；部分方法学习融合信息时忽略了模态编码器特征的重要性。因此，如何有效融合多模态数据，同时挖掘共享信息和捕捉模态特定特征以获得良好的分割结果仍是挑战。 


![Snipaste_2025-07-09_09-56-38](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/vx9g/0X0/0343OV8rl1Zi0cRhvKBEZ4.webp)

## 研究现状

- **医学图像分割**：CNN 算法广泛应用，U - Net 及其变体表现出色，且已拓展到 3D 分割；Transformer 用于计算机视觉任务，部分结合 Transformer 的模型在医学图像分割中取得进展。
- **脑肿瘤分割**：从生成概率模型转向神经网络模型，包括 2D 和 3D CNN 模型，部分模型结合 Transformer 提升性能。
- **多模态学习**：多模态数据融合受关注，有多种融合算法，如独立深度学习流、模态感知模块、共享特征提取等方法。

## 提出的模型

![Snipaste_2025-07-09_09-58-59](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_09-58-59.png)





F2Net主要包含两部分：两个**基于Transformer的特定学习网络**和一个**跨模态共享学习网络**。多模态数据首先输入到两个基于Transformer的特定学习网络中学习多级特征，然后通过提出的跨模态特征增强模块（CFM）对多级特征表示进行融合，融合后的特征以逐层策略通过共享学习网络。同时，使用跳跃连接将编码器路径的原始多级特征表示合并到相应的解码器中。此外，还提出了多模态协作模块（MCM），有选择地将特定编码器和共享编码器的特征集成到共享解码器中，以提供更丰富的信息，提高特征表示能力。



1. 基于Transformer的特定学习网络
   - 以基于Transformer的结构作为骨干网络，如PVTv2，它能捕捉长距离依赖关系。输入图像被划分为不重叠的块，将块特征投影到C维空间，并添加位置嵌入后输入到具有空间缩减注意力（SA）层的基于Transformer的编码器中。
   - 采用渐进收缩策略生成多尺度特征，得到两组多尺度的四个特征F1和F2。
   - 解码器路径使用跳跃连接将编码器的特征合并到解码器中，通过简单的级联块（“Cas. Block”）组合分层特征。每个解码器都有监督信号，有助于最终分割结果。
2. 跨模态共享学习网络
   - **跨模态特征增强模块（CFM）**：为有效利用不同模态的独特特征而提出。首先将两个模态特定编码器的特征进行拼接，经过3×3卷积层和Sigmoid激活函数生成归一化图wi，作为特征级注意力权重。然后将两个特征与wi相乘，得到增强的特征表示。接着对增强的特征图进行求和、平滑处理，并与原始特征拼接，最后结合上一层的上下文信息。CFM能够有效捕捉多模态之间的互补信息，减少背景噪声。
   - **多模态协作模块（MCM）**：在跨模态共享学习网络的解码器中使用。将模态特定编码器的特征与共享编码器的特征相乘，再与共享编码器的特征拼接，经过一系列操作得到增强的特征表示。还将模态特定编码器的特征协作相乘，与前面的增强特征拼接，最终得到协作特征。MCM能够利用多模态数据的互补信息，提高脑肿瘤分割结果。
   - **解码器路径**：利用融合后的特征fMCM1、fMCM2、fMCM3进行解码，通过跳跃连接将编码器的分层特征合并到共享解码器中，最终输出作为最终分割结果。
3. **损失函数**：采用混合损失评估预测结果与真实标签之间的差异，混合损失包括加权Dice损失和交叉熵（CE）损失。F2Net的总损失函数由共享学习网络的损失、两个模态特定解码器的损失组成。

### 模型优势

- **灵活性**：能够灵活融合任意数量的多模态信息，探索互补信息的同时保留每个模态的特定特征。
- **有效性**：在多个基准数据集上的实验结果表明，F2Net优于其他最先进的分割方法。
- **创新性**：提出的CFM和MCM模块有效提高了特征表示能力和分割性能。

## 实验（Compared with SOTA）

 > **数据集**：在三个数据集上评估F2Net，分别是**BraTS 2019、BraTS 2020和ISLES 2015 SISS**。其中，BraTS 2019有335个多模态磁共振扫描，BraTS 2020有369个多模态磁共振扫描，每个受试者都有T1、T1CE、T2和FLAIR四种模态及对应的分割掩码；ISLES 2015 SISS有28个训练病例，包含T1、T1CE、T2和扩散加权成像（DWI）四种模态。实验采用体积轴向平面的2D切片，对输入图像进行归一化和边界裁剪，并将每个2D切片裁剪为224×224大小。同时，将每个数据集中的所有受试者随机分为80%的训练数据和20%的测试数据。

> **实现细节**：使用在ImageNet - 1K上预训练的PVTv2作为F2Net的骨干网络，在一块NVIDIA RTX 2080Ti GPU上训练。采用SGD优化器，初始学习率为0.01，并按照“Poly”策略降低学习率，批大小设置为12，训练100个epoch。从BraTS 2019和BraTS 2020数据集中采用四种模态训练网络，从ISLES 2015数据集中选择三种模态训练分割方法。代码使用**PyTorch和MindSpore**实现，对于比较方法，除TranSiam外，均使用发布的源代码进行训练，TranSiam则按照原论文设置进行复现。

> **评估指标**：使用四个指标评估所有分割方法的有效性，分别是骰子分数（Dice）、交并比（IoU）、95%豪斯多夫距离（HD95）和敏感度。



1. **定量结果**：选择七种最先进的方法进行比较实验，包括单模态和多模态分割方法。结果表明，F2Net在这些数据集上的分割性能均高于其他比较方法，其关键优势在于能有效利用多模态数据间的相关性和互补信息，提升多模态脑肿瘤分割性能。
2. **定性比较**：可视化结果显示，F2Net取得了良好进展，与其他方法相比，漏分割组织更少。单模态方法往往无法分割不同类型的脑肿瘤，因为它们未考虑各模态的特征和模态间的关系；与其他多模态分割方法相比，由于提出的CFM和MCM，F2Net能取得更准确的结果和更清晰的边缘。



![Snipaste_2025-07-09_10-03-44](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_10-03-44.png)



![Snipaste_2025-07-09_10-03-50](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_10-03-50.png)



![Snipaste_2025-07-09_10-04-31](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_10-04-31.png)

## 实验（Ablation Experiments）​​

1. **CFM的有效性**：通过两个基线实验研究CFM的重要性，结果表明CFM能提高多模态融合的表征能力，提升分割性能，引入MCM时也能观察到性能提升。
2. **MCM的有效性**：基于一个基线实验研究MCM的益处，结果显示引入MCM组件能有效利用各模态特定编码器提取的特征，准确定位和分割真实肿瘤区域，在四个评估指标上均有更好表现。
3. **灵活融合策略的有效性**：在BraTS 2020数据集上设计多个消融实验，结果表明使用共享学习网络能获得更好性能，引入CFM和MCM时融合策略能挖掘丰富模式并产生高性能；使用四个完整模态时，分割精度相对更好，说明该融合策略能有效融合多模态数据，探索共享信息和模态特定特征。



![Snipaste_2025-07-09_10-05-33](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_10-05-33.png)

![Snipaste_2025-07-09_10-05-42](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-09_10-05-42.png)

## 结论

文章提出了用于**多模态脑肿瘤分割**的灵活融合网络F2Net，并得出以下结论： 

1. **性能优越**：F2Net能灵活融合任意数量的多模态信息，在三个数据集上的实验表明，相比其他先进的分割方法，它能有效利用多模态数据的相关性和互补信息，取得更高的分割性能。 
2. **模块有效**：交叉模态特征增强模块（CFM）和多模态协作模块（MCM）可有效捕捉多模态之间的互补信息，抑制背景噪声，提升特征表示能力，从而提高分割性能。
3. **策略可行**：灵活融合策略能高效融合多模态数据，挖掘丰富模式，明确探索共享信息和模态特定特征，使用更多模态时分割结果更好。不过，该模型在边界模糊和大病变情况下效果欠佳，后续需研究更轻量级骨干网络和自适应多模态融合方法。 





