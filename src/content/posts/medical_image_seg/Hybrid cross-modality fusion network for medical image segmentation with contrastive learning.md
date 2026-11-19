---
title: Hybrid cross-modality fusion network for medical image segmentation with contrastive learning
published: 2025-07-25 11:05:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "医学图像分割已广泛应用于基于人工智能的临床应用中"
categories: 多医学图像分割
tags: [Medical Image Segmentation]
---

## 摘要

**Medical image segmentation has been widely adopted** in artificial intelligence-based clinical applications. The integration of medical texts into image segmentation models has significantly improved the segmentation performance. It is crucial to design an effective fusion manner to integrate the paired image and text features. Existing multi-modal medical image segmentation methods fuse the paired image and text features through a non-local attention mechanism, which lacks local interaction. Besides, they lack a mechanism to enhance the relevance of the paired features and keep the discriminability of unpaired features in the training process, which limits the segmentation performance. To solve the above problem, we propose a hybrid cross-modality fusion network (HCFNet) based on contrastive learning for medical image segmentation. The key designs of our proposed method are a multi-stage cross-modality contrastive loss and a hybrid cross-modality feature decoder. The multi-stage cross-modality contrastive loss is utilized to enhance the discriminability of the paired features and separate the unpaired features. Furthermore, the hybrid cross-modality feature decoder conducts local and non-local cross-modality feature interaction by a local cross-modality fusion module and a non-local cross-modality fusion module, respectively. Experimental results show that our method achieved state-of-the-art results on two public medical image segmentation datasets.

## 翻译

医学图像分割已广泛应用于基于人工智能的临床应用中。将医学文本整合到图像分割模型中显著提高了分割性能。设计有效的融合方式以整合成对的图像和文本特征至关重要。现有的多模态医学图像分割方法通过非局部注意机制融合成对的图像和文本特征，但缺乏局部交互。此外，它们缺乏增强成对特征相关性和在训练过程中保持未配对特征可辨性的机制，这限制了分割性能。为解决上述问题，我们提出了一种基于对比学习的**混合跨模态融合网络**（HCFNet）用于医学图像分割。我们提出方法的关键设计是多阶段跨模态对比损失和混合跨模态特征解码器。多阶段跨模态对比损失用于增强成对特征的可辨性并分离未配对特征。此外，混合跨模态特征解码器分别通过局部跨模态融合模块和非局部跨模态融合模块进行局部和非局部跨模态特征交互。实验结果表明，我们的方法在两个公共医学图像分割数据集上达到了最先进的结果。

## 研究背景

医学图像分割在基于人工智能的临床应用中至关重要，能辅助诊断、治疗规划和个性化医疗发展。但单模态（仅基于医学图像）的分割方法存在不足，如受图像质量和标注数据稀缺的影响。

为解决这些问题，研究人员开始采用多模态学习框架，将医学文本融入图像分割模型，以提高分割性能。然而，现有的多模态医学图像分割方法存在局限性：一是通过非局部注意力机制融合图像和文本特征，缺乏局部交互；二是在训练过程中缺乏增强配对特征相关性和区分非配对特征的机制，限制了分割性能。

基于此，本文提出了一种基于对比学习的混合跨模态融合网络（HCFNet）用于医学图像分割，旨在设计有效的融合方式，增强配对特征的可区分性，分离非配对特征，同时实现局部和非局部跨模态特征交互，以提升医学图像分割的性能。

## 研究现状

- **单模态医学图像分割**：CNN和Transformer等深度学习技术广泛应用，如U-Net、UNet++、基于Transformer的方法等。为解决数据不足问题，半监督技术被引入。
- **多模态医学图像分割**：利用文本辅助图像分割受关注，CLIP可通过对比学习连接图像与自然语言，LViT、GLoRIA等方法将医学文本融入分割过程。
- **对比学习**：在多模态学习中广泛应用，如MMGL框架在半监督心脏图像分割中取得显著效果。

## 提出的模型

![Snipaste_2025-07-25_11-08-58](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wQoG/0X0/0343OVCXNBDZ94h7gqD5Eg.webp)

论文提出了一种基于对比学习的混合跨模态融合网络（Hybrid Cross-Modality Fusion Network，HCFNet）用于医学图像分割。

1. **整体架构**：主要由双模态特征编码器、混合跨模态特征解码器和分割头三部分组成。同时还设计了多阶段跨模态对比损失，用于增强配对特征的可区分性并分离非配对特征。在训练阶段，冻结了文本编码器模块的权重以减少训练参数的数量。
2. 双模态特征编码器
   - **图像编码器**：采用ConvNeXt - Tiny作为视觉编码器，提取输入图像不同阶段的特征。
   - **文本编码器**：使用CXR - BERT从文本输入中提取文本特征。
   - **多阶段跨模态对比损失**：利用图像特征和文本特征计算该损失，通过最小化该损失，使模型提高对图像 - 文本特征对的理解能力，增强匹配对的相似性，降低不匹配对的相似性。
