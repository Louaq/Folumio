---
title: A Simple and Robust Framework for Cross-Modality Medical Image Segmentation applied to Vision Transformers
published: 2025-05-28 15:47:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "云想衣裳花想容，春风拂槛露华浓"
categories: 医学图像分割
tags: [Cross-Modality Medical Image Segmentation, Vision Transformers]
top: true
---

Centre des Mat´eriaux、Centre de Mise en Forme des Mat´eriaux、Centre de Morphologie Math´ematique

## 摘要

When it comes to clinical images, automatic segmentation has a wide variety of applications and a considerable
diversity of input domains, such as different types of Magnetic Resonance Images and Computerized Tomography scans. This heterogeneity is a challenge for cross-modality algorithms that should equally perform independently of the input image type fed to them. Often, segmentation models are trained using a single modality, preventing generalization to other types of input data without resorting to transfer learning techniques. Furthermore, the multi-modal or cross-modality architectures proposed in the literature frequently require registered images, which are not easy to collect in clinical environments, or need additional process-
ing steps, such as synthetic image generation. In this work, we propose a simple framework to achieve fair image segmentation ofmultiple modalities using a single conditional model that adapts its normalization layers based on the input type, trained with non-registered interleaved mixed data. We show that our framework outperforms other cross-modality segmentation methods, when applied to the same 3D UNet baseline model, on the Multi-Modality Whole Heart Segmentation Challenge. Furthermore, we define the Conditional Vision Transformer encoder, based on the proposed cross-modality framework, and we show that it brings significant improvements to the resulting segmentation, up to 6.87% ofDice accuracy, with respect to its baseline ref-
erence. The code to reproduce our experiments and the trained model weights are publicly available at https://github.com/matteo-bastico/MI-Seg.

## 翻译

对于临床图像，**自动分割**具有广泛的应用和多样的输入域，例如不同类型的磁共振图像和计算机断层扫描。这种异质性对跨模态算法提出了挑战，因为它们应该在不考虑输入图像类型的情况下同样有效地运行。通常，分割模型使用单一模态进行训练，无法在不借助迁移学习技术的情况下泛化到其他类型的输入数据。此外，文献中提出的多模态或跨模态架构通常需要已配准的图像，而这些图像在临床环境中难以收集，或者需要额外的处理步骤，如合成图像生成。在这项工作中，我们提出了一个简单的框架，通过一个单一的条件模型实现多模态图像的公平分割，该模型根据输入类型调整其归一化层，并使用未配准的交错混合数据进行训练。我们展示了在相同的3D UNet基线模型上，我们的框架在多模态全心脏分割挑战中优于其他跨模态分割方法。此外，我们基于所提出的跨模态框架定义了条件视觉Transformer编码器，并展示了它对最终分割带来了显著的改进，与基线参考相比，Dice准确率提高了最多6.87%。复现我们实验的代码和训练好的模型权重已公开在https://github.com/matteo-bastico/MI-Seg

## 研究背景

医学图像分割是**深度学习和人工智能**领域的研究热点，但当前的算法存在一些问题，这构成了本文的研究背景：

1. **单模态训练局限性**：现有算法通常在单一医学成像模态上训练，如T1 - 或T2加权磁共振成像（MRI）或计算机断层扫描（CT），在测试不同训练图像时易受数据可变性影响。数据可变性源于成像方法、扫描仪、采集设置和患者个体差异等。 
2. **多模态和跨模态方法的不足**   
   - **多模态方法**：需堆叠不同类型图像生成组合输入，或利用多模态生成合成图像，但都需要配准的医学图像，而采集同一患者的多张图像受资源和时间限制。    
   - **跨模态方法**：如使用辅助模态改进目标模态分割，采用微调或迁移学习，但未充分利用跨模态信息。联合训练在域转移显著时难直接学习共同特征，基于合成图像生成的技术增加了计算复杂性，不利于实时应用。 因此，本文旨在提出一种通用框架，实现高质量跨模态分割，同时避免模型开销和训练时对配准临床图像的需求。 

## 研究现状

**模型架构**：近年来，多种深度学习架构被提出用于医学图像分割，如 UNet 及其变体，以及基于 Vision Transformers（ViT）的模型，如 TransUNET、UNETR 和 Swin - UNETR 等，性能表现优异。 

**多模态学习**：多模态学习在医学影像领域有应用，包括基于**生成对抗网络**（**GAN**）的合成图像生成和多模态图像分割，部分研究将二者结合。 

