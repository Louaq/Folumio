---
title: RCPS Rectified Contrastive Pseudo Supervision for Semi-Supervised Medical Image Segmentation
published: 2025-11-27 12:00:00
expires: 2025-12-21 23:59:59
mathjax: true
category: 半监督医学图像分割
tags: [JBHI,伪监督]
description: Medical image segmentation methods
---

::github{repo="hsiangyuzhao/rcps"}

## 摘要

Medical image segmentation methods are generally designed as fully-supervised to guarantee model performance, which requires a significant amount of expert annotated samples that are high-cost and laborious. Semi-supervised image segmentation can alleviate the problem by utilizing a large number of unlabeled images along with limited labeled images. However, learning a robust representation from numerous unlabeled images remains challenging due to potential noise in pseudo labels and insufficient class separability in feature space, which undermines the performance of current semi-supervised segmentation approaches. To address the issues above, we propose a novel semi-supervised segmentation method named as Rectified Contrastive Pseudo Supervision (RCPS), which combines a rectified pseudo supervision and voxel-level contrastive learning to improve the effectiveness of semi-supervised segmentation. Particularly, we design a novel rectification strategy for the pseudo supervision method based on uncertainty estimation and consistency regularization to reduce the noise influence in pseudo labels. Furthermore, we introduce a bidirectional voxel contrastive loss in the network to ensure intra-class consistency and inter-class contrast in feature space, which increases class separability in the segmentation. The proposed RCPS segmentation method has been validated on two public datasets and an in-house clinical dataset. Experimental results reveal that the proposed
method yields better segmentation performance compared with the state-of-the-art methods in semi-supervised medical image segmentation.

## 翻译

医学图像分割方法通常设计为全监督，以保证模型性能，这需要大量的专家标注样本，这些样本成本高且费力。半监督图像分割可以通过利用大量未标记图像与有限的标记图像相结合来缓解这个问题。然而，由于伪标签中的潜在噪声和特征空间中类别可分性不足，从大量未标记图像中学习稳健的表示仍然具有挑战性，这削弱了当前半监督分割方法的性能。为了解决上述问题，我们提出了一种新的半监督分割方法，称为校正对比伪监督（RCPS），该方法结合了校正伪监督和体素级对比学习，以提高半监督分割的有效性。特别是，我们设计了一种新的基于不确定性估计和一致性正则化的伪监督方法校正策略，以减少伪标签中的噪声影响。此外，我们在网络中引入了双向体素对比损失，以确保特征空间中的类内一致性和类间对比，从而增加分割中的类别可分性。所提出的RCPS分割方法已在**两个公共数据集**和**一个内部临床数据集**上进行了验证。实验结果表明，与最新的半监督医学图像分割方法相比，所提出的方法在分割性能上表现更好。

## 研究背景

医学图像分割的精准性对临床诊断和治疗至关重要，但现有方法多依赖全监督学习，需大量专家标注样本，而医学数据标注成本高、耗时长。半监督学习通过结合少量标注数据与大量未标注数据缓解该问题，但现有方法面临两大挑战：**伪标签噪声和特征空间监督不足**。伪标签由模型预测生成，易受预测误差影响，导致监督不可靠；现有方法仅在标签空间提供监督，缺乏特征空间显式优化以提升类间分离性。为解决这些问题，本文提出Rectified Contrastive Pseudo Supervision（RCPS）方法，通过伪标签校正和体素级对比学习，提高半监督医学图像分割的鲁棒性和特征区分能力。

## 研究现状

1. **全监督学习主导**：医学图像分割依赖大量专家标注数据，U-Net及其变体（如Attention U-Net、Swin-Unet）为主流方法，但标注成本高、耗时，限制其应用。
2. **半监督学习兴起**：通过少量标注数据结合大量无标注数据缓解标注压力，主流策略包括**伪标签监督**（如Mean Teacher、Cross Pseudo Supervision）和**一致性正则化**，但伪标签噪声和特征空间监督不足问题突出。
3. **对比学习引入**：自监督对比学习（如MoCo、SimCLR）通过对齐增广视图提升特征判别性，近年扩展至体素级（如Pixel Contrastive Learning），但负样本采样策略和特征空间监督仍待优化。



## 提出的模型

