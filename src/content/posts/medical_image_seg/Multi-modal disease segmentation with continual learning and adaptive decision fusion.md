---
title: Multi-modal disease segmentation with continual learning and adaptive decision fusion
published: 2025-07-31 16:15:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "多模态疾病分割对于患者的诊断和治疗至关重要"
categories: 多模态医学图像分割
tags: [Continual Learning, Bayesian Fusion]
---


## 摘要

**Multi-modal disease segmentation** is essential for the diagnosis and treatment of patients. Advanced algorithms have been proposed, however, two challenging issues remain unsolved, i.e., lacked knowledge share and limited modal relation. To this end, we develop a novel framework for multi-modal disease segmentation. It is based on improved continual learning and adaptive decision fusion. Specifically, continual learning with 𝑘-means sampling is developed to highlight knowledge share from multi-modal medical images. In addition, we propose an adaptive decision fusion technique that uses the Naive Bayesian algorithm to improve the relationship between different modalities. To evaluate our proposed model, we chose two typical tasks, i.e., myocardial pathology segmentation and brain tumor segmentation. Four benchmark datasets, i.e., myocardial pathology segmentation challenge 2020 (MyoPS 2020), brain tumor segmentation challenge 2018 (BraTS 2018), BraTS 2019, and BraTS 2020, are utilized to train and test our framework. Both the qualitative and quantitative results demonstrate that our proposed model is effective and has advantages over peer state-of-the-art (SOTA) methods.

## 翻译

多模态疾病分割对于患者的诊断和治疗至关重要。尽管已经提出了先进的算法，但仍有两个挑战性问题未解决，即缺乏知识共享和模态关系有限。为此，我们开发了一种新颖的多模态疾病分割框架，该框架基于**改进的连续学习和自适应决策融合**。具体来说，利用𝑘-means采样的连续学习被开发用于突出多模态医学图像中的知识共享。此外，我们提出了一种自适应决策融合技术，利用朴素贝叶斯算法改善不同模态之间的关系。为了评估我们提出的模型，我们选择了两个典型任务，即心肌病理分割和脑肿瘤分割。四个基准数据集，即心肌病理分割挑战赛2020 (MyoPS 2020)、脑肿瘤分割挑战赛2018 (BraTS 2018)、BraTS 2019和BraTS 2020被用于训练和测试我们的框架。定性和定量结果均表明我们提出的模型是有效的，并且相较于同行的先进方法（SOTA）具有优势。

## 研究背景

**多模态疾病分割**对患者的诊断和治疗至关重要，但目前仍面临两大挑战。一方面，现有基于监督学习网络和自监督学习的疾病分割模型，前者依赖大量手动标注，耗费人力和时间；后者虽能在标签有限时提升分割性能，但存在知识共享不足的问题。另一方面，不同模态间的关系有限，使得模型在处理多模态数据时，因模态差异大导致性能下降。

当前，持续学习和自适应融合技术为解决上述问题带来新思路。持续学习可帮助模型保留知识，自适应融合能增强模态间的关系。然而，尚未有研究将持续学习应用于多模态疾病分割。

基于此，作者开发了一种名为CLBF - Net的新型框架，该框架基于改进的持续学习和自适应决策融合，旨在突出多模态医学图像的知识共享和模态关系，以提高多模态疾病分割的效果，这也是撰写本文的目的。

## 研究现状

### 多模态医学图像分割方法

- **基于监督学习网络的方法**：该类方法通常基于监督学习网络自动提取特征并决策，如Martin等人提出的两阶段网络用于准确心肌分割和小感兴趣区域检测；Zhou等人开发的多阶段模型利用额外约束信息提高分割精度；Li等人采用两个并行卷积神经网络提取各模态特定特征。不过，这些方法依赖大量手动标签，收集过程耗时费力。
- **基于自监督学习的方法**：此类型通过自监督学习将多模态图像编码为嵌入空间，例如Wang等人开发的自动加权框架利用强化学习优化自监督学习层之间的交互；Yang等人引入的灵活模型能够整合多个多模态输入；Shi等人开发的自蒸馏方法在像素和语义层面平衡不同模态的优化。虽然自监督学习在标签有限时能提升分割性能，但仍未解决知识共享不足和模态关系有限的问题。

### 持续学习和自适应融合的发展

- **持续学习**：能帮助模型随时间保留知识，常见策略是基于排练的方法，如黑暗经验回放（DER），通过在缓冲区存储先前数据或特征并在后续训练中重放来保留知识。
- **自适应融合**：被证明可有效增强模态关系，例如Zhu等人基于图卷积设计的自适应融合块用于脑肿瘤分割；Mu等人应用的自适应融合策略结合互补预测，有效处理病变因颜色不一致导致的显著变异性。

## 提出的模型

### 框架架构

主要包含多模态持续预训练学习和自适应决策融合微调两个组件：

