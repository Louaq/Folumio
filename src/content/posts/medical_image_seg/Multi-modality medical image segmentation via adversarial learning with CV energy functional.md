---
title: Multi-modality medical image segmentation via adversarial learning with CV energy functional
published: 2025-07-30 12:00:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "基于深度学习的医学图像处理方法逐渐成为主流"
categories: 多模态医学图像分割
tags: [Medical Image Segmentation]
---
> 部分难懂

## 摘要

Medical image processing methods based on deep learning have gradually become mainstream. Automatic segmentation of brain tumor from multi-modality magnetic resonance images (MRI) using deep learning method is the key to the diagnosis of gliomas. In our hybrid network, the proposed neural network framework consists of Segmentor and Critic. A new Transformer-CV-Unet (TCUnet) is introduced to gain more semantic features. We employ the new TCUnet as the generator of GAN to complete the segmentation task to increase robustness and efficiency. With a generator to segment the target images, Critic is then built to tightly merge the latent representation with hierarchical characteristics from each modality. Moreover, a hybrid adversarial with multi-phase CV energy functional is introduced. Our hybrid network, AdvTCUnet, combines the advantages of both methods. Furthermore, extensive experiments on BraTs 19–21 show that the proposed model performs better than existing state-of-the-art techniques for segmenting brain tumor MRI (e.g., the Dice Similarity Coefficient of ET, WT and TC on BraTs 21 can reach 0.8642, 0.9303 and 0.9060, respectively).

## 翻译

基于深度学习的医学图像处理方法逐渐成为主流。使用深度学习方法对多模态磁共振成像（MRI）进行脑肿瘤自动分割是诊断胶质瘤的关键。在我们的混合网络中，提出的神经网络框架由Segmentor和Critic组成。引入了一种新的Transformer-CV-Unet（TCUnet），以获得更多语义特征。我们采用新的TCUnet作为GAN的生成器来完成分割任务，以提高鲁棒性和效率。通过生成器分割目标图像，随后构建Critic以紧密融合每种模态的层次特征的潜在表示。此外，还引入了带有多相CV能量泛函的混合对抗。我们的混合网络AdvTCUnet结合了两种方法的优点。此外，在BraTs 19-21上的大量实验表明，所提出的模型在分割脑肿瘤MRI方面优于现有的最先进技术（例如，在BraTs 21上的ET、WT和TC的Dice相似系数分别可以达到0.8642、0.9303和0.9060）。

## 研究背景

本文聚焦于多模态脑肿瘤磁共振图像（MRI）分割，旨在解决现有方法的局限性，提升分割性能，其研究背景如下：

- **多模态成像的重要性**：多模态图像分割在医学图像分析中表现出色，能提高多种图像处理任务的性能。MRI作为常用的临床检查方法，不同模态（T1、T1ce、T2、FlAIR）可提供不同信息，有助于全面理解病变情况。
- **传统方法的局限性**：目前多数医学图像分割算法使用单模态数据和传统变分技术，传统变分方法在语义图像分割上存在局限，缺乏特征表示能力。
- **深度学习方法的发展**：基于深度学习的医学图像处理方法逐渐成为主流，生成模型的分割技术受到关注。将传统变分方法与卷积神经网络结合，能取得较好结果，因此作者认为结合传统变分技术与生成对抗网络（GAN）可带来更优效果。
- **Transformer的应用**：Transformer在自然语言处理和计算机视觉领域表现良好，相关改进模型不断涌现。但现有方法在3D医学图像分割中处理局部和全局信息存在挑战。

## 研究现状

- **多模态学习**：在多模态融合方面取得进展，如Wan等人提出新的无监督多视图表示学习方法，Han等人提出多模态动态分类技术。
- **图像分割**：传统变分方法推动了图像分割技术发展，CV模型等有效辅助图像分割。基于深度学习的医学图像处理方法逐渐成为主流，生成模型的分割技术受关注。
- **医学图像分割**：多模态或跨模态分割技术取得成功，一些方法在脑肿瘤、肺部肿瘤等分割任务中应用，Transformer方法在医学图像分割中表现良好。
- **生成对抗网络**：在医学图像分割领域广泛应用，如Chen等人提出双注意力域自适应分割网络。

## 提出的模型

![Snipaste_2025-07-31_09-14-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/R0wy/0X0/0343OVW7UPfXIqUXuMpDnM.webp)

