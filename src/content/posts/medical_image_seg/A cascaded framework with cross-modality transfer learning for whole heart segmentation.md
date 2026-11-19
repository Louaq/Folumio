---
title: A cascaded framework with cross-modality transfer learning for whole heart segmentation
published: 2025-07-22 16:57:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "从三维心脏图像中自动且准确地分割整个心脏结构"
categories: 多模态医学图像分割
tags: [Whole Heart Structure]
---

## 摘要

Automatic and accurate segmentation of the **whole heart structure** from 3D cardiac images plays an important role in helping physicians diagnose and treat cardiovascular disease. However, the time-consuming and laborious manual labeling of the heart images results in the inefficiency of utilizing the existing CT or MRI for training the deep learning network, which decrease the accuracy of whole heart segmentation. However, multi-modality data contains multi-level information of cardiac images due to different imaging mechanisms, which is beneficial to improve the segmentation accuracy. Therefore, this paper proposes a cascaded framework with cross-modality transfer learning for whole heart segmentation (CM-TranCaF), which consists of three key modules: modality transfer network (MTN), U-shaped multi-attention network (MAUNet) and spatial configuration network (SCN). In MTN, MRI images are transferred from MRI domain to CT domain, to increase the data volume by adopting the idea of adversarial training. The MAUNet is designed based on UNet, while the attention gates (AGs) are integrated into the skip connection to reduce the weight of background pixels. Moreover, to solve the problem of boundary blur, the position attention block (PAB) is also integrated into the bottom layer to aggregate similar features. Finally, the SCN is used to finetune the segmentation results by utilizing the anatomical information between different cardiac substructures. By evaluating the proposed method on the dataset of the MM-WHS challenge, CM-TranCaF achieves a Dice score of 91.1% on the testing dataset. The extensive experimental results prove the effectiveness of the proposed method compared to other state-of-the-art methods.

## 翻译

从三维心脏图像中自动且准确地分割整个心脏结构在帮助医生诊断和治疗心血管疾病方面起着重要作用。然而，对心脏图像进行耗时且费力的人工标注，导致现有的CT或MRI在训练深度学习网络时效率低下，从而降低了整个心脏分割的准确性。然而，由于不同的成像机制，多模态数据包含心脏图像的多层次信息，有助于提高分割精度。因此，本文提出了一种用于全心脏分割的跨模态迁移学习级联框架（CM-TranCaF），该框架由三个关键模块组成：模态迁移网络（MTN）、U形多注意力网络（MAUNet）和空间配置网络（SCN）。在MTN中，采用对抗训练的思想将MRI图像从MRI域转移到CT域，以增加数据量。MAUNet基于UNet设计，将注意力门（AGs）集成到跳跃连接中，以降低背景像素的权重。此外，为解决边界模糊问题，还在底层集成了位置注意块（PAB）以聚合相似特征。最后，SCN通过利用不同心脏子结构之间的解剖信息来微调分割结果。在MM-WHS挑战的数据集上评估所提出的方法，CM-TranCaF在测试数据集上获得了91.1%的Dice分数。广泛的实验结果证明了该方法相较于其他最先进方法的有效性。

## 研究背景

心血管疾病是全球主要死因之一，3D成像技术（CT和MRI）在心脏病研究和治疗中至关重要，常需进行全心脏分割。然而，全心脏分割面临诸多挑战，促使作者开展此项研究：

1. **数据标注难题**：心脏图像手动标注耗时费力，且涉及患者隐私，导致训练深度学习网络时现有CT或MRI数据利用效率低，影响全心脏分割准确性。
2. **单模态局限**：多数现有方法基于单模态数据，无法充分利用多模态数据因不同成像机制带来的多层次信息，限制了分割性能。
3. **现有多模态方法不足**：现有多模态分割方法通常在心脏二维切片上进行模态迁移后拼接成三维图像，会造成信息丢失，产生模态迁移误差，影响最终分割效果。

为解决上述问题，本文提出一种具有跨模态迁移学习的级联框架（CM - TranCaF）用于全心脏分割，旨在利用多模态数据提升分割准确性，避免传统方法的局限。

## 研究现状

- **单模态分割**：主要基于深度学习的卷积神经网络，如 3D FCN、UNet 等，虽有一定效果，但单模态数据难以利用多模态信息，影响分割性能。
- **多模态分割**：通过图像配准和模态转换解决模态不一致问题，如将 LGE 和 cine MR 图像注册融合后分割。同时，转移学习也为多模态分割带来新思路，如 STAR 方法、基于互知识蒸馏的跨模态分割方法等。

## 提出的模型

