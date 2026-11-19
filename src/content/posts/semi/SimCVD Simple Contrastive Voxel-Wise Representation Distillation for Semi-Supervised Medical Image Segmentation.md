---
title: SimCVD Simple Contrastive Voxel-Wise Representation Distillation for Semi-Supervised Medical Image Segmentation
published: 2025-12-29 17:21:00
expires: 2026-01-28 23:59:59
description: "在医学图像分析中"
category: 半监督医学图像分割
tags: [TMI,对比学习,知识蒸馏]
---

:::note
本文的理论基础是知识蒸馏和对比学习以及无监督训练策略，可以参考
:::






## 摘要

Automated segmentation in medical image analysis is a challenging task that requires a large amount of manually labeled data. However, most existing learning-based approaches usually suffer from limited manually annotatedmedical data, which poses a major practical problem for accurate and robust medical image segmentation. In addition,most existing semi-supervisedapproaches are usually not robust compared with the supervised counterparts, and also lack explicit modeling of geometric structure and semantic information, both of which limit the segmentation accuracy. In this work, we present SimCVD, a simple contrastive distillation framework that significantly advances state-of-the-art voxel-wise representation learning. We first describe an unsupervised training strategy, which takes two views of an input volume and predicts their signed distance maps of object boundaries in a contrastive objective, with only two independent dropout as mask. This simple approach works surprisingly well, performing on the same level as previous fully supervised methods with much less labeled data. We hypothesize that dropout can be viewed as a minimal form of data augmentation and makes the network robust to representation collapse. Then, we propose to perform structural distillation by distilling pair-wise similarities. We evaluate SimCVD on two popular datasets: the Left Atrial Segmentation Challenge (LA) and the NIH pancreas CT dataset. The results on the LA dataset demonstrate that, in two typesof labeled ratios (i.e., 20%and 10%), SimCVD achieves an average Dice score of 90.85% and 89.03% respectively, a 0.91% and 2.22% improvement compared to previous best results. Our method can be trained in an end-to-end fashion, showing the promise of utilizing SimCVD as a general framework for downstream tasks, such as medical image synthesis, enhancement, and registration.

## 翻译

在医学图像分析中，自动分割是一项具有挑战性的任务，需要大量人工标注的数据。然而，大多数现有的基于学习的方法通常会因为手动标注的医学数据有限而受限，这对实现准确且稳健的医学图像分割构成了主要的实际问题。此外，大多数现有的半监督方法通常没有监督方法稳健，且缺乏对几何结构和语义信息的明确建模，这些因素共同限制了分割的准确性。在这项工作中，我们提出了SimCVD，一个简单的对比蒸馏框架，极大地推进了最先进的逐体素表示学习。我们首先描述了一种无监督的训练策略，该策略对输入体积的两个视图进行处理，并在对比目标中预测物体边界的符号距离图，仅使用两个独立的dropout作为遮罩。这种简单的方法效果出奇地好，在标注数据少得多的情况下，表现与之前的全监督方法处于同一级别。我们假设dropout可以被视为数据增强的最低形式，使网络对表示崩溃具有鲁棒性。然后，我们建议通过蒸馏成对相似性来进行结构蒸馏。我们在两个流行的数据集上评估了SimCVD：左心房分割挑战（LA）和NIH胰腺CT数据集。在LA数据集上的结果表明，在两种标注比例（即20%和10%）下，SimCVD分别达到了平均Dice得分90.85%和89.03%，相比之前的最佳结果提高了0.91%和2.22%。我们的方法可以用端到端的方式进行训练，展示了将SimCVD用作下游任务（如医学图像合成、增强和配准）的一般框架的潜力。

## 研究背景

