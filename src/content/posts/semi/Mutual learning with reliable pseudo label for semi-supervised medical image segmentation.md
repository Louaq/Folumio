---
title: Mutual learning with reliable pseudo label for semi-supervised medical image segmentation
published: 2025-11-27 14:00:00
expires: 2025-12-21 23:59:59
category: 半监督医学图像分割
description: Semi-supervised learning has garnered
tags: [Medical Image Segmentation, Dual Attention Encoder]
---

::github{repo="Jiawei0o0/mutual-learning-with-reliable-pseudo-labels"}

## 摘要

Semi-supervised learning has garnered significant interest as a method to alleviate the burden of data
annotation. Recently, semi-supervised medical image segmentation has garnered significant interest that can
alleviate the burden of densely annotated data. Substantial advancements have been achieved by integrating
consistency-regularization and pseudo-labeling techniques. The quality of the pseudo-labels is crucial in this
regard. Unreliable pseudo-labeling can result in the introduction of noise, leading the model to converge to
suboptimal solutions. To address this issue, we propose learning from reliable pseudo-labels. In this paper,
we tackle two critical questions in learning from reliable pseudo-labels: which pseudo-labels are reliable and
how reliable are they? Specifically, we conduct a comparative analysis of two subnetworks to address both
challenges. Initially, we compare the prediction confidence of the two subnetworks. A higher confidence score
indicates a more reliable pseudo-label. Subsequently, we utilize intra-class similarity to assess the reliability
of the pseudo-labels to address the second challenge. The greater the intra-class similarity of the predicted
classes, the more reliable the pseudo-label. The subnetwork selectively incorporates knowledge imparted by
the other subnetwork model, contingent on the reliability of the pseudo labels. By reducing the introduction of
noise from unreliable pseudo-labels, we are able to improve the performance of segmentation. To demonstrate
the superiority of our approach, we conducted an extensive set of experiments on three datasets: Left Atrium,
Pancreas-CT and Brats-2019. The experimental results demonstrate that our approach achieves state-of-the-art
performance. Code is available at: https://github.com/Jiawei0o0/mutual-learning-with-reliable-pseudo-labels

## 翻译

半监督学习作为一种减轻数据标注负担的方法，已经引起了广泛关注。最近，半监督医学图像分割引起了极大的关注，它可以减轻密集标注数据的负担。通过结合一致性正则化和伪标签技术，已经取得了实质性进展。在这方面，伪标签的质量至关重要。不可靠的伪标签会导致噪声的引入，使模型收敛到次优解。为了解决这个问题，我们提出从可靠的伪标签中学习。在本文中，我们解决了从可靠伪标签中学习的两个关键问题：**哪些伪标签是可靠**的以及**它们有多可靠**？具体而言，我们针对这两个挑战进行了两个子网络的比较分析。首先，我们比较两个子网络的预测置信度。更高的置信度得分表明伪标签更可靠。随后，我们利用类内相似性来评估伪标签的可靠性，以解决第二个挑战。预测类别的类内相似性越高，伪标签就越可靠。子网络有选择地整合来自另一个子网络模型的知识，这取决于伪标签的可靠性。通过减少不可靠伪标签引入的噪声，我们能够提高分割的性能。为了展示我们方法的优越性，我们在三个数据集上进行了大量实验：左心房、胰腺-CT和Brats-2019。实验结果表明，我们的方法达到了最先进的性能。代码可在以下网址获取：https://github.com/Jiawei0o0/mutual-learning-with-reliable-pseudo-labels

## 研究背景

医学图像分割是计算机辅助诊断系统的关键组成部分，但深度卷积神经网络（CNN）的优异性能依赖于大量像素级标注数据。医学图像的密集标注成本高、耗时长，半监督学习通过结合少量标注数据和大量未标注数据缓解这一问题，成为研究热点。现有半监督分割方法主要集成一致性正则化与伪标签技术，但伪标签质量对模型性能至关重要。不可靠的伪标签会引入噪声，导致模型收敛到次优解。传统方法通过固定阈值筛选高置信度伪标签，但阈值选择困难：低阈值可能保留噪声，高阈值会限制未标注数据利用并偏向多数类。因此，本文针对两个核心问题展开研究：如何识别可靠伪标签，以及如何量化其可靠性，旨在通过可靠伪标签的互学习减少噪声影响，提升半监督医学图像分割性能。

