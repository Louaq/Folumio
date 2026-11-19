---
title: Multi-consistency for semi-supervised medical image segmentation via diffusion models
published: 2025-12-23 19:47:00
expires: 2025-21-31 23:59:59
description: "医学图像分割提出了一个巨大的挑战"
category: 半监督医学图像分割
tags: [扩散模型]
---

:::note
相对于上一篇简单一点，容易理解
:::


::github{repo="yunzhuC/MCSD"}

## 摘要

Medical image segmentation presents a formidable challenge, compounded by the scarcity of annotated data in numerous datasets. Semi-supervised methods offer viable solutions to mitigate that, while the image generation capability of diffusion models has shown potential in capturing semantically meaningful information. This paper introduces Multi-Consistency for semi-supervised medical image Segmentation via Diffusion Models (MCSD). We propose a Diffusion-based Feature-guided Module (DFM) that extracts features from pre-trained diffusion models and uses multi-scale features to guide multi-consistency segmentation networks. Additionally, we introduce the Dual-branch Image Consistency (DIC) strategy, which performs multi-consistency learning by generating two independent strong augmented images and optimizing the network by encouraging consistency between strong and weak inputs at multiple levels of features and images. Our method outperforms current approaches, demonstrating its effectiveness in semi-supervised medical image segmentation through experimental results for various labeled data ratios. Furthermore, this work points out the potentiality of diffusion models in semi-supervised medical image segmentation and offers suggestions for improving their use in medical imaging tasks. The code is available at https://github.com/yunzhuC/MCSD

## 翻译

医学图像分割提出了一个巨大的挑战，加上在众多数据集中缺乏带注释的数据。半监督方法为缓解这一问题提供了可行的解决方案，而扩散模型的图像生成能力在捕获语义上有意义的信息方面显示出了潜力。介绍了基于扩散模型的半监督医学图像分割的多一致性算法。我们提出了一种基于扩散的特征引导模块(DFM)，该模块从预训练的扩散模型中提取特征，并使用多尺度特征来指导多一致性分割网络。此外，我们引入了双分支图像一致性(Dual-branch Image Consistency, DIC)策略，该策略通过生成两个独立的强增强图像来执行多一致性学习，并通过在多个级别的特征和图像上鼓励强弱输入之间的一致性来优化网络。我们的方法优于目前的方法，通过对各种标记数据比率的实验结果证明了其在半监督医学图像分割中的有效性。此外，本工作指出了扩散模型在半监督医学图像分割中的潜力，并提出了改进其在医学成像任务中的应用的建议。代码在https://github.com/yunzhuC/MCSD

## 研究背景

医学图像分割在临床诊断中至关重要，但标注数据稀缺严重制约其发展。半监督学习通过结合少量标注数据与大量未标注数据缓解该问题，其中一致性正则化方法通过对输入施加扰动来增强模型鲁棒性，但现有方法多局限于图像级扰动，未充分挖掘多尺度特征信息。扩散模型作为先进生成模型，能捕获丰富语义信息并已成功应用于医学影像生成、重建等任务，但其在半监督分割中的潜力尚未完全释放。现有研究多使用固定尺度扩散特征，忽略了多尺度任务特异性语义，且未实现图像与特征层面的多一致性学习。因此，本文提出基于扩散模型的多一致性半监督分割方法（MCSD），旨在通过多尺度扩散特征引导和双分支图像一致性策略，突破传统扰动限制，提升模型在有限标注数据下的分割性能。

## 研究现状

#### 1. **主流方法分类**

- **自训练方法**：通过预训练网络为未标注数据生成伪标签（如基于置信度阈值筛选高质量伪标签），迭代更新网络与伪标签。但伪标签质量波动可能导致性能下降。
- **一致性正则化方法**：通过对输入施加扰动（模型扰动或数据扰动），鼓励网络输出一致预测。主流策略包括多视图一致性（如多尺度裁剪、随机强度变换）和跨模型一致性（如教师-学生模型），但现有方法多局限于图像级扰动，忽略了特征级别的多一致性挖掘。

#### 2. **扩散模型的应用潜力**

