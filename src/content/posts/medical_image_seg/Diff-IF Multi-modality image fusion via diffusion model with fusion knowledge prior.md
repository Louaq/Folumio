---
title: Diff-IF Multi-modality image fusion via diffusion model with fusion knowledge prior
published: 2025-07-21 16:20:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "多模态图像融合（MMIF）旨在聚合来自不同源图像域的互补信息"
categories: 多模态医学图像分割
tags: [Multi-modality image fusion]
---

武汉大学

## 摘要

**Multi-modality image fusion (MMIF)** aims to aggregate the complementary information from diverse source image domains. As the generative adversarial network-based methods have been the primary choice and demonstrated satisfactory fusion performance, they suffer from the unstable training and mode collapse. To tackle this challenge, we propose a novel diffusion model for MMIF incorporating fusion knowledge prior, termed as Diff-IF. Diff-IF proposes a trainable diffusion model paradigm for multi-modality image fusion, resolving the issue of lacking the ground truth for the diffusion model in image fusion tasks. It decomposes the diffusion-based image fusion method into conditional diffusion model and fusion knowledge prior with the targeted search to derive the prior distribution for the specific image fusion task. In particular, the forward diffusion process is guided by the fusion knowledge prior distribution through targeted search, while the reverse diffusion process is designed to generate high-quality fused images. Extensive experiments demonstrate that Diff-IF achieves outstanding performance, including exemplary visual preservation, and good preservation of weak textures, across various MMIF tasks such as infrared-visible image fusion and medical image fusion. The code will be available at https://github.com/XunpengYi/Diff-IF.

## 翻译

**多模态图像融合**（**MMIF**）旨在聚合来自不同源图像域的互补信息。尽管基于生成对抗网络的方法已成为主要选择并表现出令人满意的融合性能，它们仍面临不稳定训练和模式崩溃的问题。为了解决这一挑战，我们提出了一种新颖的结合融合知识先验的扩散模型用于MMIF，称为Diff-IF。Diff-IF提出了一种可训练的扩散模型范式用于多模态图像融合，解决了图像融合任务中扩散模型缺乏真实值的问题。它将基于扩散的图像融合方法分解为条件扩散模型和融合知识先验，通过目标搜索得出特定图像融合任务的先验分布。特别是，前向扩散过程通过目标搜索由融合知识先验分布引导，而反向扩散过程旨在生成高质量的融合图像。大量实验表明，Diff-IF在各种MMIF任务（如红外-可见光图像融合和医学图像融合）中实现了卓越的性能，包括出色的视觉保留和对弱纹理的良好保留。代码将在https://github.com/XunpengYi/Diff-IF 提供。

## 研究背景

![Snipaste_2025-07-21_16-21-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/FWhM/0X0/0343OUhI3LwXTHejmupDQq.webp)

文章聚焦于**多模态图像融合（MMIF）领域**，其研究背景源于现有方法的不足及扩散模型应用面临的挑战：
1. **MMIF的重要性**：由于单一图像传感器成像原理的局限，MMIF技术应运而生，旨在整合不同源图像的互补信息，生成高质量融合图像。经典的MMIF任务包括红外 - 可见光图像融合（IVF）和医学图像融合（MIF）。
2. **现有方法的问题**：基于生成对抗网络（GAN）的方法虽在图像融合中取得了较好的效果，但存在训练不稳定和模式崩溃的问题，导致融合图像分布不合理、质量低，影响了其实用性。
3. **扩散模型应用的挑战**：近年来，去噪扩散概率模型（DDPM）在图像生成等领域取得了巨大成功，但在MMIF中，由于缺乏真实标签，基线扩散模型无法直接实现图像融合。现有的基于预训练扩散模型的方法存在适应性差、效率低和设计繁琐等问题。 为解决上述问题，作者提出了一种具有融合知识先验的新型扩散模型Diff - IF，以提供更定制化、高效的MMIF解决方案。 

## 研究现状

- **传统深度学习方法**：早期基于预训练自动编码器的融合策略广泛应用，如CSR、MedCNN等；后来出现基于CNN的端到端融合结构，如U2Fusion；此外，基于transformer、高级语义任务、图像配准与融合相互促进的技术也取得进展。
- **生成式深度学习方法**：基于GAN的方法在图像融合任务中因能从分布进行融合，具有高质量和良好视觉感知的优势，但存在训练不稳定和模式崩溃问题；扩散模型在图像生成等领域表现出色，但在多模态图像融合中，现有方法存在设计繁琐、不针对特定任务等问题。



## 提出的模型

### 模型原理

- **模型拆解**：Diff - IF将图像融合扩散模型分解为带有融合知识先验的条件扩散模型。利用有针对性的搜索技术，为扩散模型提供针对特定图像融合任务的最优先验分布。
- **融合知识先验**：代表一般融合结果的通用分布，涵盖了各种融合策略的结果，源图像构成了先验分布的端点。在实际应用中，可以通过定义定制的子集融合先验分布来近似它。
- **有针对性的搜索**：旨在在图像融合知识先验的高维流场中找到满足融合任务要求的子集先验分布。通过人工定义或度量评估来确定有针对性的搜索函数，以找到最优的分布解。

### 模型结构

#### 正向扩散过程

从经过有针对性搜索得到的最优融合分布开始，逐步向数据中添加高斯噪声，直到数据分布接近标准高斯分布。该过程由融合知识先验分布通过有针对性的搜索进行引导。

#### 反向扩散过程