**跨模态分割**：提出了一些跨模态医学图像分割技术，如使用辅助模态提升目标模态分割性能、联合训练、基于特征提取器的方法等。 

## 提出的模型

![Snipaste_2025-05-28_15-58-11](https://pic1.imgdb.cn/i/0343OU5tULNdBChjkLxxrU.webp)



![Snipaste_2025-05-28_16-00-23](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-28_16-00-23.png)



论文提出了一个简单的框架和基于该框架的条件Vision Transformers（C - ViT）编码器，用于跨模态医学图像分割，具体如下： 

1. **跨模态分割框架**：该框架适用于任何编码器 - 解码器架构，旨在实现高质量的跨模态分割，且无需在分割模型上增加额外开销，也不需要注册临床图像进行训练。具体做法是将不同领域的医学图像直接输入到一个单一的模态条件模型中，该模型通过自适应其编码器归一化层来生成所需的分割结果。自适应基于条件实例归一化（CIN），模型可以端到端地进行训练。通过随机混合多种模态的不同数据（即交错混合训练方式），避免了先前的合成图像风格迁移。 
2. **条件视觉变换器（C - ViT）编码器**：基于上述提出的框架，正式定义了C - ViT编码器架构，用于构建与模态无关的基于ViT的图像分割或分类模型。C - ViT编码器有两个子层，即多头自注意力机制（MSA）和多层感知机（MLP），在每个子层之前都使用CIN替换了传统的层归一化（LN）。C - ViT编码器可以推广到Swin - 变压器模型中。 实验结果表明，该框架和C - ViT编码器在多模态全心脏分割（MM - WHS）2017挑战赛数据集上，相较于其他方法，显著提高了分割准确性，同时降低了训练和推理的复杂性。 

## 实验（Compared with SOTA）

数据集：**Multi-modality Whole Heart Segmentation Challenge 2017 (MM-WHS 2017) dataset**

![Snipaste_2025-05-28_16-03-16](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-28_16-03-16.png)

![Snipaste_2025-05-28_16-03-23](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-28_16-03-23.png)



- **数据和方法**：在心脏子结构分割的定量比较中，对比了微调、联合训练、X形架构、Zhang等人基于合成图像生成的在线训练方法以及Li等人的知识蒸馏跨模态分割技术。微调是先使用辅助模态训练模型，再将知识迁移到目标模态；联合训练是在不同批次中交替使用两种模态同时训练基线模型。
- **结果分析**：微调、联合训练和X形架构对分割精度的提升有限，因为它们没有充分利用跨模态信息。基于GAN的在线合成方法（有无相互知识蒸馏）能显著提高目标模态分割的平均精度，最高达3.06%，但会给模型带来显著开销，限制实时应用。本文方法在降低训练和推理复杂度的同时，显著提高了分割精度，平均Dice系数提升了0.65%，单个心脏子结构（如右心室）最高提升2.71%，不过升主动脉和肺动脉的性能略有下降，可能是手动分割范围与测试工具裁剪不一致导致。

## 实验（Ablation Experiments）​​

- **定量结果**：与基线模型、微调及联合训练的结果相比，本文框架将心脏子结构的平均Dice系数提高了4%，全心分割（WHS）的准确率提高了6.87%。基于ViT的条件模型在验证集上表现优于基于UNet的模型，但在测试集上性能略差，可能是因为Transformer通常需要更多数据进行更精细的泛化。
- **定性结果**：使用C - ViT时，与其他方法相比有明显改进，如在某些切片的分割结果中能对真实标注（GT）进行细化，3D分割中C - ViT的结果没有真实标注区域外的误报。且该框架在交叉验证中表现稳健。

![Snipaste_2025-05-28_16-04-21](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-05-28_16-04-21.png)

## 结论

作者提出一种简单框架，用单跨模态条件模型和交错混合数据训练，以减少模型开销和对配准数据的需求，实现不同医学图像的分割。结论如下：

1. 基于条件实例归一化（CIN）定义通用条件模型，可应用于所有先进医学图像分割架构。
2. 开发新的条件视觉变压器（C - ViT）编码器，用于创建基于ViT的条件模型。 
3. 该框架在心脏子结构分割的多模态公共数据集上达到了跨模态医学图像分割的新水平，不仅利用辅助模态帮助目标模态分割，也能对辅助模态高质量分割。 
4. 未来可在更多模态数据集测试，以无监督域适应方式扩展框架，实现单标注模态训练并适应无标注域。 





