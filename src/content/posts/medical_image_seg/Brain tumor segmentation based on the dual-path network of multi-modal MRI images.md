---
title: Brain tumor segmentation based on the dual-path network of multi-modal MRI images
published: 2025-07-19 12:00:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "由于肿瘤呈浸润性生长，胶质瘤的边界通常与脑组织融合"
categories: 多模态医学图像分割
tags: [Medical Image Segmentation, Multi-modal MRI Images]
---

## 摘要

Because of the tumor with infiltrative growth, the **glioma boundary is usually fused with the brain tissue**, which leads to the failure of accurately segmenting the brain tumor structure through single-modal images. The multi-modal ones are relatively complemented to the inherent heterogeneity and external boundary, which provide complementary features and outlines. Besides, it can retain the structural characteristics of brain diseases from multi angles. However, due to the particularity of multi-modal medical image sampling that increases uneven data density and dense structural vascular tumor mitosis, the glioma may have atypical boundary fuzzy and more noise. To solve this problem, in this paper, the dualpath network based on multi-modal feature fusion (MFF-DNet) is proposed. Firstly, the proposed network uses different kernels multiplexing methods to realize the combination of the large-scale perceptual domain and the non-linear mapping features, which effectively enhances the coherence of information flow. Then, the over-lapping frequency and the vanishing gradient phenomenon are reduced by the residual connection and the dense connection, which alleviate the mutual influence of multi-modal channels. Finally, a dual-path model based on the DenseNet network and the feature pyramid networks (FPN) is established to realize the fusion of low-level, middle-level, and high-level features. Besides, it increases the diversification of glioma non-linear structural features and improves the segmentation precision. A large number of ablation experiments show the effectiveness of the proposed model. The precision of the whole brain tumor and the core tumor can reach 0.92 and 0.90, respectively.

## 翻译

由于肿瘤呈浸润性生长，胶质瘤的边界通常与脑组织融合，这导致无法通过单模态图像准确分割脑肿瘤结构。多模态图像在固有异质性和外部边界方面具有相对互补性，提供了互补的特征和轮廓。此外，它可以从多个角度保留脑部疾病的结构特征。然而，由于多模态医学图像采样的特殊性，增加了不均匀的数据密度和密集的结构性血管肿瘤有丝分裂，胶质瘤可能具有非典型的边界模糊和更多的噪声。为了解决这个问题，本文提出了一种基于多模态特征融合的双路径网络（MFF-DNet）。首先，所提出的网络使用不同的核复用方法，实现大规模感知域与非线性映射特征的结合，有效增强信息流的一致性。然后，通过残差连接和密集连接减少重叠频率和梯度消失现象，缓解多模态通道的相互影响。最后，建立了基于DenseNet网络和特征金字塔网络（FPN）的双路径模型，实现低级、中级和高级特征的融合。此外，它增加了胶质瘤非线性结构特征的多样性，提高了分割精度。大量消融实验显示了所提出模型的有效性。整个脑肿瘤和核心肿瘤的精度分别可达0.92和0.90。

## 研究背景

这篇文章聚焦脑肿瘤分割问题，其研究背景主要基于以下几点：

1. **脑肿瘤特性与诊断需求**：神经胶质瘤是常见中枢神经系统疾病，分为高低不同等级，恶性程度与预后差异大。获取肿瘤位置及分级对治疗至关重要。磁共振成像（MRI）能提供多角度多模态图像，广泛用于脑疾病检测，但肿瘤浸润生长使边界与脑组织融合，单模态图像难以准确分割肿瘤结构。
2. **传统方法的局限性**：传统深度学习模型虽在脑肿瘤分割上有进展，如卷积神经网络（CNN）、全卷积网络（FCN）、Unet网络、DenseNet网络和特征金字塔网络（FPN）等，但存在诸多不足。如卷积过程丢失边界特征，上采样操作使特征图不完整；不同大小卷积核在采样时易出现重叠不均，导致梯度消失或爆炸；缺乏上下文信息和局部感受野特征，难以实现层间和层内特征融合，影响分类精度。
3. **本文研究目的**：为克服上述网络的缺点，提高脑肿瘤分割精度，本文提出基于多模态特征融合的双路径网络（MFF - DNet）模型。



## 研究现状

- **多模态 MRI 应用广泛**：多模态 MRI 图像能从多角度保留脑疾病结构特征，在脑肿瘤检测中发挥重要作用，如 FLAIR、T1、T2 和 T1c 图像各具优势，为脑肿瘤检测和诊断提供了丰富信息。
- **深度学习模型不断改进**：传统深度学习模型在脑肿瘤分割领域取得显著进展，如 CNN、FCN、Unet、DenseNet 和 FPN 等网络模型。这些模型在提取肿瘤特征和分割肿瘤方面各有特点，但也存在一些不足。

![Snipaste_2025-07-20_11-07-51](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ZECK/0X0/0343OUMqEMVAr1ImHzqryu.webp)

## 提出的模型

![Snipaste_2025-07-20_11-07-11](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-20_11-07-11.png)

