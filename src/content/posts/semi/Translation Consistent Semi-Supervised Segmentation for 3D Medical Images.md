---
title: Translation Consistent Semi-Supervised Segmentation for 3D Medical Images
published: 2026-01-08 19:25:00
expires: 2026-01-31 23:59:59
description: "三维医学图像分割方法已经取得了成功"
category: 半监督医学图像分割
tags: [TMI]
---

:::note

代码和数据集完整，可以复现出

:::

::github{repo="yyliu01/TraCoCo"}



## 摘要

3D medical image segmentation methods have been successful, but their dependence on large amounts of voxel-level annotated data is a disadvantage that needs to be addressed given the high cost to obtain such annotation. Semi-supervised learning (SSL) solves this issue by training models with a large unlabelled and a small labelled dataset. The most successful SSL approaches are based on consistency learning that minimises the distance between model responses obtained from perturbed views of the unlabelled data. These perturbations usually keep the spatial input context between views fairly consistent, which may cause the model to learn segmentation patterns from the spatial input contexts instead of the foreground objects. In this paper, we introduce the Translation Consistent Co-training (TraCoCo) which is a consistency learning SSL method that perturbs the input data views by varying their spatial input context, allowing the model to learn segmentation patterns from foreground objects. Furthermore, we propose a new Confident Regional Cross entropy (CRC) loss, which improves training convergence and keeps the robustness to co-training pseudo-labelling mistakes. Our method yields state-of-the-art (SOTA) results for several 3D data benchmarks, such as the Left Atrium (LA), Pancreas-CT (Pancreas), and Brain Tumor Segmentation (BraTS19). Our method also attains best results on a 2D-slice benchmark, namely the Automated Cardiac Diagnosis Challenge (ACDC), further demonstrating its effectiveness. Our code, training logs and checkpoints are available at https://github.com/yyliu01/TraCoCo.

## 翻译

三维医学图像分割方法已经取得了成功，但由于获得这种注释的成本很高，因此需要解决对大量体素级注释数据的依赖。半监督学习(SSL)通过使用大型未标记数据集和小型标记数据集训练模型来解决这个问题。最成功的SSL方法是基于一致性学习，它最小化了从未标记数据的受干扰视图获得的模型响应之间的距离。这些扰动通常使视图之间的空间输入上下文保持相当一致，这可能导致模型从空间输入上下文而不是前景对象中学习分割模式。在本文中，我们引入了平移一致性协同训练(TraCoCo)，这是一种一致性学习SSL方法，它通过改变输入数据视图的空间输入上下文来干扰输入数据视图，使模型能够从前景对象中学习分割模式。此外，我们提出了一种新的可信区域交叉熵(CRC)损失，提高了训练收敛，并保持了对共同训练伪标记错误的鲁棒性。我们的方法为几个3D数据基准(如左心房(LA)、胰腺ct(胰腺)和脑肿瘤分割(BraTS19))提供了最先进的(SOTA)结果。我们的方法在2d切片基准上也取得了最佳结果，即自动心脏诊断挑战(ACDC)，进一步证明了其有效性。我们的代码、培训日志和检查点可在https://github.com/yyliu01/TraCoCo上获得。

## 研究背景

3D医学图像分割依赖大量体素级标注数据，但标注成本高、过程繁琐，限制了模型的临床应用。半监督学习（SSL）通过结合少量标注数据和大量未标注数据缓解此问题，其中一致性学习方法通过最小化未标注数据扰动视图间的模型响应差异实现训练，但现有方法通常保持视图间的空间输入上下文一致，导致模型可能从空间上下文而非前景目标学习分割模式。

在医学影像中，目标常被拓扑稳定的背景器官包围（如**左心房周围的肺静脉和二尖瓣**），模型易"记忆"背景模式，导致背景变化时预测不一致。现有对比学习方法计算成本高、依赖噪声伪标签选择正负样本，且缺乏网络扰动，泛化能力有限。因此，本文提出Translation Consistent Co-training（TraCoCo）框架，通过翻译扰动改变空间上下文，促使模型关注前景目标，并设计Confident Regional Cross-Entropy（CRC）损失提升训练收敛性和伪标签鲁棒性。

## 研究现状

1. **半监督学习（SSL）主导**：3D医学图像分割依赖大量标注数据，SSL通过结合少量标注数据与大量未标注数据缓解标注成本问题，一致性学习是主流方法，通过最小化不同扰动视图的模型响应差异实现半监督训练（如Mean Teacher框架）。
2. **协同训练框架兴起**：为避免模型收敛到相同局部最优，共训练框架采用双模型互监督生成伪标签，提升网络扰动多样性，但仍存在背景上下文过拟合问题。
3. **对比学习与多任务辅助**：如CAC方法通过对比学习聚类特征，但计算成本高且依赖伪标签质量；多任务学习（如重建、距离场预测）增强几何理解，但未解决空间上下文扰动问题。

## 提出的模型

![Snipaste_2026-01-08_19-30-56](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5Ps9/0X0/0343OW8A7Tv4oWrSCdgiQX.webp)

### **1. 平移一致性协同训练框架（TraCoCo核心机制）**

- **核心思想**：通过**翻译扰动（translation perturbation）** 改变输入数据的空间上下文，强制模型在不同背景下对重叠区域的分割结果保持一致，从而减少对背景模式的“记忆”，专注于学习前景目标特征。
- **实现方式**：
  - 从原始3D volume中随机裁剪两个具有非空重叠区域的子体积（`f`和`s`），模拟不同背景。
  - 通过**翻译一致性损失（Translation Consistency Loss, ℓtra）** 约束两个子体积重叠区域的分割结果相似性，具体包含：
    - **KL散度项（ℓkl）**：最小化两个模型在重叠区域的预测分布差异。
    - **熵正则项（ℓreg）**：平衡前景和背景类别的预测熵，提升模型输出的确定性。