- **多模态持续预训练学习**：各模态输入按顺序输入到具有持续预训练学习的骨干网络，生成不同的模态模型$C_n$。使用掩码图像预训练任务从多模态数据中提取通用表示，为防止灾难性遗忘，用基于排练的持续学习策略，通过K-means 采样将先前模态数据的一小部分存储在缓冲区。
- **自适应决策融合微调**：采用朴素贝叶斯算法的决策融合技术，增强不同模态之间的关系。将多模态数据并行输入到预训练的编码器和解码器以得到预测可能性掩码，通过贝叶斯推理计算每个预测掩码的可靠性，将可靠性值归一化转换为权重，通过加权求和得到像素分数。

### 骨干网络

使用三个特定维度的分词器将医学数据转换为令牌序列，标准视觉Transformer（ViT）作为编码器进行序列到序列的表示学习。遵循掩码自动编码器（MAE）方法，随机掩码50%的令牌序列，仅将未掩码的令牌输入到编码器，然后通过基于Transformer的解码器重建缺失的令牌，使用均方误差（MSE）损失确保原始图像和重建图像在掩码区域的一致性。

### 多模态持续学习

采用顺序预训练方法，每个阶段专注于特定成像模态，防止模态数据冲突，但可能导致灾难性遗忘，因此使用基于排练的持续学习保留先验知识。在每个阶段，预训练包括使用当前模态数据的掩码图像建模（MIM）和辅助特征蒸馏任务。

### 自适应决策融合

基于不同模态的预测掩码，使用贝叶斯推理确定其可靠性，将可靠性值归一化为权重，结合预测概率计算背景样本分数，以提高多模态疾病分割的鲁棒性。

![Snipaste_2025-07-31_16-07-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/eHqq/0X0/0343OVUy2LjFLeNzV8Bisz.webp)

![Snipaste_2025-07-31_16-08-15](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_16-08-15.png)



## 实验设置

1. **实验数据集**：使用了四个高质量且开放获取的数据集，分别是**MyoPS 2020**、**BraTS 2018**、**BraTS 2019**和BraTS 2020。其中，MyoPS 2020用于心肌病理分割，其余三个数据集用于脑肿瘤分割。
2. **评估标准**：采用了Dice分数、Hausdorff距离（HD）、准确率、精确率、灵敏度、特异度和F1分数等指标来评估模型性能。同时，通过浮点运算次数（FLOPs）、参数数量和每秒帧数（FPS）来衡量模型的时间复杂度和计算成本。
3. 实验设置
   - **硬件和软件环境**：硬件使用NVIDIA RTX - 3090，软件环境为PyTorch 11.1和Python 3.7。
   - **预训练阶段**：设置训练轮数（epoch）为500，优化器为AdamW，初始学习率为1e - 4，在第200和400个epoch后学习率降低为原来的0.1倍。批量大小为24，采样数K固定为5。所有图像调整为512×512像素。
   - **微调阶段**：继续使用AdamW优化器，根据具体下游任务调整超参数，损失权重λu和λf分别设置为0.4和0.6。混合策略（mixup strategy）中，持续掩码向量λc设置为0.5。

## 实验（Compared with SOTA）

- **分割实验**：在四个数据集上进行多模态疾病分割实验，分为心肌病理分割和脑肿瘤分割两个任务。设置十个随机种子评估模型的鲁棒性。结果显示，模型在脑肿瘤分割数据集上的表现优于心肌病理分割数据集。
- **对比实验**：将模型与其他相关工作在心肌病理和脑肿瘤分割任务上进行对比。定量结果表明，该模型在多个指标上优于之前的SOTA方法；定性结果显示，模型的预测掩码与真实标签的相似度更高。

![Snipaste_2025-07-31_16-10-25](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_16-10-25.png)

![Snipaste_2025-07-31_16-10-54](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_16-10-54.png)

## 实验（Ablation Experiments）​​

- 消融实验
  - **持续学习的贡献**：分析了有无持续学习、特征蒸馏（FD）、k - means采样和混合策略（MS）对模型性能的影响。结果表明，持续学习能够有效促进多模态知识共享，提升多模态疾病分割性能。
  - **自适应决策融合的贡献**：分析了有无自适应决策融合（ADF）以及与其他融合方法（如平均权重（AW）、多特征推理块（MFIB）和深度标签融合（DLF））的对比。结果显示，基于贝叶斯算法的决策融合能够有效融合多模态掩码的不确定分数，提高分割性能。
- **超参数优化**：分析了Transformer编码器中单通道特征提取模块的数量NS和分类分支的数量NM对模型性能的影响。结果表明，NS = 8和NL = 8时模型性能最佳。同时，模型在计算资源使用上实现了性能和效率的平衡。

![Snipaste_2025-07-31_16-11-27](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-31_16-11-27.png)

## 结论

者提出了基于持续学习和贝叶斯融合的CLB -Net框架用于多模态疾病分割，得出以下结论：

1. 实验在心肌病理分割和脑肿瘤分割两个典型任务、四个基准数据集上进行，结果表明该框架有效，相比其他先进算法具有优势。
2. 持续学习结合k - 均值采样增强了多模态知识共享，贝叶斯自适应决策融合技术提升了不同模态间的关系，有效改善了多模态疾病分割效果。
3. 指出当前研究仍存在处理多模态数据计算资源和时间需求大、涉及患者隐私保护和模型安全等挑战。未来计划结合多中心临床数据、减少模型参数、提高临床数据传输安全性来优化框架。