### 创新点

1. 不同大小的卷积核复用：
   - 使用大卷积核（1×1@128）和小卷积核（1×1@32）训练多模态MRI图像和掩码图像。大卷积核具有大感受野和空间信息，小卷积核具有强非线性映射能力，二者结合可获得肿瘤的低级特征，减少训练参数数量和采样过程中的信息损失，增强信息流的有效性和连贯性。
   - 1×1卷积的两步操作可实现跨模态交互和多模态信息的集成特征。采用最大池化层，有效减少训练数据量和网络复杂度，增强模型泛化能力。
2. 残差连接和密集连接：
   - 将单模态信息视为特征通道，通过密集连接结合多模态局部信息和全局特征，预测像素归属。例如，利用FLAIR图像和T1c图像的特点，结合T2图像获取核心肿瘤的非线性特征并对像素进行分类。
   - 对输入元素进行标准化处理，调整公式以实现层间标准化，激活特征的移动和缩放。使用ReLU激活函数使特征值落入线性区域，缓解过拟合导致的梯度消失问题；残差连接可自适应地校正大数据的复杂影响，细化网络。
3. 双路径网络：
   - 结合DenseUnet和FPN构建双路径模型。DenseUnet将低级特征与中级特征融合，保留大量原始特征，减少参数数量，缓解梯度消失问题；FPN将中级信息与高级特征结合，突出肿瘤结构，增加胶质瘤非线性结构特征的多样性，提高分割精度。
   - 设置初始学习率为5 * 10⁻⁴，通过自适应运动估计优化器计算偏差校正后的学习率，最后使用softmax函数回归得到输出模型。



### 模型工作流程

1. 数据预处理：
   - **偏置场校正**：使用N4ITK方法校正MRI图像的偏置场，遍历所有像素计算类内方差，去除磁噪声干扰，确保同一MRI单模态序列的最终强度分布在相似范围内。
   - **区域生长算法**：通过比较像素的颜色和纹理特征，选择初始种子点，利用区域生长算法得到掩码图像，反映脑肿瘤的形状、外观以及与周围组织的关系，输入网络以快速掌握病变与周围组织的时空关系。
   - **差异图像（DI）**：计算MRI图像序列相邻特征的差异，去除与脑肿瘤结构识别无关的冗余区域，减少过拟合现象和泛化误差。
2. 特征提取与融合：
   - 利用不同大小的卷积核复用获取肿瘤的低级特征，通过残差连接和密集连接调整多模态图像中的特征权重，减少重叠现象的影响。
   - 双路径网络将低级、中级和高级特征进行融合，增强模型对肿瘤特征的识别和分析能力。
3. **模型训练与优化**：使用BraTS数据集进行训练和测试，设置相关参数，通过自适应运动估计优化器调整学习率，使用softmax函数回归得到输出模型。
4. **实验评估**：采用Dice、Sensitivity和Specificity指标评估模型的分割精度，通过消融实验从多模态图像、掩码图像和补丁大小三个方面分析模型的有效性，并与其他脑肿瘤分割算法进行比较。



## 实验（Compared with SOTA）

- **数据集**：使用**BraTS 2015数据集**，包括220例高级别胶质瘤（HGG）和54例低级别胶质瘤（LGG），分为训练集和测试集。
- **评估指标**：使用**Dice、Sensitivity和Specificity**指标评估模型的分割精度。

![Snipaste_2025-07-20_11-10-02](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-20_11-10-02.png)

![Snipaste_2025-07-20_11-10-14](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-20_11-10-14.png)

- **与其他算法比较**：与其他脑肿瘤分割算法相比，MFF - DNet模型的全肿瘤和核心肿瘤精度分别可达0.92和0.90，在精度、灵敏度和特异性方面表现更优。

## 实验（Ablation Experiments）​​

- 消融实验分析：
  - **多模态图像**：单模态T1c图像分割精度较高，基于T1c图像测试其他双模态和多模态图像的精度，多模态FLAIR、T1c和T2图像的全肿瘤和核心肿瘤精度可达0.92和0.90。
  - **掩码图像**：掩码图像提供位置特征，可克服小卷积核导致的信息流不连贯问题，提高分割精度。
  - **图像补丁**：不同大小的补丁对分割性能影响较小，验证了模型的鲁棒性。



![Snipaste_2025-07-20_11-11-56](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-20_11-11-56.png)

## 结论

作者提出基于**多模态MRI脑肿瘤图像的双路径MFF - DNet模型**，该模型融合低、中、高层特征，增加了胶质瘤非线性结构特征的多样性，提高了分割精度；通过不同内核复用实现了更广泛的感受野和非线性映射能力的结合，解决了边界特征图不完整问题；利用残差连接和密集连接，获得更准确的生理组织和软组织对比结构特征，克服了MRI脑肿瘤图像重叠不均问题。消融实验验证了模型三个创新点在BraTS数据集上的有效性，表明其较现有脑肿瘤分割方法有明显优势。后续工作将聚焦于**特征权重自适应调整和多模态特征的进一步融合**。