医学图像分割是机器学习和医学影像领域的重要任务，但现有深度学习方法高度依赖大量标注数据，而医学数据标注成本高、数量有限，导致模型性能受限。半监督学习虽能结合少量标注数据与大量未标注数据提升性能，但现有方法仍存在三方面关键挑战：**一是与全监督模型相比鲁棒性不足，存在信息损失；二是缺乏对几何结构（如器官边界）和语义信息的显式建模，导致分割轮廓不准确；三是在有限数据下易过拟合，泛化能力弱。**

对比学习作为自监督学习的重要分支，在有限监督下学习有效表征方面展现潜力，但其在医学影像分割中尚未充分挖掘体素级几何特征与结构关系。为此，本文提出SimCVD框架，旨在通过**对比蒸馏学习**提升极少量标注数据下的体素级表征质量，解决现有方法的几何信息缺失与泛化能力问题。

## 研究现状

1. **半监督医学图像分割**
   - 主流方法：基于均值教师框架（MT）、不确定性引导、对抗学习、知识蒸馏等，如UA-MT、DTC等模型通过结合少量标注数据与大量未标注数据提升性能。
   - 对比学习应用：通过正负样本对的相似度约束学习鲁棒表征，如Chaitanya等提出的全局-局部对比学习框架。
2. **几何结构建模**
   - 部分方法引入边界信息（如带符号距离图SDM）或水平集表示，增强模型对目标轮廓的捕捉能力，如SASSNet通过边界预测提升分割精度。
3. **知识蒸馏**
   - 传统方法聚焦预测空间的概率分布匹配，近年发展至特征空间的结构化蒸馏，如通过对比不同距离图分布或蒸馏成对相似度提升表征能力。

## 提出的模型

![Snipaste_2025-12-29_17-28-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/lkQS/0X0/0343OW3SGEBvbv6XWW4ciA.webp)



### **1. 关键技术创新**

#### **（1）边界感知对比蒸馏（Boundary-Aware Contrastive Distillation）**

- **无监督对比学习**：对输入 volume 生成两个视图（通过独立 dropout 掩码实现，视为最小化数据增强），将其 SDM 与原始图像融合为边界感知特征，通过 InfoNCE 损失在 latent 空间中拉近正样本对（同一输入的不同视图）、推远负样本对（不同输入或位置），学习鲁棒的边界表示。
- **优势**：无需复杂数据增强（如局部像素打乱），仅通过 dropout 即可实现高效特征学习，避免过拟合。

#### **（2）结构化知识蒸馏（Structural Knowledge Distillation）**

- **成对相似度蒸馏（Pair-Wise Distillation）**：在编码器特征空间中，通过对比体素对之间的余弦相似度，显式建模空间结构关系，提升分割的几何一致性。
- **一致性损失（Consistency Loss）**：对无标注数据施加不同扰动（如噪声），强制学生网络与教师网络输出一致，增强模型泛化能力。

### **2. 损失函数设计**

总损失由四部分组成：

- **监督损失（Lsup）**：含分割损失（Dice+交叉熵）和 SDM 的 MSE 损失，用于标注数据训练。
- **对比损失（Lcontrast）**：基于 InfoNCE 损失，优化边界感知特征的相似度约束。
- **成对蒸馏损失（Lpd）**：蒸馏编码器特征空间中的体素对结构关系。
- **一致性损失（Lcon）**：约束扰动后输入的预测一致性。

**总损失公式**：$\mathcal{L}=\mathcal{L}_{\mathrm{sup}}+\lambda\mathcal{L}_{\mathrm{contrast}}+\beta\mathcal{L}_{\mathrm{pd}}+\gamma\:\mathcal{L}_{\mathrm{con}},$

（λ, β, γ 为平衡超参数）

## 实验（Compared with SOTA）

> 数据集

#### 1. **Left Atrium (LA) MR数据集**

- **来源**：Atrial Segmentation Challenge，包含100例3D钆增强MRI扫描，各向同性分辨率0.625×0.625×0.625 mm³。
- **划分**：80例用于训练，20例用于测试。
- **预处理**：裁剪心脏区域，强度归一化至零均值和单位方差，随机裁剪为112×112×80 mm³子体积。