AdvTCUnet由Segmentor（分割器）和Critic（判别器）两部分组成。Segmentor采用改进的Unet网络TCUnet作为生成器完成分割任务，Critic用于将各模态的潜在表示与分层特征紧密融合。

### 核心组件

- Transformer - CV - Unet（TCUnet）：
  - **特征处理**：使用双层ViT模块扩大感受野，获取全局特征信息，克服卷积层的局限性。通过TransBTS中的特征表示方法处理输入，将得到的特征表示序列输入到典型的Transformer块（由Multi - Head Attention（MHA）块和Feed Forward Network（FFN）组成）。
  - **3D注意力机制**：将注意力从2D转换为3D，嵌入到Segmentor的解码器部分，负责通道注意力和空间注意力。编码器提取的第i个特征与解码器的第i + 1个特征相连，经过通道注意力和空间注意力后输入到第i个解码层。
- 基于多相CV能量泛函的损失函数



## 实验设置

### 1. 数据集

使用了MICCAI脑肿瘤分割竞赛的BraTs数据集，该数据集包含Flair、T1、T1ce和T2四种成像模态。各数据集样本数量不同，如BraTs 21包含1251个训练图像、219个验证图像和530个测试图像；BraTs 20训练集有369个样本，其中295个用于训练和验证，74个用于测试；BraTs 19训练集随机选取268个样本用于训练和验证，67个用于测试。

### 2. 评估指标和对比方法

- **评估指标**：选择Dice和Hausdorff作为评估指标。Dice系数衡量分割结果与真实标签的重叠程度；Hausdorff距离表示真实标签与分割结果之间的最大不匹配度。
- 对比方法
  - **多模态分割方法**：包括Unet、Att - Unet、Li等人的多步级联网络、互惠对抗学习脑肿瘤分割方法（Peiris和Chen）和E1D3。
  - **基于Transformer的模型**：UNetFormer、TransBTS和nnFormer。

### 3. 实现细节

- **框架**：使用PyTorch实现多模态分割的神经网络。
- **优化器**：采用Ranger优化器，学习率为1e−4。
- **训练参数**：训练轮数（epochs）设为200，批次大小（batch size）设为2。在2个NVIDIA TITAN RTX GPU上训练AdvTCUnet，在1个相同GPU上进行测试。
- **损失函数超参数**：设置$\lambda_1=0.5$，$\lambda_2=1$。



## 实验（Compared with SOTA）

- **模型性能**：在BraTs 19 - 21数据集上的实验表明，该模型具有较好的鲁棒性和适用性。例如，在BraTs 21数据集上，增强肿瘤（ET）、全肿瘤（WT）和肿瘤核心（TC）的Dice系数分别达到0.8642、0.9303和0.9060。
- **与其他方法对比**：与多种先进的多模态分割方法和基于Transformer的模型相比，该模型在大多数情况下表现更优，且能大大减少模型训练时间。
- **超参数分析**：通过调整损失函数中各项的系数，发现适当减小$\lambda_1$同时保持$\lambda_2$不变，能提高分割效果。最终确定训练过程中$\lambda_1=0.5$， $\lambda_2=1$。

![Snipaste_2025-07-31_09-20-55](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_09-20-55.png)

![Snipaste_2025-07-31_09-21-10](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_09-21-10.png)

## 实验（Ablation Experiments）​​

- **不同损失组合**：对比了Dice损失、Dice联合$L_1$损失、Dice联合ENE损失以及Dice联合$L_1$和ENE损失等不同组合下的模型性能，验证了各损失项的有效性。
- **不同模态组合**：从单一模态（T1）开始，逐步添加不同模态组合，结果表明使用提出的分割模型能提高分割效率和准确性，证明了各模态数据在模型中的有效性。

![Snipaste_2025-07-31_09-23-02](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_09-23-02.png)

## 结论

作者提出基于对抗学习的多模态脑肿瘤MRI分割模型，得出以下结论：

1. **模型效果显著**：在BraTs 21上分割结果的Dice系数（ET、WT和TC）分别达0.8642、0.9303和0.9060，表现优于现有技术。
2. **损失函数有效**：基于CV能量函数的损失函数不仅提升分割效果，还使网络更稳定、泛化能力更强。
3. **对抗学习有益**：对抗学习可防止分割器过拟合，分割器和判别器通过极小 - 极大博弈达成一致，提升了分割网络性能。
4. **待改进方向**：模型虽整体效果好，但处理不同区域边缘位置欠佳，且应对数据集不平衡能力不足，未来考虑引入平衡模块和集成学习解决问题。