3. 混合跨模态特征解码器：包含三个混合跨模态特征融合层，每层由非局部跨模态融合模块（NLCFM）、局部跨模态融合模块（LCFM）和融合块组成。
   - **非局部跨模态融合模块（NLCFM）**：利用多头交叉注意力（MHCA）机制，将语言和图像特征进行融合，增强视觉表示。
   - **局部跨模态融合模块（LCFM）**：利用文本特征生成缩放和平移调制矩阵，对图像特征进行调制和增强，使模型更关注局部细节。
   - **融合块**：将非局部特征和局部特征进行拼接和上采样操作，结合局部和非局部融合结果，得到更全面的特征表示。
4. **分割头**：主要由子像素卷积和1×1卷积组成。子像素卷积将解码器输出的特征上采样到原始图像大小，1×1卷积调整通道数量，得到最终的预测结果。
5. **损失函数**：最终的训练损失函数包括交叉熵损失、Dice损失和多阶段跨模态对比损失，通过综合这些损失，优化模型性能。



## 数据集和实验设置

### 1. 数据集和评估指标

- 数据集：
  - **MosMedData+**：由莫斯科市医院提供，包含2729张肺部感染的CT扫描切片，其中训练集2183张，验证集273张，测试集273张，且有受影响肺部区域的文本描述。
  - **QaTa - COV19**：由卡塔尔大学和坦佩雷大学的研究人员整理，包含9258张显示COVID - 19感染区域的X射线图像，训练集5716张，验证集1429张，测试集2113张，有肺部感染区域的文本描述。
- **评估指标**：使用Dice值和平均交并比（mIoU）作为评估指标。

### 2. 实现细节

使用PyTorch，采用单块NVIDIA 3090 24G GPU进行训练和测试。使用由Dice损失、交叉熵损失和多阶段跨模态对比损失组成的复合损失函数，网络使用AdamW优化器进行训练，批量大小为32，采用余弦退火学习率策略，初始学习率为3e - 4，最小学习率为1e - 6，还实现了早停机制。

## 实验（Compared with SOTA）

将提出的HCFNet与现有的单模态和多模态医学图像分割方法在QaTa - COV19和MosMedData+数据集上进行比较。结果表明，HCFNet在两个数据集上都取得了最优性能，在Dice值和mIoU方面优于其他方法，且在计算成本和速度方面也有较好表现。

![Snipaste_2025-07-25_11-13-59](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-25_11-13-59.png)

![Snipaste_2025-07-25_11-14-03](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-25_11-14-03.png)

## 实验（Ablation Experiments）​​

###  消融实验

- **不同模块对分割性能的影响**：在基线模型基础上分别引入多阶段跨模态对比损失（MCCL）和局部跨模态融合模块（LCFM），结果显示两者都能提升模型性能，且结合使用效果更佳。
- **非局部跨模态融合模块中融合方式的影响**：NLCFM和LCFM结合使用能取得最佳结果，单独使用LCFM会使Dice值下降。
- **骨干网络选择的影响**：将图像编码器ConvNeXt - Tiny替换为ResNet18会使Dice和mIoU分别降低4.0%和5.32%。

###  可视化结果比较

在QaTa - COV19和MosMedData+数据集上，将HCFNet与Threads、TGANet和UCTransNet等方法进行可视化结果比较，HCFNet的分割结果更优，边界更准确，对小目标的分割效果更好。



![Snipaste_2025-07-25_11-15-25](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-25_11-15-25.png)

## 泛化实验

将HCFNet应用于遥感实体分割任务，在RefSegRS数据集上进行实验，并与LAVT、CrossVLT等最新方法比较，结果表明HCFNet在oIoU和mIoU指标上取得了最优性能，证明了其良好的泛化能力。



![Snipaste_2025-07-25_11-16-41](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-25_11-16-41.png)

## 结论

作者提出了**基于对比学习的混合跨模态融合网络**（HCFNet）用于医学图像分割，并得出以下结论：

- **模型有效性**：多阶段跨模态对比损失增强了配对特征的可区分性，分离了未配对特征；混合跨模态特征解码器中的非局部和局部跨模态融合模块能有效融合特征，提升模型对多模态特征的理解。
- **实验验证**：在MosMedData+和Qata - COV19数据集上的实验结果表明，HCFNet的分割性能优于现有单模态和多模态医学图像分割方法，且计算成本较低。
- **泛化能力**：HCFNet在遥感实体分割任务中也取得了最优结果，展现出良好的泛化能力。

总体而言，HCFNet为医学图像分割提供了有效的解决方案，具备实际应用价值。



> 展望：在未来的工作中，我们打算与重庆大学肿瘤医院合作，收集其他解剖结构的多模态医学图像分割数据集。此外，我们将更加注重构建更高效的分割结构。