从标准高斯分布开始，通过网络条件输入（如红外 - 可见光图像融合任务中的可见光图像和红外图像）进行采样，逐步去除噪声，生成符合融合知识先验概率分布的高质量融合图像。

#### 网络结构

去噪网络$\epsilon_{\theta}$和细化网络$n_{\theta}$通过时间步$t$调制的网络实现，具体由时间步编码层和图像编码器 - 解码器组成。去噪网络使用SR3的骨干网络，细化网络修改了Restormer的骨干网络，记为R - 块，以实现双输入和有效耦合。

### 模型优势

- **训练稳定性**：与基于GAN的方法相比，Diff - IF的训练过程更加稳定，避免了模式崩溃的问题。
- **高质量融合结果**：通过融合知识先验和定制化的融合任务再训练，Diff - IF能够产生高质量的图像融合结果，具有出色的视觉保留、良好的弱纹理保留和强大的抗噪声能力。
- **定制化设计**：Diff - IF避免了无效的预训练模型参数和繁琐的手动融合设计，更适合多模态图像融合任务。

![Snipaste_2025-07-21_17-00-30](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-21_17-00-30.png)

## 实验（Compared with SOTA）

![Snipaste_2025-07-21_17-03-24](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-21_17-03-24.png)

### 红外 - 可见光图像融合（IVF）

1. **实验细节**：在配备两块NVIDIA Geforce RTX 3090 GPU的机器上使用PyTorch进行实验。根据IVF任务特点设置超参数，训练图像裁剪为128×128，迭代次数40K，批量大小16，采用Adam优化器，学习率为1e - 4。
2. **数据集和指标**：采用MSRS、RoadScene、LLVIP等公开数据集，还使用GUN数据集进行极端验证。评估指标包括互信息（MI）、差异相关性总和（SCD）、视觉信息保真度（VIF）、$Q_{AB/F}$和结构相似性指数（SSIM），指标值越高表示融合图像质量越好。
3. **融合知识先验和目标搜索**：融合知识先验包含TarDAL、DDFM等现有先进融合方法。采用简单通用样本搜索，以SSIM评估相似性、VIF评估视觉保真度、$Q_{AB/F}$评估纹理信息保留，根据任务需求设置权重。
4. 与SOTA方法比较
   - **定性比较**：在多个数据集上，Diff - IF相比其他方法具有明显优势，能保持可见光丰富一致的纹理和场景物理信息，突出红外信息的显著目标和弱热辐射信息，同时具备强大的红外噪声抑制能力。
   - **定量比较**：Diff - IF在多个指标上取得最佳结果，VIF和SSIM表现良好，MI和$Q_{AB/F}$指标表明其能有效融合源图像信息，具有出色的纹理梯度表达能力。
   - **检测性能比较**：使用YOLOv8作为目标检测骨干网络，Diff - IF在LLVIP数据集上的目标检测任务中表现最优，展示了其在下游任务中的有效性。
   - **分割性能比较**：在FMB数据集上进行语义分割实验，Diff - IF的融合结果在分割得分和可视化方面表现出色，证明了其高质量的语义保留能力。



![Snipaste_2025-07-21_17-05-44](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-21_17-05-44.png)

![Snipaste_2025-07-21_17-05-58](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-21_17-05-58.png)

### 医学图像融合（MIF）

1. **实验细节**：实验设备和环境与IVF任务一致。根据MIF任务特点修改超参数，训练图像裁剪为128×128，迭代次数16K，批量大小16，采用Adam优化器，学习率为1e - 4。
2. **数据集和其他配置**：采用哈佛大学医学图像数据集，包括MRI - CT、MRI - PET和MRI - SPECT图像。网络分别用672张图像训练、58张图像测试，评估指标、融合知识构建和目标搜索配置与IVF任务相同。
3. **定性比较**：在MRI - CT图像中，Diff - IF能更好地保留源图像的纹理，突出高密度成像区域，同时有效保留软组织纹理信息，优于其他方法。
4. **定量比较**：Diff - IF在大多数评估指标上优于其他先进方法，在信息保留、可视化和纹理保存方面表现出色，展示了其卓越的融合信息保存能力。

## 实验（Ablation Experiments）​​

通过去除融合知识和目标搜索模块进行消融实验，使用与IVF和MIF任务相同的指标评估性能。结果表明，去除不同模块后，方法性能均不如Diff - IF，证明了融合知识和目标搜索的有效性。



![Snipaste_2025-07-21_17-06-48](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-21_17-06-48.png)



## 基于扩散的多模态图像融合成本比较

在RTX 3090 GPU上比较Diff - IF和基于预训练扩散的图像融合方法（如DDFM）的资源消耗。结果显示，在960×1440尺寸图像上，DDFM因内存溢出无法运行，而Diff - IF可以处理。此外，Diff - IF在参数数量、计算量和运行时间方面具有明显优势。

## 结论

作者提出Diff - IF模型为多模态图像融合提供了新的扩散模型范式，解决了缺乏真实标签的问题。该模型有以下优势：

1. **定制化适配**：与无条件扩散和基于分数的方法不同，Diff - IF更具定制性，避免了无效的预训练模型参数和繁琐的手动融合设计。
2. **融合效果好**：通过融合知识先验和目标搜索，Diff - IF在红外 - 可见光图像融合和医学图像融合任务中取得了出色的融合效果。
3. **性能优越**：实验证明Diff - IF具有有效性、可靠性和优越性。

不过，基于扩散的图像融合方法计算消耗大、运行时间长，Diff - IF虽支持定制设计和加速采样，但仍有改进空间，后续可探索加速扩散过程，使其更适合图像融合任务。