- **优势**：无需对比学习中复杂的正负样本选择，直接在体素空间约束所有重叠区域样本，优化更充分且计算成本更低。

### **2. 置信区域交叉熵损失（Confident Regional Cross-Entropy, CRC Loss）**

- **核心思想**：针对协同训练中伪标签噪声问题，仅选择高置信度的前景和背景伪标签进行训练，提升收敛稳定性和对伪标签错误的鲁棒性。
- **实现方式**：
  - 通过阈值（`γ`为前景置信阈值，`β`为背景置信阈值）筛选高置信伪标签。
  - 对筛选后的区域应用交叉熵损失，同时忽略低置信区域以避免噪声干扰。
- **优势**：相比MSE或KL散度损失，CRC损失在保持对伪标签错误鲁棒性的同时，加快了训练收敛速度。

### **3. 3D CutMix数据增强**

- **作用**：通过随机生成3D二进制掩码混合不同样本的子区域，增强模型对数据分布变化的鲁棒性，进一步提升半监督学习的泛化能力。



### **4. 模型整体架构**

- **协同训练框架**：包含两个参数初始化不同的模型（如VNet或3D-UNet），互为监督生成伪标签。
- **总损失函数**：结合有监督损失（交叉熵+Dice损失）、翻译一致性损失（ℓtra）和半监督CRC损失（ℓcrc），通过余弦退火函数平衡监督与无监督损失权重。

![Snipaste_2026-01-08_19-32-26](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/4JcQ/746X643/0sPOkXFYCKh1jv2N3Qealn.png)

## 实验（Compared with SOTA）

> 数据集：
>
> 1. **3D医学影像数据集**
>    - **Left Atrium (LA)**：100例3D MRI，用于左心房分割，训练集80例、测试集20例。
>    - **Pancreas-CT**：82例3D CT，用于胰腺分割，训练集62例、测试集20例。
>    - **BraTS19**：335例脑MRI，用于脑肿瘤分割（简化为二分类任务），训练集250例、验证集25例、测试集60例。
> 2. **2D医学影像数据集**
>    - **ACDC**：100例心脏MRI，用于左心室、右心室和心肌分割，采用2D切片训练，训练集70例、验证集10例、测试集20例。



> 评估指标：
>
> - **Dice系数**、**Jaccard指数**（百分比）；
> - **平均表面距离（ASD）**、**95% Hausdorff距离（95HD）**（体素单位）；
> - 模型复杂度：参数数量、乘加运算次数（MAC）。

1. **与现有SOTA方法对比**
   - **LA数据集**：在8/16标签样本设置下，Dice系数分别达到91.47%/92.01%，超过MC-Net+等方法0.44%-0.9%。
   - **Pancreas数据集**：在6/12标签样本设置下，Dice系数分别为68.21%/72.33%，超过MC-Net+ 1.21%-5.21%。
   - **BraTS19数据集**：在25/50标签样本设置下，Dice系数分别为85.32%/86.45%，超过SASSNet和LG-ER-MT约1%。
   - **ACDC数据集**：在3/7/14标签样本设置下，平均Dice系数达89.23%，超过UniMatch 0.54%-2.34%。
2. **消融实验**
   - **翻译一致性损失（TraCo）**：在LA和Pancreas数据集上Dice分别提升0.83%和1.58%，证明其有效减少背景依赖。
   - **置信区域交叉熵损失（CRC）**：替换传统交叉熵后，Dice提升0.44%（LA）和0.54%（Pancreas），增强对伪标签噪声的鲁棒性。
   - **3D CutMix**：进一步提升模型泛化能力，Dice平均提升0.5%-1%。
3. **与全监督学习对比**
   - 在LA数据集8标签样本下，TraCoCo的Dice（91.47%）接近全监督模型（91.47%），证明其利用无标签数据的有效性。
4. **计算效率**
   - 训练时间仅为对比方法CAC的一半，推理阶段无额外计算成本，适合临床部署。

![Snipaste_2026-01-08_19-34-57](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/THJy/1203X900/0xZ5uTf0r9uijnqJ4zQBVt.png)

![Snipaste_2026-01-08_19-35-41](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/15x5/1204X271/4EpdHmOI7pGg8vUd3ZTt6m.png)

![Snipaste_2026-01-08_19-35-58](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/htax/1211X510/1XuHYjMPlJ3zFjhyOcoxDM.png)

## 结论

本文提出了一种名为Translation Consistent Co-training（TraCoCo）的半监督分割方法，旨在解决3D医学图像分割中对大量标注数据的依赖问题。主要贡献包括：

1. **平移一致性协同训练策略**：通过对输入数据进行平移扰动，强制模型在不同空间上下文中保持分割一致性，减少对背景模式的过拟合，使模型更专注于前景目标特征学习。
2. **置信区域交叉熵（CRC）损失**：仅使用高置信度的伪标签进行正/负样本训练，在提高收敛速度的同时增强对伪标签噪声的鲁棒性。

**实验结果**：在Left Atrium、Pancreas-CT、BraTS19等3D数据集及2D的ACDC数据集上均达到SOTA性能，Dice分数较现有方法提升0.4%-6.02%，95% Hausdorff距离显著降低。通过对比实验验证了翻译一致性损失和CRC损失的有效性，且在少量标注数据（如8例LA数据）下仍能实现8.26%的Dice提升。

**未来方向**：计划结合自监督对比学习进一步优化特征表示，并探索降低小体积噪声预测的方法以提升模型实用性。





