---
title: Boosting Semi-Supervised Medical Image Segmentation Through Inter-Instance Information Complementarity
published: 2026-01-29 13:26:00
expires: 2026-05-31 23:59:59
description: "专家标注数据的获取仍然是医学图像分割的关键瓶颈"
category: 半监督医学图像分割
tags: [TNNLS]
---


:::note
主要思想：不同实例间的解剖结构具有相似性
:::

::github{repo="shuaiaihang/shuaiAIMedcalLab"}


## 摘要

The acquisition of expert-annotated data remains a critical bottleneck for medical image segmentation, thereby constraining the clinical applicability of highly accurate models. Crucially, despite this scarcity of labeled data, the intrinsic homogeneity in human anatomy across the cohort provides a fundamental basis (or: a promising leverage point) for enhancing model generalization and training efficiency by exploiting interinstance anatomical complementarity. In this study, we propose a novel semi-supervised approach for medical image segmentation that fully exploits this inter-instance complementarity. The proposed model operates at two levels, integrating a sophisticated **copy-paste augmentation module (CPAM)** and a **trainable region calibration mechanism (TRCM)** within the simple mean teacher (MT) framework. Specifically, CPAM is a carefully designed copy-paste strategy that facilitates the exchange of informative regions between samples, thereby enhancing the diversity and robustness of the training data. TRCM leverages the predictions from labeled regions to guide and calibrate the trainable regions in unlabeled data. The calibrated regions typically yield highquality pseudo-labels, which effectively improve model training. CPAM and TRCM work synergistically, complementing each other to enhance model performance. Experiments on diverse medical image datasets—including LA, ACDC, BraTS2019, and Pancreas-NIH—covering both MRI and CT modalities demonstrate the robust efficacy of our proposed model. In settings with limited annotated data, the model consistently outperforms current state-of-the-art methods across multiple evaluation metrics. The code is available at https://github.com/shuaiaihang/shuaiAIMedcalLab

## 翻译

专家标注数据的获取仍然是医学图像分割的关键瓶颈，从而限制了高精度模型的临床适用性。至关重要的是，尽管标记数据稀缺，但整个队列中人体解剖学的内在同质性为利用实例间解剖互补性提高模型泛化和训练效率提供了基本基础(或:有前途的杠杆点)。在本研究中，我们提出了一种新的半监督医学图像分割方法，充分利用了这种实例间互补性。该模型在两个层面上运行，在简单平均教师(MT)框架内集成了复杂的复制-粘贴增强模块(CPAM)和可训练区域校准机制(TRCM)。具体来说，CPAM是一种精心设计的复制-粘贴策略，促进了样本之间信息区域的交换，从而增强了训练数据的多样性和鲁棒性。TRCM利用标记区域的预测来指导和校准未标记数据中的可训练区域。校准后的区域通常会产生高质量的伪标签，从而有效地提高模型训练。CPAM和TRCM协同工作，相互补充，提高模型性能。在涵盖MRI和CT模态的不同医学图像数据集(包括LA、ACDC、BraTS2019和pancreatic - nih)上的实验证明了我们提出的模型的具有鲁棒性的功效。在具有有限注释数据的设置中，该模型在多个评估指标上始终优于当前最先进的方法。该代码可在https://github.com/shuaiaihang/shuaimedcallab

## 研究背景

医学图像分割在精准医疗中至关重要，但高质量标注数据的稀缺严重限制了深度学习模型的临床应用。尽管标注数据有限，人类解剖结构在群体中的内在同质性为利用实例间解剖互补性提升模型泛化能力和训练效率提供了基础。现有半监督分割方法（如伪标签和均值教师框架）虽有进展，但存在不足：一是现有复制粘贴策略局限于有标签-无标签数据交互，未充分利用实例间互补信息；二是缺乏对区域级不确定性的考量，影响半监督分割的语义一致性。因此，如何充分挖掘实例间信息互补性以提升半监督医学图像分割性能，成为本文研究的核心问题。

![Snipaste_2026-01-29_14-26-51](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Ob3o/0X0/0343OULe99KiBm67pqdRQn.webp)

## 研究现状

