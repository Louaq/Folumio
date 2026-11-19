---
title: Exploring Smoothness and Class-Separation for Semi-supervised Medical Image Segmentation
published: 2026-01-14 19:02:00
expires: 2026-01-31 23:59:59
description: "半监督分割在医学成像中仍然具有挑战性"
category: 半监督医学图像分割
tags: [MICCAI]
---



::github{repo="ycwu1997/SS-Net"}


:::note
SS-Net是一个经典的方法，多次在半监督的论文中出现
:::



## 摘要

Semi-supervised segmentation remains challenging in medical imaging since the amount of annotated medical data is often scarce and there are many blurred pixels near the adhesive edges or in the low-contrast regions. To address the issues, we advocate to firstly constrain the consistency of pixels with and without strong perturbations to apply a sufficient smoothness constraint and further encourage the class-level separation to exploit the low-entropy regularization for the model training. Particularly, in this paper, we propose the SS-Net for semi-supervised medical image segmentation tasks, via exploring the pixel-level Smoothness and inter-class Separation at the same time. The pixel-level smoothness forces the model to generate invariant results under adversarial perturbations. Meanwhile, the inter-class separation encourages individual class features should approach their corresponding high-quality prototypes, in order to make each class distribution compact and separate different classes. We evaluated our SS-Net against five recent methods on the public LA and ACDC datasets. Extensive experimental results under two semi-supervised settings demonstrate the superiority of our proposed SS-Net model, achieving new state-of-theart (SOTA) performance on both datasets. The code is available at https://github.com/ycwu1997/SS-Net

## 翻译

半监督分割在医学成像中仍然具有挑战性，因为注释的医疗数据数量通常很少，并且在粘附边缘附近或低对比度区域存在许多模糊的像素。为了解决这些问题，我们建议首先约束具有和不具有强扰动的像素的一致性，以应用足够的平滑约束，并进一步鼓励类水平分离，以利用低熵正则化进行模型训练。特别地，在本文中，我们通过同时探索像素级平滑和类间分离，提出了SS-Net用于半监督医学图像分割任务。像素级平滑迫使模型在对抗性扰动下产生不变的结果。同时，类间分离鼓励单个类特征应接近其相应的高质量原型，以使每个类分布紧凑，分离不同的类。我们针对最近在公共LA和ACDC数据集上的五种方法评估了我们的SS-Net。在两个半监督设置下的大量实验结果证明了我们提出的SS-Net模型的优越性，在两个数据集上都实现了新的核心状态(SOTA)性能。代码可在https://github.com/ycwu1997/SS-Net

## 研究背景

![Snipaste_2026-01-14_19-04-52](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Gtao/0X0/0343OUta9VaIAmdgstDcfj.webp)

半监督分割在医学影像领域仍面临两大核心挑战：**一是标注数据稀缺**，获取像素级标注成本高昂且耗力；**二是医学图像中存在大量模糊像素**（如粘连边缘或低对比度区域），导致现有模型性能受限。现有方法虽基于平滑性和低熵假设，但在标注数据极少且目标边界模糊时，常出现特征流形交叠、决策边界不清晰的问题（如图1中γ值增大导致的类间混淆）。

为解决上述问题，本文提出需同时强化两点：（1）通过强扰动实现充分的像素级平滑性约束，以有效利用未标注数据；（2）增强类间分离性，推动模型生成低熵预测。基于此，作者设计SS-Net模型，结合对抗性噪声扰动（像素级平滑）和原型引导的特征聚类（类间分离），旨在缓解医学影像半监督分割中的**数据稀缺与目标模糊**问题。

## 研究现状

1. **半监督分割主流方法**：基于平滑性假设（数据/特征/模型层面扰动下保持预测一致性）和低熵假设（决策边界位于低密度区域），如VAT、熵最小化等。
2. **医学影像应用挑战**：标注数据稀缺且成本高，模糊边界和低对比度区域导致像素分类不确定性，现有方法难以有效利用未标注数据。
3. **现有技术局限**：依赖随机噪声扰动的平滑性约束不足；直接对预测结果应用熵最小化效果有限；部分方法（如UA-MT）过滤不确定区域，导致极端少标签场景下性能下降。

## 提出的模型

