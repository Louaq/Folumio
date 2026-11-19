---
title: Cross-Modality Interaction Network for Medical Image Fusion
published: 2025-07-24 09:14:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "多模态医学图像融合通过整合源图像最大化来自不同模态图像的互补信息"
categories: 医学图像分割
tags: [Medical Image Segmentation, Dual Attention Encoder]
---

## 摘要

**Multi-modal medical image fusion** maximizes the complementary information from diverse modality images by integrating source images. The fused medical image could offer enhanced richness and improved accuracy compared to the source images. Unfortunately, the existing deep learning-based medical image fusion methods generally rely on convolutional operations, which may not effectively capture global information such as spatial relationships or shape features within and across image modalities. To address this problem, we propose a unified AI-Generated Content (AIGC)-based medical image fusion, termed Cross-Modal Interactive Network (CMINet). The CMINet integrates a recursive transformer with an interactive Convolutional Neural Network. Specifically, the recursive transformer is designed to capture extended spatial and temporal dependencies within modalities, while the interactive CNN aims to extract and merge local features across modalities. Benefiting from cross-modality interaction learning, the proposed method can generate fused images with rich structural and functional information. Additionally, the architecture of the recursive network is structured to reduce parameter count, which could be beneficial for deployment on resource-constrained devices. Comprehensive experiments on multi-model medical images (MRI and CT, MRI and PET, and MRI and SPECT) demonstrate that the proposed method outperforms the state-ofthe-art fusion methods subjectively and objectively.

## 翻译

**多模态医学图像融合**通过整合源图像最大化来自不同模态图像的互补信息。与源图像相比，融合后的医学图像可以提供更丰富和更准确的信息。不幸的是，现有的基于深度学习的医学图像融合方法通常依赖于卷积操作，这可能无法有效捕捉图像模态内部和跨模态的空间关系或形状特征等全局信息。为了解决这个问题，我们提出了一种基于AI生成内容（AIGC）的统一医学图像融合方法，称为跨模态交互网络（CMINet）。CMINet集成了递归Transformer和交互卷积神经网络。具体来说，递归Transformer旨在捕捉模态内的扩展空间和时间依赖性，而交互CNN则旨在提取和合并跨模态的局部特征。得益于跨模态交互学习，所提出的方法能够生成具有丰富结构和功能信息的融合图像。此外，递归网络的架构被设计为减少参数数量，这对资源受限设备上的部署可能有益。在多模态医学图像（MRI和CT、MRI和PET、MRI和SPECT）上的综合实验表明，所提出的方法在主观和客观上都优于现有的融合方法。

## 研究背景

本文聚焦于医学图像融合领域，其研究背景主要源于以下几方面：

1. **多模态医学成像的需求**：随着AI生成内容（AIGC）的发展，多模态医学成像成为提供人体组织和结构丰富信息的重要手段。不同模态图像（如CT、MRI、PET、SPECT）聚焦不同类型信息，为克服单模态图像的局限性，图像融合技术应运而生，可将不同模态图像数据整合为统一图像，满足人类视觉感知和机器检测需求。
2. **现有图像融合方法的不足**：传统图像融合方法通常需通过复杂的数学变换将原始图像映射到变换域，其变换技术复杂，难以在医疗系统上实现实时计算。深度学习驱动的图像融合方法虽有进展，但基于卷积神经网络（CNN）的方法一般依赖卷积运算，难以有效捕捉图像模态内和跨模态的全局信息，如空间关系或形状特征。
3. **研究目的**：为解决上述问题，作者提出基于AIGC的医学图像融合方法——跨模态交互网络（CMINet），旨在充分利用局部和全局信息，实现更好的特征互补，同时降低模型参数数量和复杂度，以在资源受限的设备上部署。

## 研究现状