1. **半监督医学图像分割（SSMIS）**：主流方法基于伪标签和一致性正则化，如均值教师（MT）框架，通过未标记数据增强模型泛化能力。
2. **数据增强策略**：Copy-paste类方法（如BCP）通过跨样本区域交换缓解标签-无标签数据分布差异，但局限于标签-无标签交互。
3. **自监督学习**：对比学习通过实例判别优化特征表示，但存在类碰撞问题（语义相似区域被错误区分为不同类）。

## 提出的模型

![Snipaste_2026-01-29_14-30-27](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5DgY/1126X831/36Jxpn4r959RAKrvsxnHWi.png)

### **1. 模型核心设计**

#### **（1）复制粘贴增强模块（CPAM）**

- **功能**：通过在不同样本间交换信息区域，增强训练数据的多样性和鲁棒性。
- **实现方式**：
  对批次中的标记数据（Labeled）和未标记数据（Unlabeled）进行三类复制粘贴操作：
  - 标记数据内部（Labeled–Labeled）
  - 未标记数据内部（Unlabeled–Unlabeled）
  - 标记与未标记数据之间（Labeled–Unlabeled）
    生成混合图像，确保混合图像共享相同的标记区域，以维持跨样本一致性。

#### **（2）可训练区域校准机制（TRCM）**

- **功能**：利用标记数据的预测结果，校准未标记数据中的高置信度区域，生成高质量伪标签以指导模型训练。
- **实现方式**：
  通过比较混合图像预测结果与真实标签，识别标记区域中预测一致正确的“可靠区域”，并将其扩展到未标记数据，仅在这些区域进行训练，减少噪声伪标签的干扰。

### **2. 模型框架**

- **基础架构**：基于均值教师（MT）框架，包含学生网络和教师网络，学生网络通过梯度反向传播优化，教师网络通过指数移动平均（EMA）更新。
- **数据流程**：
  1. CPAM生成混合图像，输入学生网络得到预测结果；
  2. 教师网络对未标记图像生成伪标签；
  3. 损失函数分为标记区域损失（交叉熵+Dice损失）和未标记区域损失（伪标签监督）；
  4. TRCM通过校准未标记区域的训练掩码，优化未标记数据的学习信号。

![Snipaste_2026-01-29_14-31-56](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/yBAA/609X306/5OZtQYchRctPWScDSocc2w.png)

## 实验（Compared with SOTA）

> 数据集：
>
> 1. **LA数据集**
>    - 100例3D心脏MRI扫描，需分割左心房（LA）。
>    - 实验设置：5%和10%的标记数据比例，评估模型在极少量标注下的性能。
> 2. **ACDC数据集**
>    - 100例心脏MRI扫描，标注右心室、左心室、心肌共3类结构。
>    - 实验设置：5%、10%、20%标记数据比例，验证模型对不同标注量的适应性。
> 3. **BraTS2019数据集**
>    - 250例多模态脑肿瘤MRI（T1、T1增强、T2、FLAIR序列），需分割肿瘤亚区域（增强肿瘤、肿瘤核心、全肿瘤）。
>    - 实验设置：10%标记数据，测试模型对复杂病理结构的分割能力。
> 4. **Pancreas-NIH数据集**
>    - 82例腹部CT扫描，需分割胰腺（因形状多变、边界模糊，分割难度大）。
>    - 实验设置：20%标记数据，与现有方法在常见设置下对比。



> 评估指标：
>
> - **Dice系数（Dice）**：衡量预测与金标准的重叠度（越高越好）。
> - **Jaccard指数（Jaccard）**：即交并比（IoU），反映区域匹配精度（越高越好）。
> - **95%豪斯多夫距离（95HD）**：评估边界最大误差（越低越好）。
> - **平均表面距离（ASD）**：评估边界平均误差（越低越好）。