![Snipaste_2025-07-23_09-14-09](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/DSWV/0X0/0343OU2GhdSrkrOC0N5ZFz.webp)

文提出了一种用于全心脏分割的级联框架CM-TranCaF，该框架由三个关键模块组成：

1. 模态转换网络（Modality Transfer Network，MTN）
   - **设计基础**：基于3D CycleGAN，旨在利用其在无配对图像上的转换能力。
   - **网络结构**：由两个生成器$G_c$、$G_m$和两个判别器$D_c$、$D_m$组成。生成器是编码器 - 解码器结构，对图像进行域转换；判别器是编码器结构，对生成器的输出图像进行真假判断，并将判断结果返回给生成器进行对抗训练。
   - **作用**：将MRI图像从MRI域转换到CT域，通过对抗训练的思想**增加数据量**。同时，确保转换后的图像内容不变，保留心脏的解剖结构。
   - **损失函数**：$L = L_{GAN}+\lambda L_{cycle}+L_{identity}$，其中$L_{GAN}$是对抗损失，用于优化生成器和判别器的训练；$L_{cycle}$是循环一致性损失，确保转换后图像内容不变；$L_{identity}$是识别损失，用于训练生成器的识别能力；$\lambda$是权重系数，实验中设为10。
2. U形多注意力网络（U-shaped Multi-Attention Network，MAUNet）
   - **设计基础**：受UNet启发，基于编码器 - 解码器结构，并集成了残差结构和多个注意力模块。
   - **网络结构**：编码和解码部分根据输入图像大小分为4层。编码部分主要由4个残块组成，通过卷积和下采样操作提取多尺度信息；解码部分主要由卷积层和注意力门（Attention Gates，AGs）模块组成。
   - **作用**：接收带有全心脏标签的CT图像和MTN生成的CT图像作为输入，提取感兴趣区域（ROI），准确分割全心脏的七个子结构。
   - 注意力模块
     - **AGs**：集成到跳跃连接中，用于计算注意力系数$\alpha_i\in[0,1]$，抑制无关背景区域的特征响应，使网络更关注有效信息。
     - **位置注意力块（Position Attention Block，PAB）**：集成到底层，通过计算空间注意力矩阵$S$，聚合相似特征，解决边界模糊问题。
   - **损失函数**：结合Dice损失和Focal损失形成新的混合损失$L_{MAUNet}=L_{Dice}+\lambda L_{Focal}$，其中$\lambda$表示$L_{Dice}$和$L_{Focal}$的相对重要性，实验表明$\lambda$为0.1时分割效果最佳。
3. 空间配置网络（Spatial Configuration Network，SCN）
   - **设计灵感**：受Payer等人的启发。
   - **作用**：对MAUNet的预测结果进行微调，基于不同类别的预测结果和它们之间的解剖关系，使预测更加精确，缓解某些类别结构相似带来的歧义。
   - **网络结构**：首先通过三个$3\times3\times3$卷积核的卷积层进行处理，然后采用空间配置块，利用$9\times9\times5$卷积核和特定的下采样因子进一步处理。
   - **工作原理**：将中间分割结果输入SCN，学习不同心脏子结构之间的相对位置信息，根据这些关系数据推断每个类别的位置，从而细化中间分割结果。

## 实验设置及评估指标

1. **数据集**：采用MM - WHS2017挑战赛的数据集，该数据集提供了60张3D CT图像和60张3D MRI图像用于全心分割。每个模态有20张图像用于训练，40张图像用于测试。数据来自多家医院的不同设备，图像质量和分辨率各异，模拟了临床实际情况。每张图像涵盖整个心脏子结构，包括**左心室（LV）、右心室（RV）、左心房（LA）、右心房（RA）、心肌（Myo）、升主动脉（AA）和肺动脉（PA）**。
2. **评估指标**：采用七个心脏子结构的**平均Dice分数**、**Jaccard分数**和**豪斯多夫距离（HD）**来定量评估所提方法。Dice和Jaccard是衡量两个样本相似性的指标，值越大表示样本越相似；HD用于测量两个样本子集之间的距离，即两个样本集中最近点之间的最大距离。此外，还采用了MM - WHS挑战赛中使用的全心分割分数（WHS）来评估全心的分割性能，并报告了WHS分数的标准差。
3. 实现细节
   - **数据预处理**：由于数据由不同设备收集，图像质量差异大，对训练数据集采用纹理增强方法，并将原始心脏图像重采样到间距索引为3。为使网络更关注心脏结构部分，抑制背景区域的影响，使用预训练的定位网络定位心脏中心，从每张图像中裁剪出64×64×64的感兴趣区域（ROI）作为MAUNet的输入。
   - **模型训练**：提出的网络在TensorFlow上实现，使用Tesla V100 GPU。训练前，通过缩放、平移、翻转、旋转等技术随机增加数据集，以提高模型的泛化能力和鲁棒性。训练阶段采用小批量自适应矩估计（Adam）更新网络权重，批量大小为8，初始学习率为0.00001。经过总共40,000次迭代训练后，在MM - WHS挑战赛的40张无标签测试图像上评估所提网络。



