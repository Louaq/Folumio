---
title: Text-driven Multiplanar Visual Interaction for Semi-supervised Medical Image Segmentation
published: 2025-12-15 15:34:00
expires: 2025-21-31 23:59:59
mathjax: true
description: "半监督医学图像分割"
category: 半监督医学图像分割
tags: [医学图像分割]
---
::github{repo="taozh2017/Text-SemiSeg"}
## 摘要

Semi-supervised medical image segmentation plays a critical method in mitigating the high cost of data annotation. When labeled data is limited, textual information can provide additional context to enhance visual semantic understanding. However, research exploring the use of textual data to enhance visual semantic embeddings in 3D medical imaging tasks remains scarce. In this paper, we propose a novel text-driven multiplanar visual interaction framework for semisupervised medical image segmentation (termed Text-SemiSeg), which consists of three main modules: Text-enhanced Multiplanar Representation (TMR), Category-aware Semantic Alignment (CSA), and Dynamic Cognitive Augmentation (DCA). Specifically, TMR facilitates text-visual interaction through planar mapping, thereby enhancing the category awareness of visual features. CSA performs cross-modal semantic alignment between the text features with introduced learnable variables and the intermediate layer of visual features. DCA reduces the distribution discrepancy between labeled and unlabeled data through their interaction, thus improving the model’s robustness. Finally, experiments on three public datasets demonstrate that our model effectively enhances visual features with textual information and outperforms other methods. Our code is available at https://github.com/taozh2017/Text-SemiSeg

## 翻译

半监督医学图像分割是降低数据标注成本的关键方法。当标记数据有限时，文本信息可以提供额外的上下文，以增强视觉语义理解。然而，探索使用文本数据来增强3D医学成像任务中的视觉语义嵌入的研究仍然很少。在本文中，我们提出了一种新的文本驱动的多平面视觉交互框架，用于半监督医学图像分割(称为text- semieg)，该框架由三个主要模块组成:文本增强多平面表示(TMR)，类别感知语义对齐(CSA)和动态认知增强(DCA)。具体而言，TMR通过平面映射促进文本-视觉交互，从而增强视觉特征的类别意识。CSA在引入可学习变量的文本特征和视觉特征中间层之间执行跨模态语义对齐。DCA通过标记和未标记数据之间的相互作用减少了它们之间的分布差异，从而提高了模型的鲁棒性。最后，在三个公共数据集上的实验表明，我们的模型有效地增强了文本信息的视觉特征，优于其他方法。我们的代码在https://github.com/taozh2017/Text-SemiSeg

## 研究背景

半监督医学图像分割通过结合有限标注数据与大量未标注数据，有效缓解了手动标注成本高的问题。现有方法主要分为一致性学习和伪标签方法，但常局限于特定模态或器官，缺乏泛化性。近年来，视觉语言模型（如CLIP）通过对比学习实现图像与文本对齐，在医学影像领域显示出补充语义信息的潜力。然而，将CLIP应用于3D医学分割时，现有方法（如VCLIPSeg）简单复制文本信息以匹配3D数据维度，既不符合CLIP的2D训练范式，也缺乏适应2D到3D跨维度操作的可学习参数。因此，如何设计更适配3D医学图像分割的半监督文本-视觉模型，成为当前研究的关键挑战。

## 研究现状

1. **半监督医学图像分割主流方法**
   - **一致性学习**：通过对输入/特征施加扰动（如裁剪、噪声）确保预测一致性（如Huang et al. [11]的切片错位扰动）。
   - **伪标签方法**：从无标签数据生成高置信度伪标签（如Han et al. [8]的类原型匹配、Wang et al. [22]的置信度阈值筛选）。
2. **视觉语言模型（VLM）的应用探索**
   - CLIP等模型通过对比学习实现图文对齐，为医学影像提供语义补充（如Liu et al. [15]将CLIP应用于3D医学影像）。
   - VCLIPSeg [14]首次将CLIP用于半监督3D分割，但采用简单文本复制匹配3D维度，与CLIP的2D训练范式冲突。

## 提出的模型