- **LA数据集**（5%标记数据）：Our-All（CPAM+TRCM）的Dice达89.2%，Jaccard达81.5%，95HD和ASD分别降低至10.3和1.2 voxels，显著优于BCP、DTC等方法。
- **ACDC数据集**（5%标记数据）：Our-All的Dice（85.7%）、Jaccard（75.3%）均为最优，且边界误差（95HD=8.6 voxels）最小，证明对多类别结构的分割能力。
- **BraTS2019数据集**（10%标记数据）：Our-All的Dice（85.48%）和Jaccard（76.21%）超越BCP和MLRP，尤其对肿瘤亚区域分割精度提升明显。
- **Pancreas-NIH数据集**（20%标记数据）：CPAM单独使用已显著提升性能（Dice=78.3%），TRCM因伪标签质量较高增益有限，但整体仍优于对比方法。

![Snipaste_2026-01-29_14-34-37](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/gYnf/601X574/7bktnb8jrcZwEWr48crw7D.png)

![Snipaste_2026-01-29_14-34-45](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/cZQ4/602X750/0oV5vSBaiuY4si6wnziGwJ.png)



## 实验（Ablation Experiments）​​



- **CPAM的有效性**：标记-标记（L-L）和未标记-未标记（U-U）的复制粘贴操作比仅标记-未标记（U-L）交换更有效，Dice提升2.1%~3.5%。
- **TRCM的作用**：在标记数据稀缺时（如LA的5%标记），TRCM通过校准高置信区域，使Dice提升1.8%；标记数据充足时（如Pancreas的20%标记），增益减弱。
- **参数γ**：γ=0.5时平衡标记与未标记数据损失，性能最优。

![Snipaste_2026-01-29_14-35-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/vfkf/619X417/2s9twZBYKiqcX73HnQo79A.png)

![Snipaste_2026-01-29_14-35-23](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/3QTC/608X320/1GQG4ZjrAd2egL84bXeXNe.png)

![Snipaste_2026-01-29_14-35-29](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/C6Ak/601X339/2nxXKZRQCy3GYqVVJaozJ8.png)





## 结论

针对半监督医学图像分割任务，本文的核心研究目标是在标注数据有限的情况下优化模型训练。由于人体解剖结构具有内在同质性，不同样本的医学图像存在显著结构相似性，因此充分利用样本间的互补信息成为提升半监督模型训练效果的关键策略。

本文提出了**复制粘贴增强模块（CPAM）** 和**可训练区域校准机制（TRCM）** 以实现这一目标：

1. **CPAM** 通过在不同样本间进行区域交换（包括有标签-无标签、有标签-有标签、无标签-无标签数据间的交互），系统性地利用样本间信息互补性，增强训练数据的多样性和模型鲁棒性。
2. **TRCM** 利用有标签数据的预测信息校准无标签数据的可训练区域，筛选出高质量伪标签区域进行训练，进一步深化对样本间互补信息的利用。

在LA、ACDC、BraTS2019和Pancreas-NIH四个公共数据集上的实验表明，该模型在标注数据稀缺的情况下（如5%或10%标签比例），在Dice、Jaccard、95% Hausdorff距离和平均表面距离等指标上均显著优于现有半监督医学图像分割方法，验证了其有效性和优越性。



:::note
所提出的CPAM和TRCM模块提高了半监督分割性能，但不可避免地引入了**额外的计算开销**，这是由于混合图像的生成以及在训练过程中计算和应用区域智能校准。为了缓解这一问题，未来的工作将首先研究渐进式训练策略，从低分辨率或部分区域训练开始，逐渐扩大规模，在降低资源需求的同时保持性能。

此外，我们的目标是探索自适应区域选择，将计算资源导向信息最丰富或不确定的区域，以进一步降低TRCM的成本。此外，将CPAM扩展到多模式场景是一个非常有前途的方向。除了改善实例间的特征互补性之外，未来的工作可能会探索CPAM如何适用于模态扩展任务，如**无监督领域自适应(UDA)**和**半监督领域泛化(SemiDG)**。在这些情况下，CPAM可以实现不同成像模态之间的区域级交换，潜在地增强了跨模式的一致性和鲁棒性。一个关键的机会是设计自适应区域选择机制，自动识别哪些区域应该在模态之间转移，以最大限度地提高一致性并保持模态特定的特征。这种自适应的、模式感知的CPAM可以释放更丰富的监测信号，并在不同的临床领域产生更可靠的泛化。
:::