- **传统方法**：通过数学变换将原图像映射到变换域，如 NSCT 和 NSST，再进行活动测量和制定融合规则实现图像融合，但变换技术复杂，难以在医疗系统实现实时计算。
- **深度学习方法**：成为主流，可分为 CNN 与 GAN 两类。CNN 方法用并行卷积网络提取特征并融合；GAN 方法由生成器和判别器构成，通过对抗学习生成融合图像。
- **Transformer 方法**：因强大的长程建模能力，在图像融合领域得到应用，部分研究将 CNN 与 Transformer 结合，以提升提取全局语义信息的能力。

## 提出的模型

![Snipaste_2025-07-24_10-59-34](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/NjAB/0X0/0343OUdPBEjrddRHLrt7v4.webp)

给定两个源图像 $I_a \in R^{C_a×H×W}$ 和 $I_b \in R^{C_b×H×W}$（$H$、$W$ 和 $C$ 分别代表图像的高度、宽度和通道数），CMINet的处理流程如下：

1. **全局特征提取**：通过视觉Transformer模块 $H_a^{TF}(·)$ 和 $H_b^{TF}(·)$ 从预处理后的源图像 $I_a$ 和 $I_b$ 中提取全局特征：$\{F_{a_{global}}, F_{b_{global}}\} = \{H_a^{TF}(I_a), H_b^{TF}(I_b)\}$ 。
2. **浅层局部特征提取**：将全局特征连接起来，并传递给头部模块以提取浅层局部特征：$F_{shallow} = H_{head}(Cat(F_{a_{global}}, F_{b_{global}}))$ ，其中 $Cat(·)$ 表示通道连接，$H_{head}$ 是浅层特征提取模块。
3. **深层局部特征提取**：将浅层局部特征 $F_{shallow}$ 发送到交互式CNN进行深层局部特征提取：$F_{deep} = H_{cnn}(F_{shallow})$ ，其中 $H_{cnn}(·)$ 代表交互式CNN，$F_{deep}$ 表示深层局部特征。交互式CNN由三对参数共享的局部特征提取（LFE）模块和通道注意力（CA）模块组成。
4. **融合图像重建**：设计尾部模块 $H_{tail}$ 来重建融合图像：$I_f = H_{tail}(F_{deep})$ ，其中 $I_f$ 是包含丰富结构和功能信息的融合图像。

### 模型各部分组件及作用

#### 模态内知识交互

引入基于双分支递归Transformer的模态内交互部分，每个阶段的Transformer（TF）模块由多头自注意力（MHSA）、多层感知机（MLP）和两个层归一化（LN）层组成。通过结合RNN和Transformer，该框架可以利用Transformer的全局上下文理解能力和RNN的局部顺序处理优势。

#### 模态间知识交互

基于交互式CNN设计模态间交互部分，包括：

1. **局部特征提取（LFE）模块**：由卷积层和门控双注意力（GDA）单元组成，采用密集连接模式，同时引入局部残差学习，以促进信息的传递和特征的重用，增强模型捕捉医学图像详细信息的能力。
2. **门控双注意力（GDA）单元**：由1×1卷积层、双注意力机制（空间注意力SA和通道注意力CA）和门控自适应双归一化（GADN）块组成。利用多分支结构提取不同层次的特征，并通过注意力机制选择重要的特征信息。
3. **门控自适应归一化（GADN）块**：引入三个可学习参数 $\alpha$、$\beta$ 和 $\gamma$ 来调节每个通道的权重，通过门控自适应操作调整特征的权重，使模型能够选择性地强调或弱化不同特征。

#### 损失函数

- **结构保留**：使用结构相似性指数（SSIM）建立结构损失函数，限制融合图像与源图像之间的结构相似性：$L_{SSIM} = 1 - SSIM(I_f, max\{I_a, I_b\})$ 。
- **纹理保留**：使用梯度算子来增强对源图像纹理细节的捕捉和保留：$L_{TEX} = \|\nabla I_f - max\{\nabla I_a, \nabla I_b\}\|_2$ 。
- **强度调节**：设计像素损失函数，使融合结果的像素强度分布与源图像相近：$L_{PIX} = \frac{1}{HW}(\|I_f - I_a\|_F^2 + \|I_f - I_b\|_F^2)$ 。
- **总损失函数**：$L = \lambda_1L_{SSIM} + \lambda_2L_{TEX} + \lambda_3L_{PIX}$ ，其中 $\lambda_1$、$\lambda_2$ 和 $\lambda_3$ 是用于控制各子损失项平衡的超参数。