![Snipaste_2025-12-15_15-38-05](https://pic1.imgdb.cn/i/0343OW71jmJzlPMzdx2VDV.webp)



 ### 1. 文本增强多平面表示（TMR） 

- **功能**：通过平面映射实现文本-视觉交互，增强视觉特征的类别感知能力。  **实现方式**：将3D视觉特征压缩为冠状面、矢状面和轴状面三个2D平面特征，每个平面通过文本增强注意力操作融合文本语义，最后重构为3D体素嵌入 。**创新点**：采用提示学习策略，将可学习变量引入文本特征，更符合CLIP的2D训练范式 
### 2. 类别感知语义对齐（CSA）
- **功能**：实现文本特征与视觉特征中间层的跨模态语义对齐。**实现方式****：通过MSE正则化约束文本特征与视觉嵌入的距离，将两个视觉解码器的预测与文本特征进行对齐。
-  **公式**：$L_{cog} = \sum_{k=1}^{K}(F_{t}^{k} - \text{avg}(F_{v}^{p} \cdot \hat{y}_{1,k}))^2 + (F_{t}^{k} - \text{avg}(F_{v}^{p} \cdot \hat{y}_{2,k}))^2$ 
### 3. 动态认知增强（DCA） 
- **功能**：通过标记数据与未标记数据的交互减少分布差异，提升模型鲁棒性 。
- **实现方式**：利用真实标签和伪标签提取前景区域，融合到对方的背景中生成混合样本，针对性能较差的解码器进行更新 。
- **混合样本生成**：$x_{mix}^{l} = \sum_{k=1}^{K} x^{l} \cdot y_{k}^{l} + x^{u} \cdot (1 - y_{k}^{l})$ ### 整体损失函数 $L_{total} = L_{sup} + L_{cog} + L_{mix} + \lambda_u L_{unsup}$，其中： $L_{sup}$：监督损失（Dice+CE损失）， $L_{cog}$：类别感知对齐损失， $L_{mix}$：混合样本损失，  $L_{unsup}$：无监督一致性损失 

## 实验（Compared with SOTA）

> 数据集：
>
> 1. **Pancreas-CT数据集**
>    - 包含82例3D腹部CT扫描图像，分辨率为512×512，层厚1.5-2.5mm。
>    - 按[17]的设置，62例用于训练，20例用于测试。
> 2. **BraTS-2019数据集**
>    - 包含335例脑胶质瘤患者的MRI图像，包含T1、T2、T1CE、FLAIR四种模态。
>    - 按[16]的设置，仅使用FLAIR模态进行肿瘤分割；250例用于训练，25例用于验证，60例用于测试。
> 3. **MSD-Lung数据集**
>    - 包含63例CT扫描图像。
>    - 按[28]的设置，48例用于训练，15例用于测试。



#### 与现有方法的定量比较

在10%/20%标记数据比例下，Text-SemiSeg在三个数据集上的Dice系数均优于10种主流半监督分割方法（如UAMT [27]、DTC [17]、VClipSeg [14]等），具体提升如下：

- **Pancreas数据集**：10%标记数据时，Dice系数达81.27%，较第二名VClipSeg（74.77%）提升6.5%；20%标记数据时达83.50%。
- **BraTS-2019数据集**：10%标记数据时，Dice系数达85.27%，较第二名MLRP（84.29%）提升0.98%；20%标记数据时达86.69%。
- **MSD-Lung数据集**：20%标记数据时，Dice系数达65.02%，较第二名MLRP（62.12%）提升2.9%；40%标记数据时达68.21%。

![Snipaste_2025-12-15_15-43-25](https://pic1.imgdb.cn/item/693fbbfa4a4e4213d006698a.png)



## 实验（Ablation Experiments）​​

![Snipaste_2025-12-15_15-43-55](https://pic1.imgdb.cn/item/693fbc164a4e4213d00669ba.png)



- **关键模块有效性**：TMR、CSA、DCA三个模块均能独立提升性能，三者结合时效果最优（Pancreas数据集Dice达83.50%，BraTS达86.69%）。
- **多平面策略vs.复制策略**：相比VClipSeg的文本特征复制策略，多平面策略在Pancreas和BraTS数据集上Dice分别提升1.15%和1.12%，更符合CLIP的2D训练范式。
- **文本增强策略普适性**：将文本增强模块集成到UAMT、DTC等方法中，Dice系数平均提升1.43%-4.77%，验证了文本增强的通用性。

## 结论

本文提出了一种新的文本-半分割框架，用于半监督的三维医学图像分割。我们的模型充分利用CLIP的对齐功能，在3D环境中丰富文本提示的视觉特征。此外，为了增强标记和未标记数据之间的交互，本文提出了动态认知增强，这大大提高了模型的泛化能力。在各种分割任务中进行的大量实验表明，本文的模型优于现有方法，并且更有效地适应3D场景。





