---
title: Mirror U-Net Marrying Multimodal Fission with Multi-task Learning for Semantic Segmentation in Medical Imaging
published: 2025-06-30 14:24:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "云想衣裳花想容，春风拂槛露华浓"
categories: 医学图像分割
tags: [Medical Image Segmentation, Dual Attention Encoder]
top: true
---

## 摘要

**Positron Emission Tomography (PET) and Computed To-mography (CT)** are routinely used together to detect tumors. PET/CT segmentation models can automate tumor delineation, however, current multimodal models do not fully exploit the complementary information in each modality, as they either concatenate PET and CT data or fuse them at the decision level. To combat this, we propose Mirror U-Net, which replaces traditional fusion methods with multi-modal fission by factorizing the multimodal representation into modality-specific decoder branches and an auxiliary multimodal decoder. At these branches, Mirror U-Net assigns a task tailored to each modality to reinforce unimodal features while preserving multimodal features in the shared representation. In contrast to previous methods that use either fission or multi-task learning, Mirror U-Net combines both paradigms in a unified framework. We explore various task combinations and examine which parameters to share in the model. We evaluate Mirror U-Net on the AutoPET PET/CT and on the multimodal MSD BrainTumor datasets, demonstrating its effectiveness in multimodal segmentation and achieving state-of-the-art performance on both datasets. Code: https://github.com/Zrrr1997

## 翻译

正电子发射断层扫描 (PET) 和计算机断层扫描 (CT) 常常结合使用来检测肿瘤。PET/CT 分割模型能够自动进行肿瘤界定，但当前的多模态模型未充分利用每种模态中的互补信息，因为它们要么将 PET 和 CT 数据连接起来，要么在决策层面进行融合。为了解决这一问题，我们提出了 Mirror U-Net，它通过将多模态表示因式分解为模态特定的解码器分支和一个辅助的多模态解码器，来替代传统的融合方法。在这些分支中，Mirror U-Net 为每种模态分配一个量身定制的任务，以强化单模态特征，同时在共享表示中保留多模态特征。与之前仅使用分裂或多任务学习的方法不同，Mirror U-Net 将这两种范式结合在一个统一的框架中。我们探索了各种任务组合，并研究在模型中共享哪些参数。我们在 AutoPET PET/CT 和多模态 MSD BrainTumor 数据集上评估了 Mirror U-Net，证明了其在多模态分割中的有效性，并在两个数据集上达到了最先进的性能。代码：https://github.com/Zrrr1997

## 研究背景

PET和CT扫描常联合用于癌症诊断和治疗，能提供肿瘤大小、位置等信息。深度学习模型可自动分割PET/CT扫描中的病变，但肿瘤分割存在挑战： 1. **数据特征局限**：PET中高代谢活动并非肿瘤特有，也可能出现在炎症或感染区域；CT虽能提供解剖信息，但单独使用不足以清晰显示病变。 2. **数据资源有限**：体素级标注的PET/CT数据集稀缺，导致当前多模态PET/CT分割模型在临床应用中可靠性欠佳。 3. **现有方法不足**：现有多模态PET/CT分割模型大多采用早期融合（将各模态数据拼接为单一输入）或晚期融合（合并单模态模型的预测结果），这些方法未能充分利用各模态的互补信息。 基于上述问题，作者提出Mirror U - Net，结合多模态分解和多任务学习，以解决现有方法的不足，实现更有效的多模态分割，并在相关数据集上验证其性能。 

## 研究现状

- **多模态融合**：PET/CT、CT/MRI、多对比度MRI等多模态自动分割取得显著进展，常见早期和晚期融合方法。早期融合将模态串联成单一输入，晚期融合结合单模态模型预测。
- **多模态分解**：通过分解表示学习或显式分离单模态和多模态路径，将数据分解为多模态和单模态信息。
- **多任务学习**：在医学图像分割中广泛应用，用于利用不同任务的相关性或正则化分割。

## 提出的模型

![Snipaste_2025-07-02_11-15-15](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/KQJ2/0X0/0343OVQ1kuTK1kzLn7YrMR.webp)