#### 2. **NIH Pancreas CT数据集**

- **来源**：包含82例对比增强腹部CT扫描。
- **划分**：62例用于训练，20例用于测试。
- **预处理**：HU值截断至[-125, 275]，重采样至1.0×1.0×1.0 mm³各向同性分辨率，裁剪胰腺区域并归一化，随机裁剪为96×96×96 mm³子体积。

#### 标注比例设置

- **LA数据集**：评估20%和10%标注比例（即16例和8例标注数据）。
- **Pancreas数据集**：仅评估20%标注比例（即12例标注数据）。



> 实验细节

- **框架**：基于PyTorch实现，使用NVIDIA 1080Ti GPU训练6000迭代，批量大小为4。
- **数据增强**：随机旋转、翻转、裁剪。
- **超参数**：
  - 损失权重：α=0.1（SDM损失），λ=0.5（对比损失），β=0.1（成对蒸馏损失），γ=0.1（一致性损失），温度参数τ=0.5。
  - 优化器：SGD（动量0.9，权重衰减0.0005），初始学习率0.01，每3000迭代衰减10倍。
  - EMA更新：衰减率0.999，采用时间依赖高斯预热函数。
- **测试策略**：滑动窗口（LA步长18×18×4，Pancreas步长16×16×16），无后处理。



> 评估指标

1.  **Dice系数（Dice）**：衡量分割重叠度。
2.  **Jaccard指数（Jaccard）**：交并比。
3.  **95% Hausdorff距离（95HD）**：评估边界相似度（值越小越好）。
4.  **平均对称表面距离（ASD）**：表面点距离的平均值（值越小越好）。



> 对比实验

![Snipaste_2025-12-29_19-03-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/CUss/1095X650/7M57nfjI7mB3Yz9UwpkD5h.png)

![Snipaste_2025-12-29_19-03-57](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/HQDf/1169X425/7KqUN78PRGUUfolVESTjLy.png)

![Snipaste_2025-12-29_19-04-30](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/6Ziw/1213X518/2LAUFCtfX7n5FNPdcC3E8b.png)

SimCVD在20%标注下Dice提升0.91%，10%标注下提升2.22%，同时边界指标（95HD、ASD）显著改善，接近全监督模型性能。

## 实验（Ablation Experiments）​​

为验证SimCVD各组件的必要性，在LA数据集10%标注下进行消融：

1. **移除SDM（边界感知表示）**：Dice下降0.79%，95HD增加3.09 mm，表明几何约束对边界定位至关重要。
2. **移除对比损失（Lcontrast）**：Dice下降3.90%，证明对比学习对全局结构建模的有效性。
3. **移除成对蒸馏损失（Lpd）**：Dice下降0.92%，验证了特征空间结构知识蒸馏的作用。
4. **移除一致性损失（Lcon）**：性能无显著下降，推测对比损失已隐含一致性约束。

### 七、关键发现

1. **Dropout的作用**：仅使用两个独立Dropout掩码作为“最小数据增强”，即可实现优于传统复杂增强的性能，避免表示崩溃。
2. **边界感知表示**：通过SDM和对比损失学习的边界特征，显著提升分割精度和边界平滑度。
3. **少标注鲁棒性**：在10%标注比例下仍能稳定优于现有方法，证明其在临床数据稀缺场景的实用性。

![Snipaste_2025-12-29_19-05-07](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/pQ1C/1162X293/07BfOx9hJKWOizJTqJUuFb.png)

![Snipaste_2025-12-29_19-05-11](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/pZuv/620X289/4pphhpA7ondvIzSAp0NxlG.png)

## 结论

SimCVD通过简洁有效的对比蒸馏机制，在极少标注数据条件下实现了医学图像分割性能的突破，为下游任务（如医学图像合成、增强和配准）提供了通用框架。未来计划将该方法扩展至多类别医学图像分割任务。