![Snipaste_2025-11-27_10-03-24](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/jIjL/1040X649/3iCsSAu1fwtlK2VdNuIfb2.png)

该研究提出了一种名为**Rectified Contrastive Pseudo Supervision（RCPS，整流对比伪监督）**的半监督医学图像分割方法，旨在解决现有方法中伪标签噪声和特征空间类分离不足的问题。

 ### **整体框架**

 RCPS基于U-Net架构，结合**校正伪监督**（Rectified Pseudo Supervision）和**双向体素对比学习**（Bidirectional Voxel Contrastive Learning），利用少量标注数据和大量无标注数据进行训练。

整体损失函数包括： 

- **有监督损失**：交叉熵损失（Lce）+ Dice损失（LDice），用于标注数据的分割监督。
- **无监督损失**：整流伪监督损失（Lrp）+ 双向体素对比损失（Lbc），用于无标注数据的特征学习。 
### 核心创新模块
（1）校正伪监督（Rectified Pseudo Supervision） 针对伪标签噪声问题，通过**不确定性估计**和**一致性正则化**优化伪监督： 
- **伪监督生成**：对原始输入进行两种强度增强（亮度、对比度、高斯噪声），生成两个视图（xφ1, xφ2），并通过温度锐化（Temperature Sharpening）生成伪标签，计算交叉熵损失（Lp）。
- **不确定性估计**：通过KL散度（Dkl）衡量模型预测的不确定性，动态调整伪标签权重，降低噪声影响：    \( L_{urp} = e^{-D_{kl}} L_p + D_{kl} \) - **一致性正则化**：强制两个增强视图的预测结果一致，通过余弦距离（cosine distance）计算一致性损失（Lcr），最终整流伪监督损失为：    \( L_{rp} = L_{urp}(φ1, y) + L_{urp}(φ2, y) + L_{cr}(φ1, φ2) \)

(2) 双向体素对比学习（Bidirectional Voxel Contrastive Learning）为增强特征空间的类分离性，设计双向对比损失，拉近同类体素距离并推远异类体素：
- **正样本对**：同一输入的两个增强视图中空间对应位置的体素特征（uφ1, uφ2）。 
- **负样本对**：通过**置信负采样策略**（Confident Negative Sampling），基于伪标签筛选高置信度的异类体素作为负样本（u−）。
- **双向InfoNCE损失**：同时计算uφ1→uφ2和uφ2→uφ1的对比损失，公式为：    \( L_{bc} = L_c(ψ1, ψ2) + L_c(ψ2, ψ1) \)，其中\( L_c \)为InfoNCE损失。  

###  训练与优化 
- **混合精度训练**和**梯度检查点**：减少显存占用，加速训练。 - **损失平衡**：通过超参数α和β平衡整流伪监督损失（Lrp）和双向对比损失（Lbc），整体无监督损失为：    \( ℓ_{unsup} = αL_{rp} + βL_{bc} \)。 

![Snipaste_2025-11-27_10-09-44](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/AnMq/540X645/0B5aAWxqh2SuhqubMROS6P.png)





## 实验（Compared with SOTA）

### 数据集

> 数据集: LA Dataset (心房分割)
>

- **数据来源**：2018年心房分割挑战赛数据集，含100例增强MRI扫描（各向同性分辨率0.625mm³）。
- **数据划分**：80例用于训练，20例用于验证，采用10%和20%标记数据的半监督设置。



> 数据集: Pancreas-CTDataset (胰腺分割)
>

- **数据来源**：NIH临床中心公开的82例3D腹部CT扫描，层内分辨率512×512，层间距1.5-2.5mm。

- **预处理**：HU值归一化（窗位75，窗宽400），重采样至1mm³各向同性分辨率；数据划分62例训练，20例验证，同样采用10%和20%标记数据设置。

  

> 数据集: TBI Dataset (创伤性脑损伤)
>

- **数据来源**：华山医院100+例创伤性脑损伤患者的T1加权MRI，含42例标记数据和123例未标记数据，标注17个ROI。
- **预处理**：线性配准至MNI152模板，直方图均衡化；采用5折交叉验证评估。



### 实验设置

