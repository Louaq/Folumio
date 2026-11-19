---
title: Rethinking U-Net Task-Adaptive Mixture of Skip Connections for Enhanced Medical Image Segmentation
published: 2025-06-23 10:37:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "混合专家系统（Mixture of Experts, MoE）"
categories: 医学图像分割
tags: [U-Net]
---

## 摘要

U-Net is a widely used model for medical image segmentation, renowned for its strong feature extraction capabilities and U-shaped design, which incorporates skip connections to preserve critical information. However, its decoders exhibit information-specific preferences for the supplementary content provided by skip connections, instead of adhering to a strict one-to-one correspondence, which limits its flexibility across diverse tasks. To address this limitation, we propose the Task-Adaptive Mixture of Skip Connections (TA-MoSC) module, inspired by the Mixture of Experts (MoE) framework. TA-MoSC innovatively reinterprets skip connections as a task allocation problem, employing a routing mechanism to adaptively select expert combinations at different decoding stages. By introducing MoE, our approach enhances the sparsity of the model, and lightweight convolutional experts are shared across all skip connection stages, with a Balanced Expert Utilization (BEU) strategy ensuring that all experts are effectively trained, maintaining training balance and preserving computational efficiency. Our approach introduces minimal additional parameters to the original U-Net but significantly enhances its performance and stability. Experiments on GlaS, MoNuSeg, Synapse, and ISIC16 datasets demonstrate state-of-the-art accuracy and better generalization across diverse tasks. Moreover, while this work focuses on medical image segmentation, the proposed method can be seamlessly extended to other segmentation tasks, offering a flexible and efficient solution for diverse applications.

## 翻译

U-Net是一种广泛应用于医学图像分割的模型，以其强大的特征提取能力和u形设计而闻名，u形设计采用跳过连接来保留关键信息。然而，它的解码器对跳过连接提供的补充内容显示了特定于信息的首选项，而不是遵循严格的一对一对应关系，这限制了它在不同任务中的灵活性。为了解决这一限制，我们提出了任务自适应跳跃连接混合(TA-MoSC)模块，灵感来自混合专家(MoE)框架。TA-MoSC创新性地将跳跃连接重新解释为任务分配问题，采用路由机制自适应地选择不同解码阶段的专家组合。通过引入MoE，我们的方法增强了模型的稀疏性，并且在所有跳跃连接阶段共享轻量级卷积专家，并采用平衡专家利用率(BEU)策略确保所有专家都得到有效训练，保持训练平衡并保持计算效率。我们的方法在原有的U-Net基础上引入了最小的附加参数，但显著提高了其性能和稳定性。在GlaS, MoNuSeg, Synapse和ISIC16数据集上的实验证明了最先进的准确性和跨不同任务的更好泛化。此外，虽然本研究的重点是医学图像分割，但该方法可以无缝扩展到其他分割任务，为各种应用提供了灵活高效的解决方案。

## 研究背景

医学图像分割对医疗数据的分析和解读至关重要，能辅助疾病诊断和治疗。U - Net因强大的特征提取能力和U形结构，成为广泛应用的医学图像分割模型，其跳跃连接可保留关键信息，但也存在不足。 原始U - Net的跳跃连接未能有效解决编码器与解码器间的语义差距问题，不同医疗成像任务对语义特征的侧重点不同，简单的一对一连接机制难以满足需求，导致模型性能受限。 尽管已有一些改进方法，如UNet++采用嵌套和密集跳跃路径、部分方法引入注意力机制或使用Transformer架构，但这些方法要么增加了架构复杂度和计算开销，要么缺乏适应不同数据集的灵活性，无法充分考虑解码器对语义信息的阶段特定偏好，泛化能力不足。 基于此，本文通过大量实验探索U - Net中跳跃连接的不同组合，发现每个解码器阶段所需信息并非与跳跃连接严格一对一对应，从而提出任务自适应跳跃连接混合（TA - MoSC）模块，以解决这些问题，提升模型性能和泛化能力。 

## 研究现状

- **U-Net架构多样**：U-Net凭借其强大的特征提取能力和U形结构，成为医学图像分割领域广泛采用的架构，衍生出ResUNet、DenseUNet、UNet++等众多变体，还引入了注意力机制、Transformer架构等。
- **Skip Connection改进**：一些方法如UDTransNet、EIU-Net通过基于注意力的重新校准改进了跳跃连接，但缺乏适应不同数据集需求的灵活性。
- **Mixture of Experts应用**：稀疏激活的Mixture of Experts（MoE）模型在视觉和文本模型扩展方面取得成功，但在图像分割领域，尤其是跳跃连接方面的应用尚未深入探索。

## 提出的模型

![Snipaste_2025-06-23_10-43-43](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/48gl/0X0/0343OVpzvm9ohqxkXOEOyp.webp)

