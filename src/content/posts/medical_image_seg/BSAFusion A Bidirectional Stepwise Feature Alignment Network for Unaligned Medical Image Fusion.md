---
title: BSAFusion A Bidirectional Stepwise Feature Alignment Network for Unaligned Medical Image Fusion
published: 2025-06-26 19:23:00
expires: 2025-08-21 23:59:59
excerpt: "如果可以在统一的处理框架内使用单阶段方法同时对未对齐的多模态医学图像进行对齐和融合，不仅能实现双任务的相互促进，还能帮助降低模型的复杂性"
mathjax: true
categories: Medical Image Fusion
tags: [Medical Image Segmentation, Multi modal]
---

> 昆明理工大学



1. 医学图像对齐是指将同一患者或不同患者的多幅医学图像进行空间配准，使得图像中的解剖结构在空间位置上达到最佳的几何对应关系的过程。这个过程的核心目标是通过数学变换将不同图像坐标系统中的对应点映射到同一参考坐标系中。
2. 在临床实践中，医学图像对齐具有重要意义。当患者需要进行多次成像检查时，由于拍摄时间不同、患者体位变化、呼吸运动等因素影响，同一患者的不同时期图像往往存在空间位置偏差。通过图像对齐技术，医生可以准确比较病灶的变化情况，评估治疗效果，制定更精准的诊疗方案。此外，在多模态成像中，比如将**CT图像与MRI图像进行对齐**，可以充分利用**不同成像技术的优势，获得更全面的诊断信息。**
3. 医学图像对齐通常涉及刚性变换和非刚性变换。刚性变换包括**平移、旋转和缩放**，适用于**骨骼等**相对固定的解剖结构
4. 非刚性变换则可以处理**软组织的形变**，如**呼吸运动导致的器官位移**。现代图像对齐技术还广泛应用于放射治疗计划、手术导航、图像引导治疗等领域，通过精确的空间配准确保治疗的准确性和安全性。随着人工智能和深度学习技术的发展，医学图像对齐的精度和效率正在不断提升，为临床诊疗提供了更加可靠的技术支持。



## 摘要

If unaligned multimodal medical images can be simultaneously aligned and fused using a **single-stage approach** within a unified processing framework, it will not only achieve mutual promotion of dual tasks but also help reduce the complexity of the model. However, the design of this model faces the challenge of incompatible requirements for feature fusion and alignment. To address this challenge, this paper proposes an unaligned medical image fusion method called Bidirectional Stepwise Feature Alignment and Fusion (BSFA-F)
strategy. To reduce the negative impact of modality differences on cross-modal feature matching, we incorporate the Modal Discrepancy-Free Feature Representation (MDF-FR) method into BSFA-F. MDF-FR utilizes a Modality Feature Representation Head (MFRH) to integrate the global information of the input image. By injecting the information contained in MFRH of the current image into other modality images, it effectively reduces the impact of modality differences on feature alignment while preserving the complementary information carried by different images. In terms of feature alignment, BSFA-F employs a bidirectional stepwise alignment deformation field prediction strategy based on the path independence of vector displacement between two points. This strategy solves the problem of large spans and inaccurate deformation field prediction in single-step alignment. Finally, Multi-Modal Feature Fusion block achieves the fusion of aligned features. The experimental results across multiple datasets demonstrate the effectiveness of our method.

## 翻译

如果可以在统一的处理框架内使用单阶段方法同时对未对齐的多模态医学图像进行对齐和融合，不仅能实现双任务的相互促进，还能帮助降低模型的复杂性。然而，该模型的设计面临着特征融合和对齐要求不兼容的挑战。为了解决这一挑战，本文提出了一种未对齐医学图像融合方法，称为双向逐步特征对齐与融合（BSFA-F）策略。为了减少模态差异对跨模态特征匹配的负面影响，我们将模态无差异特征表示（MDF-FR）方法纳入BSFA-F中。MDF-FR利用模态特征表示头（MFRH）整合输入图像的全局信息。通过将当前图像的MFRH中包含的信息注入其他模态图像，有效减少模态差异对特征对齐的影响，同时保留不同图像所携带的互补信息。在特征对齐方面，BSFA-F采用基于两点之间向量位移路径独立性的双向逐步对齐变形场预测策略。该策略解决了单步对齐中跨度大和变形场预测不准确的问题。最后，多模态特征融合块实现了对齐特征的融合。多个数据集的实验结果证明了我们方法的有效性。

## 研究背景

多模态医学图像融合（MMIF）能整合不同成像模态的医学图像数据，对提升诊断准确性、辅助治疗计划制定等意义重大，因此受到广泛关注并已有众多有效融合算法。

 然而，多数现有方法假定待融合的源图像在像素层面已严格对齐，但实际中该假设常不成立。处理未对齐图像时，通常先使用配准算法对齐图像再进行融合，这种两阶段方法虽有效，但跨模态图像配准因模态差异和特征不一致面临诸多挑战。 

近年来，研究者开始探索将多源图像配准与融合集成到统一框架，但这些方法并非专门针对多模态医学图像，或在单任务图像融合中牺牲性能，或依赖生成图像的质量，且常采用两阶段处理模式，需单独成熟的图像配准模型，难以将配准和融合无缝嵌入融合过程。此外，单阶段未对齐融合方法只能处理刚性变换导致的特征未对齐，对弹性变换无效。 为解决上述问题，实现多模态医学图像在单阶段处理模式下的配准与融合，本文提出了一种单阶段框架，以解决特征提取对配准和融合的冲突要求。 



## 研究现状