![Snipaste_2025-11-28_09-38-33](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Qb0H/0X0/0343OVYNrJsrGTork1iFhU.webp)

## 研究现状

1. **核心方向**：半监督医学图像分割，通过结合**一致性正则化**与**伪标签技术**，利用有限标注数据和大量无标注数据训练模型，缓解医学图像密集标注的高成本问题。
2. **主流方法**：
   - **一致性正则化**：通过数据/特征/模型层面的扰动，强制模型输出一致预测（如UA-MT、URPC）。
   - **伪标签技术**：生成高置信度伪标签指导无标注数据学习（如MC-Net、SS-Net）。
   - **混合策略**：多子网络交叉监督融合上述两种方法（如CCT、AC-MT），提升性能。

## 提出的模型

![Snipaste_2025-11-28_09-41-21](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/3REI/1220X686/1bjMhoT0Uf4iG4Ygy4PWu0.png)

本文提出了一种基于可靠伪标签的互学习半监督医学图像分割模型，主要创新点包括双子网互学习框架及可靠性评估机制两方面： 
### 核心框架 
1. **两个子网络结构**     - 共享编码器+两个差异化解码器（采用不同上采样技术），生成两类伪标签   - 目标：解决传统伪标签方法中阈值筛选导致的噪声引入和类别偏见问题 
2. **互学习机制**     
 - 两个解码器通过比较预测置信度实现双向知识蒸馏     
 - 仅当对方子网预测置信度更高时才进行学习，避免噪声累积 
### 可靠性评估方法 
1. **伪标签可靠性筛选（WR模块）**     
 - **置信度比较**：计算两个子网的预测置信度矩阵（如式8）    
 - **动态掩码**：通过指示函数生成0-1掩码，仅保留高置信度伪标签（如式9）     
 - **优势**：无需人工设定阈值，自适应过滤低质量伪标签
2. **可靠性量化评估（HR模块）**    
 - **类内语义一致性**：      
  1. 基于伪标签生成类别原型（Class Prototype）      
  2. 计算像素特征与类别原型的余弦相似度       
  3. 通过MSE距离度量预测概率与特征相似度的一致性（如式13）    
 - **可靠性权重**：距离越小权重越高，降低不可靠伪标签的学习权重 
 ### 损失函数设计
 $$Loss = \gamma(L_{dice}^a + L_{dice}^b) + \beta(\lambda_{wr}^a\lambda_{hr}^aL_{ce}(y_b,y_p^a) + \lambda_{wr}^b\lambda_{hr}^bL_{ce}(y_a,y_p^b)) $$ 
 - **监督损失**：带标签数据的Dice损失   
 - **无监督损失**：结合可靠性权重（WR×HR）的交叉熵损失   
 - **动态平衡参数**：β采用时间依赖的高斯升温函数 





## 实验（Compared with SOTA）

> 数据集: **Left Atrium (LA) 数据集**, **Pancreas-CT 数据集**, **Brats-2019 数据集**

### 实现细节

- **网络架构**：采用V-Net作为 backbone，包含一个共享编码器和两个不同的解码器（使用不同的上采样技术）。
- **训练配置**：PyTorch框架，NVIDIA RTX 3090 GPU；优化器为SGD（初始学习率10⁻²，权重衰减10⁻⁴）；批大小4（2个标记样本+2个未标记样本）；训练迭代次数15k。
- **评价指标**：Dice系数、Jaccard系数、95% Hausdorff距离（95HD）、平均表面距离（ASD）。

### 对比实验