1. **网络架构**：基于3D U-Net，在第二个上采样块添加投影头用于对比损失计算。
2. **训练参数**：
   - **优化器**：SGD（动量0.9，权重衰减1e-4），初始学习率1e-2，多项式衰减策略。
   - **超参数**：温度参数T=0.5，对比损失温度τ=0.1，损失权重α=0.1（LA）/0.2（Pancreas/TBI），β=0.1。
   - **数据增强**：随机网格畸变、亮度/对比度调整、高斯噪声。
3. **评估指标**：Dice相似系数（DSC）、95%豪斯多夫距离（HD95）、平均表面距离（ASD）。



### 实验结果

**LA数据集**

- **10%标记数据**：RCPS的DSC达90.12%，显著优于基线（79%）及其他SOTA方法（如UA-MT 86.3%、MC-Net+ 89.2%）。
- **20%标记数据**：DSC提升至91.21%，接近全监督上限（91.65%）。
- **可视化结果**：RCPS对细小结构的分割更完整，边缘更贴合金标准。

![Snipaste_2025-11-27_10-15-45](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/9kOj/1058X309/2Sb0KbYo9ywK0f6P4pHnYa.png)

![Snipaste_2025-11-27_10-16-08](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/1yTb/712X462/53tXeZCuaSYS0GspUMx6FP.png)



**Pancreas-CT数据集**

- **10%标记数据**：DSC从55%提升至76%，优于URPC（72.5%）和MC-Net+（74.3%）。
- **20%标记数据**：DSC达81.59%，接近全监督性能（83.89%）。

**TBI数据集**

- **多类别分割**：RCPS的平均DSC达71.88%，较全监督U-Net（61.64%）提升16%，优于先前方法（如TBI-GAN 68.3%）。
- **关键区域改善**：损伤区域的分割精度显著提升，减少漏检。



## 实验（Ablation Experiments）​​

![Snipaste_2025-11-27_10-18-03](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/GH5N/529X235/5O6LRclkZChpngx5F3pqND.png)

1. **核心组件有效性**
   - **校正伪监督（Lrp）**：单独使用提升DSC约5-7%；结合不确定性估计和一致性正则化效果最优。
   - **双向体素对比损失（Lbc）**：单独使用提升DSC约3-4%；双向计算比单向对比损失增益更高。
2. **负采样策略**
   - **置信负采样**：较随机采样提升DSC约4%，当负样本数N=100时性能接近N=400（节省50%显存）。
3. **超参数影响**
   - **损失权重α/β**：α=0.2、β=0.1时在复杂任务（如TBI）中表现最佳；温度参数T=0.5可有效避免类别重叠。

## 结论

本文提出了一种名为Rectified Contrastive Pseudo Supervision（RCPS）的新型半监督医学图像分割方法，主要贡献包括：

1. **改进的伪监督策略**：设计了基于不确定性估计和一致性正则化的伪标签校正机制。通过对原始输入生成两种不同增强视图，利用KL散度进行不确定性估计（式5-6）和余弦距离一致性正则化（式7-8），有效降低伪标签噪声影响。实验表明，该策略使LA数据集在10%标记数据下的DSC从79%提升至90%以上（表I）。
2. **双向体素对比学习**：提出基于InfoNCE损失的双向体素对比损失（式10-11），结合置信负采样策略（利用伪标签筛选不同类别体素），增强特征空间的类间分离性。在胰腺CT数据集上，该模块使10%标记数据下的DSC达到76%，显著优于现有方法（表II）。
3. **多场景验证**：在LA（MRI左心房分割）、胰腺CT和创伤性脑损伤（TBI）三个数据集上验证了方法有效性。TBI数据集的多类别分割任务中，DSC较全监督U-Net提升16%（从61.64%到71.88%），尤其改善了损伤区域的分割精度（图4-5）。

**局限性与未来方向**：

- 当前依赖人工设计的强度增强策略，未来将探索参数化数据增强方法
- 未针对距离度量（如HD95）优化，计划引入距离相关损失函数
- 需扩展至2D医学图像分割任务以验证通用性

该方法通过标签空间校正和特征空间监督的双重优化，在有限标记数据下实现了接近全监督的分割性能，为临床数据稀缺场景提供了有效解决方案。



> 思考: 相对上一篇[文章](),本文提出的改进伪监督和双向体素对比学习关注**伪标签噪声和特征空间的监督**