- TA - MoSC模块：受混合专家（Mixture of Experts，MoE）框架启发，将跳跃连接重新定义为任务分配问题。该模块由路由银行（Router Bank）、跳跃连接（Skip - Connection，SC）银行和四个对接器（Dockers）组成。其工作流程如下：

  - **特征聚合**：输入图像经过多层编码器处理，生成不同层次的特征。将前四层特征调整为相同大小后，沿通道维度拼接形成统一的特征表示，并进行特征维度缩减。

  - **路由阶段**：路由银行中的每个路由器为定制合适的专家组合，为不同阶段的跳跃连接选择路由方案。专家采用独立的卷积子网络，对输入特征进行专门的非线性变换。使用TopK（K = 2）操作进行稀疏选择，确保只有部分专家被激活，降低计算开销。最后，通过对接器模块对跳跃连接进行整形和处理，将其传输到相应的解码器。

  - **平衡专家利用**：该模块包含专家方差（Expert Variance，EV）损失和未使用专家处理两个关键机制。
    - **专家方差损失**：计算不同门控网络中专家使用的方差，避免模型过度依赖某些专家，促使所有专家充分发挥能力。
    - **未使用专家处理**：当门控网络未选择某些专家时，用输入数据的随机样本对这些未使用的专家进行处理，防止专家闲置，确保每个专家都得到训练。

## 实验（Compared with SOTA）

> 数据集

- **GlaS**：包含**165**张高分辨率苏木精 - 伊红（H&E）染色图像，85张用于训练，80张用于测试。
- **MoNuSeg**：由**44**张图像组成，30张用于训练，14张用于测试。
- **Synapse**：有**30**个腹部CT扫描，共3779张轴向图像，涵盖8个器官。
- **ISIC16**：有**1279**张皮肤镜图像，其中测试集包含379张，有两种疾病类别的真实标注。



> 训练策略

训练过程分为两个阶段。第一阶段，**使用原始跳跃连接训练编码器和解码器**，使其熟悉数据集并掌握基本的编码和解码能力。之后，**冻结编码器和解码器，专注训练提出的TC - MoSC模块**，使每个专家充分学习其专长的特征，路由器根据各解码阶段的语义需求有效分配任务。冻结编码器和解码器是为防止其参数在整个训练过程中变化，降低训练难度，便于收敛。

**定量比较**：在GlaS、MoNuSeg和ISIC16数据集上，使用Dice系数和交并比（IoU）作为性能指标；在多标签分割的Synapse数据集上，使用95% Hausdorff距离指标。采用5折交叉验证评估模型性能，使用独立Student's t - 检验（α = 0.05）评估统计显著性。结果表明，模型在GlaS和MoNuSeg上显著优于基线模型，实验结果的小标准差显示出模型的高稳定性和鲁棒性，在不同数据集上兼容性良好。
**定性比较**：如图5所示，红色框突出显示了UTANet在四个数据集上优于其他模型的区域。在MoNuseg数据集上，UTANet能更有效地捕捉细节信息，这得益于TA - MoSC模块中对细节敏感的专家模块。

![Snipaste_2025-06-23_10-48-36](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-06-23_10-48-36.png)



## 实验（Ablation Experiments）​​

- **提出模块的消融研究**：结果显示，Baseline + TA - MoSC + BEU始终优于其他基线，表明纳入TA - MoSC模块显著提高了模型的分割性能，应用BEU优化进一步增强了性能。不同数据集在解码阶段需要不同程度的补充信息，为解码器提供适当的补充信息可大幅提高模型的分割性能。
- **TopK设置的消融研究**：在推理阶段实验不同的TopK设置，发现单标签数据集上TopK设为3效果最佳，多标签的Synapse数据集上TopK设为4效果最佳。可视化在GlaS数据集上训练的模型中的专家发现，每个专家网络学习的特征和语义不同，经过TA - MoSC模块后，跳跃连接特征的高亮区域与编码器第三和第四阶段的特征紧密对齐，证实了模型对不同数据集或任务的跳跃连接信息有特定偏好，TA - MoSC模块能有效解决跳跃连接中的信息不对称问题。

![Snipaste_2025-06-23_10-49-04](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-06-23_10-49-04.png)



![Snipaste_2025-06-23_10-49-28](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-06-23_10-49-28.png)

## 结论

在U-Net的解码过程中，**不同数据集对补充信息的需求存在差异**。本文通过将**混合专家**（Mixture of Experts，MoE）框架集成到**跳跃连接**（skip connections）中，解决了这一问题，实现了多尺度特征的自适应重新分配，以适应解码器在不同阶段的特定偏好。与传统的固定跳跃连接机制不同，所提出的任务自适应跳跃连接混合（Task-Adaptive Mixture of Skip Connections，TA-MoSC）模块能够动态地对齐编码器和解码器的特征，从而应对特定数据集的分割挑战。 尽管本文以医学图像分割作为案例研究，但所提出的方法可以推广到其他密集预测任务，如自然图像分割和目标检测。在未来的工作中，作者将专注于优化模型的计算效率，使TA-MoSC模块更具可扩展性和高效性，确保其在跨领域的实时应用和大规模任务中的实用性。 