文章提出的模型是**Mirror U-Net**，这是一个将多模态分解（multimodal fission）和多任务学习（multi-task learning）相结合的统一框架，用于医学图像的语义分割。以下是该模型的详细信息： 
1. **架构设计**：Mirror U-Net利用两个共享瓶颈权重的3D U-Net模型，类似两个被水平镜子分隔的U-Net。一个模型处理CT数据，另一个处理PET数据。跳跃连接（skip connection）强化特定模态特征，共享层学习多模态特征。 
2. **多模态分解**：该模型将多模态特征分解为特定模态的解码器分支和一个辅助多模态解码器，从而分离出特定模态特征（如PET/CT中的代谢和解剖线索）与多模态特征。
3. **多任务学习**：Mirror U-Net探索了四种任务组合（v1 - v4），以利用分离的信息。每个版本的任务组合不同，旨在通过不同的任务来学习有用的特征，增强单模态特征的同时保留共享表示中的多模态特征。   
  - **版本1（v1）**：通过L2损失训练CT分支进行重建，同时使用Dice和交叉熵损失训练PET分支进行分割，将CT的高分辨率解剖知识通过多模态表示转移到低分辨率的PET中。  
  - **版本2（v2）**：在v1的基础上增加了一个瓶颈解码器，用于重建PET数据，以调节多模态特征对高代谢区域的敏感性。    
  - **版本3（v3）**：在v2的基础上添加了一个二元肿瘤分类器，用于判断患者是否患有肿瘤，以解决训练中的保守预测和假阳性问题。   
  - **版本4（v4）**：联合训练特定模态分支进行分割，通过加权求和的方式组合它们的逻辑值，是一个单任务的多模态裂变实验。
4. **权重共享**：研究了不同的权重共享位置，包括在编码器分支的瓶颈之前和在解码器的瓶颈之后共享层，以确定对所有版本都最优的权重共享方案，并评估每个版本对超参数变化的敏感性。
5. **实验验证**：在AutoPET PET/CT和多模态MSD BrainTumor数据集上进行评估，实验结果表明，Mirror U-Net在多模态分割中表现出色，在两个数据集上均达到了最先进的性能，超越了传统的融合方案以及仅使用裂变或仅使用多任务学习的方法。 

## 实验（Compared with SOTA）

1. **任务组合和权重共享实验**
   - **定量结果**：在AutoPET数据集上，对Mirror U - Net的所有版本（v1） - （v4）和所有权重共享变体L进行实验，观察到三种趋势。一是自我监督方面，在（v1） - （v3）中通过添加噪声或体素重排来正则化重建，能持续提升性能，体素重排效果最佳且最稳健；二是权重共享方面，仅共享瓶颈层（L = {5}）在所有多任务设置中效果最佳，共享浅层、深层或多层会显著降低性能；三是添加任务方面，每个Mirror U - Net版本性能依次提升，即（v4） < （v1） < （v2） < （v3），逐步添加有意义的任务可持续改善性能。
   - **定性结果**：展示了Mirror U - Net（v1） - （v4）各分支的定性结果。（v1） - （v3）中，体素重排使模型恢复结构，提升表示和分割效果，添加分类头能细化分割；（v4）中CT分支虽不适合单独分割，但能为PET分支提供空间指导，结合两者预测结果更接近真实掩码。


![Snipaste_2025-07-02_11-18-04](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-02_11-18-04.png)



2. **与其他方法的比较实验**
   - **与基线方法比较**：将Mirror U - Net与传统的早期融合（EF）、中期融合（MF）、晚期融合（LF）以及仅基于CT或PET数据训练的单模态U - Net进行比较。结果显示单模态CT模型性能差，单模态PET模型虽优于传统融合策略但假阳性体积高，所有Mirror U - Net变体在所有指标上均优于基线方法。
   - **与相关工作比较**：将Mirror U - Net与仅使用裂变、仅使用多任务学习或两者都不使用的相关方法进行比较。还与标准医学分割基准nnUNet和AutoPET 2022挑战获胜者Blackbean进行对比。结果表明Mirror U - Net在AutoPET数据集上始终优于其他模型，展现了结合多模态裂变和多任务学习的有效性。



3. **脑肿瘤分割的泛化实验**：将Mirror U - Net（v2）与nnUNet、SegResNet以及Mirror U - Net（v1）和（v2） - rec进行比较。结果表明Mirror U - Net在所有3种肿瘤类别上均优于其他方法，省略瓶颈任务会导致性能显著下降，（v2） - rec在肿瘤核心和水肿分割上取得次佳结果，说明该模型有潜力泛化到其他成像模态和任务。

## 结论

本文提出了Mirror U-Net模型，首次将多模态裂变与多任务学习相结合，并在多个数据集上进行了实验，主要结论如下： 
1. **性能表现优异**：该模型在2022年AutoPET挑战赛数据集以及MSD BrainTumor数据集上的表现均超越了传统融合方法、仅使用裂变或仅使用多任务学习的方法，展现出最先进的性能，证实了结合多模态裂变与多任务学习的有效性。 
2. **权重共享方案**：实验结果表明，仅共享瓶颈层的权重是最优方案，共享较浅或较深的层会导致性能下降。 
3. **任务选择重要**：定性实验显示，选择合适的任务可以提高性能，共享表示能够学习到空间引导信息，从而增强主要分割任务的效果。
4. **模型具有泛化性**：Mirror U-Net能够有效泛化到多模态MRI扫描的脑肿瘤分割任务中，证明了其在不同任务和成像模态中的适用性。
5. **临床应用潜力**：该模型对超参数变化具有较强的鲁棒性，且性能良好，为PET/CT分割模型在临床实践中的应用迈出了重要一步。 





