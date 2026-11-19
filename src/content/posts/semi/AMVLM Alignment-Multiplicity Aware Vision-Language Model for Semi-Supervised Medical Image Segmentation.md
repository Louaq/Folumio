---
title: AMVLM Alignment-Multiplicity Aware Vision-Language Model for Semi-Supervised Medical Image Segmentation
published: 2025-12-19 15:38:00
expires: 2025-12-31 23:59:59
mathjax: true
description: "在半监督医学图像分割（SSMIS）中"
category: 文本引导半监督医学图像分割
tags: [TMI]
---

:::note
本文的角度新颖，可以作为一种思路，但是论文中有部分笔误的地方，如下所示：
:::


::github{repo="QingtaoPan/AMVLM"}

## 摘要

Low-quality pseudo labels pose a significant obstacle in semi-supervised medical image segmentation (SSMIS), impeding consistency learning on unlabeled data. Leveraging vision-language model (VLM) holds promise in ameliorating pseudo label quality by employing textual prompts to delineate segmentation regions, but it faces the challenge of cross-modal alignment uncertainty due to multiple correspondences (multiple images/texts tend to correspond to one text/image). Existing VLMs address this challenge by modeling semantics as distributions but such distributions lead to semantic degradation. To address these problems, we propose Alignment-Multiplicity Aware Vision-Language Model (AMVLM), a new VLM pretraining paradigm with two novel similarity metric strategies. (i) Cross-modal Similarity Supervision (CSS) proposes a probability distribution transformer to supervise similarity scores across fine-granularity semantics through measuring cross-modal distribution disparities, thus learning cross-modal multiple alignments. (ii) Intra-modal Contrastive Learning (ICL) takes into account the similarity metric of coarse-fine granularity information within each modality to encourage cross-modal semantic consistency. Furthermore, using the pretrained AMVLM, we propose a pioneering text-guided SSMIS network to compensate for the quality deficiencies of pseudo-labels. This network incorporates a text mask generator to produce multimodal supervision information, enhancing pseudo label quality and the model’s consistency learning. Extensive experimentation validates the efficacy of our AMVLM-driven SSMIS, showcasing superior performance across four publicly available datasets. The code will be available at: https://github.com/QingtaoPan/AMVLM

## 翻译

在半监督医学图像分割（SSMIS）中，低质量伪标签构成了显著障碍，阻碍了未标记数据上的一致性学习。利用视觉-语言模型（VLM）有望通过文本提示来描绘分割区域，从而改善伪标签质量，但由于多重对应关系（多张图像/文本往往对应单一文本/图像），该方法面临跨模态对齐不确定性的挑战。现有VLM通过将语义建模为分布来解决这一问题，但此类分布会导致语义退化。为应对这些问题，我们提出Alignment-Multiplicity Aware Vision-Language Model（AMVLM），这是一种全新的VLM预训练范式，包含两种新颖的相似性度量策略。（i）跨模态相似性监督（CSS）提出概率分布变换器，通过测量跨模态分布差异来监督细粒度语义的相似性分数，从而学习跨模态多重对齐。（ii）模态内对比学习（ICL）考虑每种模态内粗粒度-细粒度信息的相似性度量，以促进跨模态语义一致性。此外，利用预训练的AMVLM，我们提出一种开创性的文本引导SSMIS网络，以弥补伪标签的质量缺陷。该网络集成文本掩码生成器，生成多模态监督信息，提升伪标签质量及模型的一致性学习能力。大量实验验证了AMVLM驱动的SSMIS的有效性，在四个公开数据集上展现出卓越性能。代码将在以下地址公开：https://github.com/QingtaoPan/AMVLM

## 研究背景