1. **与现有半监督方法对比**
   - **LA数据集**：在10%标记数据下，所提方法Dice系数达89.86%，较UA-MT（84.58%）、MC-Net+（88.39%）等方法显著提升；20%标记数据时Dice达91.02%，接近全监督V-Net（91.33%）。
   - **Pancreas-CT数据集**：10%标记数据下Dice达75.93%，较URPC（73.53%）提升2.4%；20%标记数据时Dice达81.53%，较MC-Net+（79.37%）提升2.16%。
   - **Brats-2019数据集**：10%标记数据下Dice达84.29%，较AC-MT（83.77%）提升0.52%；20%标记数据时Dice达85.47%，较AC-MT（84.63%）提升0.84%。

![Snipaste_2025-11-28_09-50-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/elmj/1216X583/2TJdAadTdmXO0NHGHmn8se.png)



![Snipaste_2025-11-28_09-50-04](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/qSl8/1133X507/3eRhne6ncGwMN0h6AGrdN3.png)

![Snipaste_2025-11-28_09-50-33](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/bkFq/1224X589/4aND9ddsKEZDLcXKeUCtOB.png)

## 实验（Ablation Experiments）​​

1. - **关键组件验证**：对比交叉熵损失（CE）、可靠伪标签选择（WR）、可靠性评估（HR）的组合效果。结果显示，同时使用WR和HR时性能最优（LA数据集Dice 89.86%，Pancreas-CT数据集Dice 75.93%）。
   - **可靠性度量方法对比**：对比特征相似度（Sim）、最大概率（Prob）、乘积（Multiply）、平均（Avg）等方法，所提基于MSE的度量方法效果最佳（LA数据集Dice 89.86%）。
   - **解码器数量扩展**：在LA数据集上，3个解码器性能略低于2个解码器；在Pancreas-CT数据集上，3个解码器在10%标记数据下Dice提升1.72%，但整体增益有限。
2. **阈值方法对比**：与基于阈值筛选高置信伪标签的方法相比，所提无阈值的互学习策略在LA数据集上Dice更高（89.86% vs 阈值0.5时的88.60%），且避免了阈值选择难题。
3. **超参数敏感性分析**：超参数γ（平衡监督与无监督损失）在0.5时性能最优，过小将导致标记数据训练不足，过大则削弱互学习约束。

## 结论

本文针对半监督医学图像分割中伪标签质量影响模型性能的核心问题，提出了一种基于可靠伪标签的互学习框架，主要工作总结如下：

### 核心贡献

1. **可靠伪标签学习框架**
   提出双子网互学习机制解决两个关键问题：
   - **哪些伪标签可靠？** 通过比较两个子网的预测置信度（式8-9），选择置信度更高的伪标签作为监督信号，避免低质量预测误导模型。
   - **伪标签可靠性如何？** 引入类内语义一致性度量（式10-13），通过计算特征与类原型的余弦相似度及预测概率的MSE距离，量化伪标签可靠性并赋予权重。
2. **互学习策略**
   两个子网采用不同上采样技术，仅在对方预测置信度更高时进行知识融合（图2），同时利用可靠性权重动态调整监督强度，减少噪声干扰。
3. **实验验证**
   在Left Atrium、Pancreas-CT和Brats-2019数据集上，10%/20%标注数据设置下均达到SOTA性能：
   - Left Atrium（10%标注）：Dice达89.86%（较基线提升10.33%），95HD降至6.91 voxels
   - Pancreas-CT（10%标注）：Dice达75.93%（较基线提升21.99%）
   - Brats-2019（10%标注）：Dice达84.29%（较SOTA AC-MT提升0.52%）

### 关键发现

- **阈值无关筛选**：相比传统阈值筛选高置信伪标签，互学习机制可自适应区分可靠样本，缓解类别不平衡导致的偏见。
- **类内一致性增益**：结合特征相似度与预测概率的可靠性度量（式13），较单一指标（概率/相似度）提升1.26%-1.66% Dice。
- **子网数量影响**：双子网性能优于三子网（LA数据集Dice下降0.48%），表明过多子网可能引入冗余噪声。

### 未来方向

计划整合类间差异性度量，通过联合类内相似度与类间区分度进一步优化伪标签质量评估，提升模型在低标注数据下的鲁棒性。



> 本文提提出的伪标签互学习确定可靠的伪标签值得思考，同时还需要度量具体的可靠性，即**哪些伪标签是可靠的和有多可靠**