扩散模型（如DDPM）因生成高质量图像的能力，被证实可捕捉语义信息，已应用于医学图像合成、重建、异常检测等任务。近年研究尝试将其用于判别性任务：

- **特征提取**：从扩散模型U-Net中间层提取潜在特征，用于训练分类器或分割网络（如Baranchuk等利用扩散特征训练像素分类器）。
- **多尺度特征利用**：现有研究多采用固定时间步或单一层级特征，未充分利用扩散模型在不同尺度下的任务特异性语义信息。

#### **3. 现有方法局限性**

- **扰动空间有限**：多数方法仅在图像层面施加扰动（如裁剪、颜色变换），未探索特征级或跨层级的扰动组合。
- **扩散模型利用不足**：对扩散模型的特征挖掘多停留在单一层级或时间步，未整合多尺度、多时间步的语义信息。

![Snipaste_2025-12-23_20-30-47](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/vhqb/0X0/0343OVTi9LsTe6so4x3eMm.webp)

![Snipaste_2025-12-23_20-30-52](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/xsMQ/386X83/2KdSqshXvp6ONpaRxPctT2.png)

![Snipaste_2025-12-23_20-30-58](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/jKU2/437X53/2FLiX97plBJ4LJ8TnWP9ji.png)

## 提出的模型

![Snipaste_2025-12-23_20-32-34](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/FwPL/858X564/72CPnJyoNDsHqu2xfuVM3m.png)



### **1. 扩散特征引导模块（Diffusion-based Feature-guided Module, DFM）**

- **功能**：从预训练扩散模型中提取多尺度语义特征，用于引导分割网络学习。
- **实现**：
  1. 在无标签数据上预训练扩散模型（如DDPM），利用其反向去噪过程中的U-Net解码器提取不同时间步（如50、150、250步）和不同网络块（如第2、4、6块）的中间特征。
  2. 通过特征拼接和2D卷积降维（最终维度30），得到多尺度特征图，作为分割网络的额外输入流，增强特征级一致性约束。

### **2. 双分支图像一致性策略（Dual-branch Image Consistency, DIC）**

- **功能**：通过图像级扰动增强数据多样性，鼓励模型对不同扰动输入产生一致预测。
- **实现**：
  1. 对同一张无标签图像生成弱扰动（如裁剪）和两种独立强扰动（如颜色抖动、随机翻转），结合CutMix掩码混合生成新样本。
  2. 引入随机网络 dropout 增加模型噪声，提升泛化能力。

### **3. 多一致性损失函数（Multi-consistency Loss）**

- **总损失**：结合有监督损失（交叉熵损失）和无监督损失（特征级+图像级一致性损失）：
  - **有监督损失**：监督标签数据的分割精度。
  - **特征级一致性损失**：约束弱扰动输入的伪标签与扩散特征引导的分割结果一致性。
  - **图像级一致性损失**：约束弱扰动输入的伪标签与双分支强扰动样本的分割结果一致性。

### **核心创新**

- **跨层级一致性约束**：首次将扩散模型的多尺度特征与图像级扰动结合，实现特征-图像双层级一致性学习，突破传统仅图像级扰动的局限。
- **高效利用无标签数据**：通过扩散模型提取的语义特征和双分支扰动策略，在有限标签数据（如5%、10%）下仍能保持高精度分割。

## 实验（Compared with SOTA）

1. **数据集**
   - **ACDC数据集**：含100例心脏MRI影像，分割目标为右心室（RV）、左心室（LV）和心肌（MYO），按70:10:20划分训练/验证/测试集，分别采用5%（3例）、10%（7例）、20%（14例）标注数据比例进行实验。
   - **M&Ms数据集**：含320例多中心心脏MRI影像，来自6个临床中心和4种扫描仪，分割目标为左心室和心肌，按7:2:1划分训练/验证/测试集，采用3%（5例）、5%（10例）标注数据比例。

2. **基线方法**
   对比6种半监督分割方法：
- 一致性正则化方法：UA-MT、URPC、CPS
- 协同训练方法：CNN & Trans、MC-Net+、BCP