半监督医学图像分割（SSMIS）中，伪标签质量低下严重阻碍无标记数据的一致性学习。现有方法通过一致性正则化和交叉监督生成伪标签，但常因伪标签质量差导致模型学习错误特征。视觉语言模型（VLM）虽能利用文本提示描述分割区域以改善伪标签质量，但面临跨模态对齐不确定性问题——多图/文本可能对应同一文本/图像。现有VLM通过分布建模处理该问题，却因语义退化削弱跨模态语义关联。为此，本文提出对齐多样性感知视觉语言模型（AMVLM），通过新的相似度度量策略解决上述挑战，同时构建文本引导的SSMIS网络以补偿伪标签质量缺陷。

![Snipaste_2025-12-19_19-46-36](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/sDhb/0X0/0343OUEPvavr2XWjeBOYWY.webp)

## 研究现状

1. **半监督医学图像分割（SSMIS）**
   - 主流方法依赖一致性正则化（如Mean Teacher）和伪标签技术，但低质量伪标签导致模型学习错误特征，限制无标记数据利用效率。
   - 近年结合视觉语言模型（VLM）通过文本提示增强伪标签质量，但现有VLM仅建模图像-文本一对一映射，忽略多对应关系导致的跨模态对齐不确定性。
2. **视觉语言模型（VLM）**
   - 自然图像领域通过对比学习（如CLIP）实现跨模态对齐；医学领域扩展模型（如MedCLIP、MGCA）利用影像-报告对提升任务性能，但未解决多对应关系问题。
   - 分布建模方法（如MAP）尝试学习多对齐，但因语义信息在分布转换中丢失导致语义退化。

## 提出的模型

![Snipaste_2025-12-19_19-48-09](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/iALX/1227X532/7gmdYxOXnCCgtzZlx5i0CT.png)

#### **1. 核心目标**

解决半监督医学图像分割（SSMIS）中伪标签质量低的问题，通过视觉语言模型（VLM）引入文本提示增强伪标签质量，同时克服跨模态对齐不确定性（即多图像/文本对应单文本/图像的多对一问题）。

#### **2. 模型创新点**

AMVLM是一种新的VLM预训练范式，包含两种关键相似性度量策略：

##### **(1) 跨模态相似性监督（Cross-modal Similarity Supervision, CSS）**

- **动机**：现有VLM多采用一对一语义对齐，忽略多对一的对齐不确定性；而基于分布的方法（如将语义建模为分布）会导致语义退化（丢失细粒度语义）。
- **方法**：
  - 提出**概率分布Transformer（Probability Distribution Transformer, PDT）**，通过测量跨模态分布差异（如2-Wasserstein距离）来监督细粒度语义（图像 patch 与文本 word）的相似性分数，从而学习多对齐关系。
  - 优势：在保留语义信息的同时，避免直接分布对齐导致的语义退化。

##### **(2) 模态内对比学习（Intra-modal Contrastive Learning, ICL）**

- **动机**：仅进行跨模态对比忽略模态内结构信息，可能导致模型依赖无关噪声特征。
- **方法**：
  - 在单模态内（图像/文本）进行粗-细粒度信息的对比学习（如图像CLS token与patch token的对比），增强跨模态语义一致性。

#### **3. 文本引导的半监督分割网络**

利用预训练的AMVLM构建文本引导的SSMIS网络，具体包括：

- **文本掩码生成器（Text Mask Generator）**：结合文本提示和密集图像嵌入生成多模态监督信息（文本引导掩码），用于补偿伪标签质量缺陷。
- **优化目标**：
  - 结合监督损失（标记数据）、半监督损失（未标记数据的伪标签、文本引导掩码及融合掩码），提升模型的一致性学习能力。

## 实验（Compared with SOTA）

### 数据集

1. **QaTa-COV19**
   - 9258张COVID-19胸部X光片，用于肺部感染区域分割，图像尺寸224×224。
   - 划分：7145张训练，2113张测试，包含文本标注。
2. **BM-Seg**
   - 23例CT扫描的1517个切片，用于骨转移分割，图像尺寸224×224。
   - 划分：200张训练，70张测试，文本由专业人员标注。