## 实验（Compared with SOTA）

**与其他方法的比较**：将所提方法与MM - WHS挑战赛中的先进方法进行比较，包括Payer、Wang、Yang、Li等提出的方法。实验结果表明，所提的CM - TranCaF在所有三个评估指标（Dice分数、Jaccard分数和HD）上都取得了最佳性能（除了Wang的方法），且Dice和Jaccard值与Wang的方法非常接近，标准差更小。在HD指标上，所提方法优于Wang的方法。此外，所提方法在右心房（RA）和肺动脉（PA）的分割准确性最高，证明了该方法的优势。同时，所提方法在不同病例上的分割结果比其他先进方法更稳定，证明了其鲁棒性

![Snipaste_2025-07-23_09-20-59](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-23_09-20-59.png)

## 实验（Ablation Experiments）​​

- **MTN的有效性**
  - **生成图像比例实验**：通过添加不同比例（10% - 100%）的生成图像进行实验，发现添加生成数据的分割性能总体上优于不添加生成数据的情况。随着生成数据比例的增加，分割性能逐渐提高，直到生成图像比例达到50%，之后在三个评估指标上大多数目标的性能开始下降。这是因为生成图像的数据分布只能无限接近CT图像的数据分布，不能完全一致，过多的生成图像会给学习网络带来更多干扰，导致性能下降。因此，添加50%生成图像时可获得最佳分割性能。
  - **λ的敏感性分析**：对公式（1）中的权重系数λ进行敏感性分析，实验结果表明，当λ的值设置为10时，可获得最佳性能，优于λ为5和20的情况，因此在本文工作中λ的值设置为10。
- **AGs和PAB的有效性**：在MAUNet中移除AGs或PAB模块，并在训练数据集中添加50%的生成图像进行实验。结果表明，采用AGs模块的网络在所有评估指标上的性能均优于未采用AGs模块的网络（无论是否采用PAB模块），表明注意力模块能有效抑制无关像素。对于PAB模块，在不考虑AGs模块带来的改进时，采用PAB模块也能在所有三个指标上取得更好的性能，表明PAB能够改善相似特征之间的关联关系，聚合相似特征，解决子结构之间边界模糊的问题。总体而言，同时采用AGs和PAB模块在大多数结构的三个指标上都能实现最佳分割性能。
- **SCN的有效性**：在训练数据集中添加50%的生成图像，评估SCN模块的有效性。实验结果表明，采用SCN模块的网络在划分不同子结构之间的边界时更准确，分割结果优于未采用SCN模块的网络。表5显示，采用SCN模块可以在三个评估指标上显著提高不同结构的分割性能，表明SCN模块能够学习心脏子结构之间的相对位置，进一步改善分割结果，证明了SCN模块的有效性。
- **不同模块的协同作用**：对MTN、AGs、PAB和SCN之间的协同相互作用进行分析，通过两两组合提出的模块进行实验。结果表明，固定MTN模块与其他三个组件组合时，与SCN模块集成产生的分割性能最佳；固定AGs模块和PAB模块时，与SCN模块组合也显示出最佳性能。这些结果证实了SCN模块在该实验框架中的有效性，并且SCN模块与MTN模块的组合能产生最显著的结果，体现了这两个模块之间的协同作用。

## 结论

作者提出用于全心脏分割的级联框架CM-TranCaF，并得出以下结论：

1. **模块有效性**：MTN模块可解决多模态医学图像数据分布不一致问题；MAUNet模块集成AGs和PABs能解决类别不平衡和边界模糊问题；SCN模块可利用心脏不同子结构间的解剖关系，辅助建模复杂空间关系和预测类别位置。
2. **实验结果**：在MM - WHS挑战数据集上训练和测试，该框架取得91.1%的Dice分数和14.386mm的豪斯多夫距离，证明其能有效提高分割精度，且MTN、MAUNet和SCN模块有效。
3. **未来方向**：MTN**迁移能力**待增强；需平衡各心脏结构的分割性能；可将方法扩展到其他模态以解决医学**数据集不足**问题。