![Snipaste_2026-01-14_19-08-55](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/0JI6/933X677/6WxuX9NJ1oyIALde3j2XB3.png)

### **SS-Net的核心设计**

#### 1. **像素级平滑性约束（Pixel-level Smoothness）**

- **动机**：医学图像中存在大量模糊像素（如黏连边缘或低对比度区域），需通过强扰动增强模型对局部分布平滑性的学习。
- **方法**：
  基于虚拟对抗训练（VAT）思想，通过生成**像素级对抗噪声**（adversarial noises）作为强扰动，迫使模型对原始图像和扰动图像的预测保持一致。

#### 2. **类间分离性约束（Inter-class Separation）**

- **动机**：仅靠平滑性约束可能导致模糊像素分类不确定，需在特征空间中增强类间区分度。
- **方法**：
  通过**原型引导的特征聚类**，将同类特征向高质量原型靠拢，压缩类内分布并分离不同类别。

### **总损失函数**

模型总损失为**分割损失**、**平滑性损失**和**类间分离损失**的加权和：
$$\mathcal{L}_{total}=\mathcal{L}_{seg}+\lambda_{lds}\times\mathcal{L}_{lds}+\lambda_{cs}\times\mathcal{L}_{cs}$$


## 实验（Compared with SOTA）

> 数据集：
>
> - **LA数据集**（左心房MRI）：100例扫描，80例训练/20例验证，评估指标包括Dice、Jaccard、95% Hausdorff距离（95HD）、平均表面距离（ASD）。
> - **ACDC数据集**（心脏MRI）：100例扫描，70例训练/10例验证/20例测试，需分割心肌、左心室、右心室三个类别。
>
> 半监督设置：
>
> - **5%标注数据**：LA使用4例标注/76例未标注，ACDC使用3例标注/67例未标注。
> - **10%标注数据**：LA使用8例标注/72例未标注，ACDC使用7例标注/63例未标注。
>
> 基线方法：
>
> 对比5种最新半监督分割方法：
>
> - UA-MT [28]、SASSNet [7]、DTC [10]、URPC [11]、MC-Net [21]

![Snipaste_2026-01-14_19-14-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Eynz/943X461/18qZ4LH2JVhlMU20HmramA.png)



![Snipaste_2026-01-14_19-14-15](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/eyiE/943X456/7jHiIpSnDLKVXNXxDoP9rP.png)



![Snipaste_2026-01-14_19-14-30](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/j7j1/936X469/6g2SU08Usp5WlpvUynsACR.png)

##### LA数据集（表1）

- **5%标注**：SS-Net Dice=86.33%，较MC-Net提升2.74%，95HD=9.97（最佳）。
- **10%标注**：SS-Net Dice=88.55%，较MC-Net提升0.93%，95HD=7.49（最佳）。
- **优势**：在模糊边缘和细分支区域（图3黄色圆圈）分割更精准。

##### ACDC数据集（表2）

- **5%标注**：SS-Net Dice=65.82%，较MC-Net提升2.97%，95HD=6.67（最佳）。
- **10%标注**：SS-Net Dice=86.78%，较MC-Net提升0.34%，ASD=1.40（最佳）。
- **关键发现**：UA-MT在5%标注时性能下降（Dice=46.04% < 监督基线47.83%），而SS-Net有效利用模糊像素。



## 实验（Ablation Experiments）​​

![Snipaste_2026-01-14_19-15-30](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/6lDt/930X467/2dsl15SjjdakVSWzhEcLdU.png)

- **$L_{lds}$（像素级平滑性）**：单独使用时Dice提升11.76%（5%标注），验证对抗扰动的有效性。
- **$L_{cs}$（类间分离）**：单独使用时Dice提升11.55%（5%标注），证明特征原型策略的作用。
- **联合使用**：Dice进一步提升2.02%（5%标注），两者互补性显著。

## 结论

本文提出了SS-Net用于半监督医学图像分割。针对医学领域标注数据少和目标模糊的问题，核心思路是同时应用对抗性噪声以实现充分的**平滑性约束**，并通过收缩每个类别的分布来**分离不同类别**，从而有效利用未标记训练数据。在LA和ACDC数据集上的实验结果表明，所提出的SS-Net优于其他方法，在半监督医学图像分割任务中取得了优越性能。未来工作将包括扰动幅度和原型大小的自适应选择。