3. **MoNuSeg**
   - 44张细胞核实例分割图像，尺寸1000×1000（ resize至224×224）。
   - 划分：30张训练，14张测试。
4. **MRSpineSeg**
   - 215张T2加权MRI图像（2712个切片），用于多类别脊柱结构分割，包含20个类别（19个脊柱结构+背景）。

### 对比方法

- **优势**：AMVLM在所有数据集上优于传统半监督方法（如MT）和SAM基方法（如SemiSAM），平均Dice提升2.57%-4.46%。
- **对比VLM**：优于MAP（分布建模方法）1.97%（Dice），证明其在避免语义退化的同时学习多模态对齐。

![Snipaste_2025-12-19_19-52-36](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/mW6o/1237X464/5pvGnITQPrgX9xZsH5ntLM.png)

### 定量实验结果概括

- **优势**：AMVLM在所有数据集上优于传统半监督方法（如MT）和SAM基方法（如SemiSAM），平均Dice提升2.57%-4.46%。
- **对比VLM**：优于MAP（分布建模方法）1.97%（Dice），证明其在避免语义退化的同时学习多模态对齐。



### 定性实验结果概括

![Snipaste_2025-12-19_19-53-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wBtI/999X738/4lw8d4ZgwJ6up7p4fr43CB.png)

![Snipaste_2025-12-19_19-54-03](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/NA2U/556X779/5EBRWWvKxktFy5pseqySf0.png)

- **伪标签质量**：AMVLM生成的伪标签边缘更清晰，与真实标签重叠度更高（图6）。
- **注意力激活**：通过AblationCAM可视化，AMVLM对病变区域的注意力更精准，减少无关区域激活（图8）。



## 实验（Ablation Experiments）​​

验证核心模块（CSS、ICL、Ltg）的贡献（25%标注数据，以QaTa-COV19为例）：

![Snipaste_2025-12-19_19-55-17](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/pama/954X199/60NA6x3JwDxMIuITdoHeHr.png)

- **CSS**：通过分布差异监督跨模态相似度，提升最显著。
- **ICL**：模态内粗-细粒度对比学习，增强语义一致性。
- **Ltg**：文本引导损失，抑制无关区域掩码生成。



## 少样本分割实验

![Snipaste_2025-12-19_19-56-47](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/nwBB/1245X253/28s6mI3slypLa7GeD8tQUa.png)

AMVLM在少样本场景下优于现有VLM方法，证明其预训练范式的高效性。



## 不确定性和统计分析

该研究在半监督医学图像分割（SSMIS）领域开展了系统性实验，主要包括以下内容：

### **一、数据集**

1. **QaTa-COV19**
   - 9258张COVID-19胸部X光片，用于肺部感染区域分割，图像尺寸224×224。
   - 划分：7145张训练，2113张测试，包含文本标注。
2. **BM-Seg**
   - 23例CT扫描的1517个切片，用于骨转移分割，图像尺寸224×224。
   - 划分：200张训练，70张测试，文本由专业人员标注。
3. **MoNuSeg**
   - 44张细胞核实例分割图像，尺寸1000×1000（ resize至224×224）。
   - 划分：30张训练，14张测试。
4. **MRSpineSeg**
   - 215张T2加权MRI图像（2712个切片），用于多类别脊柱结构分割，包含20个类别（19个脊柱结构+背景）。

### **二、实验设计与方法对比**

#### **1. 对比方法**

- **半监督分割方法**：U-Net（全监督）、Mean Teacher（MT）、CCT、BCP、UCMT等。
- **SAM基方法**：SemiSAM、KnowSAM、CPC-SAM（利用SAM生成伪标签）。
- **视觉语言模型（VLM）**：CLIP、MedCLIP、MGCA、MAP、CMITM、ASG等。

#### **2. 评估指标**

- **Dice系数**：衡量分割区域重叠度。
- **mIoU**：平均交并比，评估像素级分类精度。