![Snipaste_2025-12-23_20-37-04](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/qEbc/484X254/4oL2O1fNYyUD4zZgVno2H6.png)



![Snipaste_2025-12-23_20-37-28](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Wcy3/1047X714/5cEv4dw7Wuv3L62wuJ58vB.png)

![Snipaste_2025-12-23_20-37-42](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Cfem/1216X533/67LkiIg2pcvHOL0Ssa2C7r.png)



- **优势**：在多中心、多设备数据上，MCSD的Dice比最佳基线SC-SSL提升1.3%-1.9%，验证了其泛化能力。



## 实验（Ablation Experiments）​​

![Snipaste_2025-12-23_20-38-40](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5VE5/647X207/2OEofn0fz3TjvoHY1uLVS4.png)

![Snipaste_2025-12-23_20-38-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/jNKq/658X256/6L12b2Oen8OvnPL2dJV1Mi.png)



- DFM（扩散特征引导模块）提升特征级一致性，Dice提升13.3%；
- DIC（双分支图像一致性策略）增强图像级扰动鲁棒性，Dice提升17.4%；
- 两者结合实现最优性能，验证多尺度一致性设计的有效性。





## 参数敏感性分析

![Snipaste_2025-12-23_20-39-43](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/vfFk/668X255/0Z4fmz9JdX5JNycDTxeYQc.png)



![Snipaste_2025-12-23_20-39-50](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/D4qW/675X341/1390W2bRjhVtRjw12u7haJ.png)



1. **扩散模型特征提取**（表6、7）
   - **U-Net块选择**：解码器第2、4、6块特征最优（Dice=89.98%），浅层特征包含更丰富的语义信息。
   - **时间步选择**：反向扩散过程的50、150、250步特征最优（95HD=1.25），平衡噪声与语义细节。
2. **特征维度与置信阈值**（表8、图5）
   - 特征维度降至30时性能最优（Dice=89.98%），兼顾计算效率与表征能力；
   - 置信阈值τ=0.9时过滤不可靠伪标签，模型稳定性最佳。

## 结论

本文提出了一种基于扩散模型的多一致性半监督医学图像分割模型（MCSD），主要结论如下：

1. **方法创新**：
   - 提出扩散特征引导模块（DFM），从预训练扩散模型中提取多尺度特征，用于指导多一致性分割网络
   - 设计双分支图像一致性（DIC）策略，通过生成两个独立的强增强图像，在特征和图像多个层级上优化网络一致性
2. **核心贡献**：
   - 突破传统仅依赖图像级扰动的局限，实现图像-特征多层级一致性正则化
   - 利用扩散模型捕获医学图像内在层次结构，通过多尺度特征拼接提供丰富语义信息
   - 引入CutMix数据增强技术创建新训练样本，增强模型对数据分布的理解能力
3. **实验验证**：
   - 在ACDC和M&Ms两个 cardiac MRI 数据集上，以5%-20%标记数据比例，超越UA-MT、URPC、CPS等6种前沿方法
   - 10%标记数据下，ACDC数据集Dice系数达89.98%（较BCP提升1.25%），95HD降至1.25 voxels
   - M&Ms多中心数据集上，3%标记数据时Dice达82.72%，验证模型对数据分布差异的鲁棒性
4. **方法有效性**：
   - 消融实验表明DFM和DIC模块分别贡献2.51%和4.08%的Dice提升
   - 扩散特征维度优化实验确定30维为最优特征维度，平衡模型性能与计算开销
   - 时间步和U-Net块选择分析显示，50/150/250步和2/4/6块组合能提取最有效语义特征
5. **应用价值**：
   - 为医学影像领域提供了利用扩散模型进行判别式任务的新范式
   - 在标注数据稀缺场景下仍保持高性能，降低临床数据标注成本
   - 对多中心、多设备医学影像具有良好适应性，为跨机构协作研究提供技术支持

研究局限性在于扩散模型的时间步和网络层选择等设计参数需针对不同分割任务优化，未来将拓展至脑结构和肿瘤分割等更具挑战性的场景。