## 实验数据集和设置

1. 数据集与训练细节
   - **数据集**：基于**哈佛医学院的全脑图谱数**据库构建训练和测试数据集。训练集包含160对CT与MRI图像、245对PET与MRI图像、333对SPECT与MRI图像，所有图像均调整为64×64尺寸。测试集从三个数据集中各选24对图像。
   - **训练设置**：学习率初始化为0.0002，批量大小为16，采用Adam进行网络优化。超参数λ1、λ2和λ3分别设为10、100和1。实验在NVIDIA GeForce RTX 3090 GPU上借助PyTorch框架完成。
2. 实验配置
   - **对比方法**：将CMINet与9种先进方法（CSF、DensFuse、FusionGAN、PMGI、RFN - Nest、SDNet、STDFusionNet、U2Fusion和UMF - CMGR）进行对比。
   - **评估指标**：采用Mutual Information（MI）、Spatial Frequency（SF）、Visual Information Fidelity（VIF）和$Q_{abf}$这四个指标进行定量评估，指标值越高表明融合性能越好。

## 实验（Compared with SOTA）

1. 多模态医学图像融合实验
   - **CT和MRI图像融合**：定性结果显示，其他9种融合技术在保留CT图像密集结构完整性方面存在明显不足，而CMINet能有效保留CT图像的高密度结构特征和MRI图像的纹理细节信息。定量结果表明，CMINet在MI、SF、VIF和Qabf指标上排名第一。
   - **PET和MRI图像融合**：定性结果显示，多数融合结果中MRI的边缘信息受PET图像背景影响，而CMINet能保留MRI图像细节并避免颜色信息失真。定量结果表明，CMINet在SF和Qabf指标上表现显著优越，在MI和VIF指标上位居第二。
   - **SPECT和MRI图像融合**：定性结果显示，CMINet在融合结果中能有效保留MRI图像的细节和边缘，不受SPECT图像背景干扰。定量结果表明，CMINet在MI、SF、VIF和Qabf指标上表现优越。

![Snipaste_2025-07-24_11-03-37](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-24_11-03-37.png)

![Snipaste_2025-07-24_11-03-41](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-24_11-03-41.png)

![Snipaste_2025-07-24_11-03-59](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-24_11-03-59.png)

## 实验（Ablation Experiments）​​

- **模态知识交互消融实验**：设计三种不同配置评估模态内和模态间知识交互的作用。结果表明，同时应用模态内和模态间知识交互在MI、SF、VIF和Qabf指标上取得最佳效果，说明该方法能有效利用不同模态间的互补信息。
- **递归步骤消融实验**：使用1 - 4不同级别的递归，评估模型在CT和MRI图像融合任务上的定量性能。结果显示，模型在两个递归步骤时达到最佳性能，递归步骤过多或过少都会导致性能下降，因此合理选择递归步骤数量很重要。



![Snipaste_2025-07-24_11-04-39](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-24_11-04-39.png)

![Snipaste_2025-07-24_11-04-43](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-24_11-04-43.png)

## 结论

作者提出了基于AIGC的医学图像融合方法CMINet，并得出以下结论：

1. **优势显著**：CMINet利用双分支递归变压器和交互式CNN，充分利用全局和局部信息，克服了CNN网络的局限性。递归结构有效减少了模型的参数数量。
2. **信息互补**：该方法能有效利用不同模态图像的互补信息，递归变压器捕获模态内的长期依赖关系，交互式CNN聚焦模态间的深度局部信息。
3. **效果良好**：在多种多模态医学图像融合任务中，CMINet能有效保留源图像的结构信息和丰富的纹理细节。

未来，作者计划提升医学图像融合的实时性能。