- **多模态医学图像融合算法众多**：基于深度学习的方法广泛应用，可分为基于CNN、Transformer和混合方法。如CNN的残差连接、Transformer的FATMusic等，还有结合两者的混合方法。
- **联合处理框架出现**：为解决图像未对齐问题，近年出现将多源图像配准与融合集成于统一框架的方法，如ReCoNet、UMF - CMGR等。
- **单阶段未对齐融合方法探索**：提出如IVFWSR、RFVIF等单阶段未对齐融合方法，但仅适用于红外 - 可见光图像融合。

## 提出的模型

![Snipaste_2025-06-28_19-58-20](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Ic1Y/0X0/0343OUSlExHYuKaeNuaIWT.webp)

1. 无模态差异特征表示（Modality Discrepancy - Free Feature Representation，MDF - FR）：
   - **特征提取**：利用由Restormer和Transformer层组成的网络作为编码器，从输入的未对齐图像对中提取特征。输入图像经第一个Restormer层输出的浅层特征包含图像的底层细节，直接送入多模态特征融合层以保留融合结果中的边缘细节；经第二个Restormer层输出的特征再经过两个Transformer层，得到用于消除模态差异和预测变形场的特征。
   - **模态差异消除**：通过最小化交叉熵损失得到模态特征表示头，将其注入到特征中以减少模态差异。同时使用两个Transfer块进一步提取用于预测变形场的特征，并通过交叉熵损失更新参数，确保处理后的特征有效消除模态差异。
2. 双向逐步特征对齐（Bidirectional Stepwise Feature Alignment，BSFA）：
   - **向量位移路径独立性**：基于两点间向量位移的路径独立性，提出双向逐步变形场预测策略。该策略可将两点间的变形场表示为中间点变形场的组合，能有效捕捉图像间的相互关系，减少累积误差，提高对齐过程的鲁棒性。
   - **逐步对齐实现**：从两个方向预测输入图像特征的变形场，通过多次变形场预测操作，在中间位置实现特征的跨模态对齐。为保证变形场质量，引入平滑损失和一致性损失进行模型更新。
3. **多模态特征融合（Multi - Modal Feature Fusion，MMFF）**： 将预测的变形场应用于多模态特征，实现输入图像在特征级别的精确对齐和有效融合。具体过程是将特征经过一系列处理后送入FusionBLK进行特征融合，最后将融合结果与浅层特征拼接，通过重建层得到融合图像。同时引入结构损失、像素强度损失和梯度损失来优化网络参数，确保融合图像与源图像的结构一致性、良好的对比度以及边缘细节的保留。

## 实验（Compared with SOTA）

> 数据集：CT-MRI, PET-MRI, SPECT-MRI datasets

- **评估指标**：选择了五个常用的图像质量指标来客观评估融合方法的性能，分别是基于梯度的融合性能（Gradient - based Fusion Performance，$Q_{AB/F}$）、Chen - Varshney度量（Chen - Varshney Metric，$Q_{CV}$）、视觉信息保真度（Visual Information Fidelity，$Q_{VIF}$）、基于结构的度量（Structure - based Metric，$Q_{S}$）和结构相似性指数度量（Structural Similarity Index Measure，$Q_{SSIM}$）。其中，$Q_{CV}$值越低表示融合图像质量越好，其他指标值越高表示融合质量越好。



常见的解决未对齐多源图像融合问题的方法有“Registration + Fusion”（先对要融合的图像进行配准，然后再融合）和“Joint Registration and Fusion”（将配准和融合结合为一个过程的两阶段方法）。为验证所提方法的优越性，将其与这两种方法进行比较，重点对比“Joint Registration and Fusion”方法，与“Registration + Fusion”方法的比较结果包含在补充材料中。具体对比了所提方法与五种联合配准和融合方法（UMF - CMGR、SuperFusion、MURF、IMF和PAMRFuse）的性能。实验结果表明，所提方法在特征对齐、对比度保留和细节保留方面具有显著优势，与现有的两阶段联合处理框架相比，性能更强。此外，通过箱线图展示客观评估结果，所提方法在所有指标上均取得了最佳平均性能，双向对齐策略比IMF的单向对齐策略产生了更好的融合效果。

![Snipaste_2025-06-28_20-02-38](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-06-28_20-02-38.png)

## 实验（Ablation Experiments）​​

- **MDF - FR的有效性**：设计了设置A（不进行MFRH交换且不使用$L_{ce2}$）和设置B（不进行MFRH交换但使用$L_{ce2}$）来验证MDF - FR的有效性。实验结果表明，包含MDF - FR时，所提方法能实现更好的对齐和融合性能。
- **BSFA的有效性**：通过三个实验验证BSFA的有效性。一是完全移除BSFA，评估其对整体对齐性能和融合结果的影响；二是移除BSFA中的正向配准层（FRL），仅保留反向配准层（RRL）；三是仅保留FRL，移除RRL。对齐结果显示，只有完全实施BSFA时，所提方法才能实现出色的对齐效果

## 结论

本文提出了一种**单阶段的多模态医学图像配准与融合框架**。与传统的两阶段方法不同，该框架通过共享特征编码器降低了模型的复杂度。通过引入模态差异无关特征表示（MDF - FR）方法，该框架解决了跨模态特征对齐中的模态差异问题。为每个输入图像添加的模态特征表示头（MFRH）可以整合全局图像特征，保留不同模态间的互补信息。 此外，基于向量位移原理提出的双向逐步对齐策略用于预测变形场。该方法保留了融合信息的完整性和多样性，在需要精确高效配准与融合的临床应用中展现出了潜力。 