### **三、核心实验结果**

#### **1. 定量结果（25%标注数据）**

| 数据集     | 方法  | Dice（%） | mIoU（%） |
| ---------- | ----- | --------- | --------- |
| QaTa-COV19 | AMVLM | **80.62** | **69.87** |
| BM-Seg     | AMVLM | **73.52** | **63.24** |
| MoNuSeg    | AMVLM | **76.63** | **67.15** |
| MRSpineSeg | AMVLM | **80.63** | **71.39** |

- **优势**：AMVLM在所有数据集上优于传统半监督方法（如MT）和SAM基方法（如SemiSAM），平均Dice提升2.57%-4.46%。
- **对比VLM**：优于MAP（分布建模方法）1.97%（Dice），证明其在避免语义退化的同时学习多模态对齐。

#### **2. 定性结果**

- **伪标签质量**：AMVLM生成的伪标签边缘更清晰，与真实标签重叠度更高（图6）。
- **注意力激活**：通过AblationCAM可视化，AMVLM对病变区域的注意力更精准，减少无关区域激活（图8）。

### **四、消融实验**

验证核心模块（CSS、ICL、Ltg）的贡献（25%标注数据，以QaTa-COV19为例）：

| 方法              | Dice（%） | 提升（%） |
| ----------------- | --------- | --------- |
| 基线（MT+VLM）    | 76.75     | -         |
| + CSS             | 78.94     | **+2.19** |
| + CSS + ICL       | 79.32     | **+0.38** |
| + CSS + ICL + Ltg | **80.62** | **+1.30** |

- **CSS**：通过分布差异监督跨模态相似度，提升最显著。
- **ICL**：模态内粗-细粒度对比学习，增强语义一致性。
- **Ltg**：文本引导损失，抑制无关区域掩码生成。

### **五、少样本分割实验**

在1%和10%标注数据下验证AMVLM的泛化能力：

| 数据集     | 标注率 | AMVLM Dice（%） | 最佳对比方法（MAP） |
| ---------- | ------ | --------------- | ------------------- |
| QaTa-COV19 | 1%     | 62.21           | 58.43               |
| QaTa-COV19 | 10%    | 68.65           | 65.10               |
| MRSpineSeg | 1%     | 27.36           | 24.52               |

- **优势**：AMVLM在少样本场景下优于现有VLM方法，证明其预训练范式的高效性。

### **六、不确定性与统计分析**

1. **对齐不确定性**：AMVLM对语义模糊的图像/文本对表现出更稳定的余弦相似度（图7），验证其处理多模态对齐不确定性的能力。
2. **统计显著性**：通过t检验（p<0.05），AMVLM与对比方法的性能差异具有统计学意义（表VI）。

![Snipaste_2025-12-19_19-57-52](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/TwRg/1139X411/1NeZ5eWinO8YDzmGp9O97c.png)



![Snipaste_2025-12-19_19-58-18](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/T1On/586X436/3qRMuEBeOTM1zn7NkRrvzz.png)

## 结论

本研究提出了一种创新的视觉语言模型预训练范式：AMVLM，该模型通过两种新颖的相似度度量策略（跨模态相似度监督CSS和模态内对比学习ICL）有效解决了跨模态对齐不确定性问题，增强了跨模态表示的多重对应关系学习。在此基础上，构建了文本引导的半监督医学图像分割（SSMIS）框架，通过文本掩码生成器产生多模态监督信息，显著提升了伪标签质量和模型的一致性学习能力。在四个公开医学影像数据集（QaTa-COV19、BM-Seg、MoNuSeg、MRSpineSeg）上的实验表明，该方法在半监督分割任务中性能优于现有半监督学习方法和视觉语言模型驱动的分割方法，且在少样本分割任务中展现出强大的泛化能力。统计分析和不确定性分析验证了方法的有效性和稳定性，为视觉语言模型和半监督医学图像分割领域提供了新的解决方案。





