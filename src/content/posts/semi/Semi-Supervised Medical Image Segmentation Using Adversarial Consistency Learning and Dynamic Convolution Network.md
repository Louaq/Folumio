---
title: Semi-Supervised Medical Image Segmentation Using Adversarial Consistency Learning and Dynamic Convolution Network
published: 2025-12-17 16:32:00
expires: 2025-12-31 23:59:59
mathjax: true
description: "流行的半监督医学图像"
category: 半监督医学图像分割
tags: [TMI]
---

:::note

本文值得参考，特别是对于未标记数据的处理部分

:::

::github{repo="SUST-reynole/ASE-Net"}


## 摘要

Popular semi-supervised medical image segmentation networksoften suffer fromerror supervision from unlabeled data since they usually use consistency learning under different data perturbations to regularizemodel training. Thesenetworks ignore the relationshipbetween labeled andunlabeleddata, andonlycomputesingle pixel-levelconsistency leading to uncertain prediction results. Besides, these networks often require a large number of parameters since their backbone networks are designed depending on supervised image segmentation tasks. Moreover, these networksoften facea highover-fitting risksinceasmall number of training samples are popular for semi-supervised image segmentation.Toaddress the aboveproblems, in this paper, we propose a novel adversarial self-ensembling network using dynamic convolution (ASE-Net) for semi-supervised medical image segmentation. First, we use an adversarial consistency training strategy (ACTS) that employs two discriminators based on consistency learning to obtain prior relationships between labeled and unlabeled data. The ACTS can simultaneously compute pixel-level and image-level consistency of unlabeled data under different data perturbations to improve the prediction quality of labels. Second, we design a dynamic convolution-based bidirectional attention component (DyBAC) that can be embedded in any segmentation network, aiming at adaptively adjusting the weights of ASE-Net based on the structural information of input samples. This component effectively improves the feature representation ability of ASE-Net and reduces the overfitting risk of the network. The proposed ASE-Net has been extensively tested on three publicly available datasets, and experiments indicate that ASE-Net is superior to state-of-the-art networks, and reduces computational costs and memory overhead. The code is available at: https://github.com/SUST-reynole/ASE-Net

## 翻译

流行的半监督医学图像分割网络常常受到来自未标记数据的有监督误差的影响，因为它们通常在不同数据扰动下使用一致性学习来正则化模型训练。这些网络忽略了标记数据和未标记数据之间的关系，仅计算单像素级别的一致性，导致预测结果不确定。此外，这些网络通常需要大量参数，因为其骨干网络的设计依赖于监督图像分割任务。而且，由于半监督图像分割中训练样本数量较少，这些网络往往面临较高的过拟合风险。为解决上述问题，本文提出了一种新颖的基于动态卷积的对抗自集成网络（ASE-Net）用于半监督医学图像分割。首先，我们采用对抗一致性训练策略（ACTS），该策略基于一致性学习使用两个判别器来获取标记数据和未标记数据之间的先验关系。ACTS可以在不同数据扰动下同时计算未标记数据的像素级和图像级一致性，从而提高标签的预测质量。其次，我们设计了一种基于动态卷积的双向注意力组件（DyBAC），该组件可嵌入任何分割网络中，旨在根据输入样本的结构信息自适应调整ASE-Net的权重。该组件有效提升了ASE-Net的特征表示能力，并降低了网络的过拟合风险。所提出的ASE-Net已在三个公开数据集上进行了广泛测试，实验结果表明ASE-Net优于最先进的网络，并降低了计算成本和内存开销。代码可在以下链接获取：https://github.com/SUST-reynole/ASE-Net

## 研究背景

医学图像分割在计算机辅助诊断中至关重要，但传统监督学习严重依赖大量像素级标注数据，而医学图像标注成本高、专业性强，难以构建大规模标注数据集。半监督学习通过少量标注数据与大量未标注数据联合训练，更符合临床实际需求。现有半监督医学图像分割方法存在三大局限：

1）**一致性学习方法仅利用不同扰动下的像素级一致性，忽略标注与未标注数据间的先验关系，导致预测不确定性**；

2）**对抗学习方法过度依赖单一分割网络和判别器，易产生误导和误差累积**；

3）**采用监督学习设计的固定参数骨干网络，参数量大且对小样本标注数据易过拟合，特征表示能力有限**。

为解决上述问题，本文提出**基于动态卷积的对抗性自集成网络**（ASE-Net），通过融合对抗一致性学习与动态卷积注意力机制，提升未标注数据利用效率并降低过拟合风险。

## 研究现状

#### 1. **核心挑战**

现有半监督医学图像分割方法主要面临以下问题：

- **未标记数据的误差监督**：传统一致性学习仅通过数据扰动下的像素级一致性正则化模型训练，忽略标记与未标记数据间的关联，导致预测结果不确定性高。
- **模型参数冗余**：骨干网络多沿用监督学习设计，参数规模大，计算成本高。
- **过拟合风险**：医学图像标注样本稀缺，小数据集易引发过拟合，降低伪标签质量。

#### 2. **主流方法分类**

当前半监督医学图像分割方法可分为五大类：

- **一致性学习**（如Mean Teacher及其变体）：通过教师-学生模型架构，利用扰动数据的预测一致性正则化训练。例如，Mean Teacher通过指数移动平均（EMA）更新教师模型权重，为未标记数据生成伪标签。
- **对抗学习**（如GAN衍生模型）：通过生成器与判别器的博弈提升未标记数据利用。但传统方法依赖单一生成器和判别器，易导致误差累积。
- **自训练**：利用模型自身预测结果作为伪标签迭代优化，但伪标签质量依赖初始模型性能。
- **对比学习**：通过数据增强构建正负样本对，学习鲁棒特征表示，但在医学图像低对比度场景下效果有限。
- **协同训练**：多模型协同学习标记与未标记数据信息，但模型间协同策略设计复杂。

#### 3. **现有方法局限性**

- **一致性学习**：仅关注像素级一致性，忽略图像全局结构信息；未充分挖掘标记与未标记数据的先验关系。
- **对抗学习**：单一判别器易受低质量生成结果误导，导致训练不稳定。
- **静态卷积网络**：固定卷积核参数难以适应医学图像的个体差异，且参数规模大，加剧过拟合风险。



## 提出的模型

![Snipaste_2025-12-17_19-24-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/bccf/0X0/0343OW17bPnt2j3FPwMW0y.webp)



### 1**. 对抗性一致性训练策略（ACTS）**

- **双判别器设计**：
  - **判别器D1**：学习标记数据与未标记数据的预测质量差异，增强两者的先验关系。
  - **判别器D2**：学习未标记数据在不同扰动下的预测一致性（图像级一致性），补充传统像素级一致性的不足。
- **多损失函数优化**：
  - 监督损失（Ls）：基于标记数据的交叉熵损失和Dice损失。
  - 一致性损失（Lsemi）：教师模型与学生模型对未标记数据的像素级MSE损失。
  - 对抗损失（Lad1, Lad2）：通过判别器反馈优化未标记数据的分割质量。



![Snipaste_2025-12-17_19-25-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/I7GX/1269X696/0qxjKcz7phsnu88g3OEAm5.png)



### **2. 动态卷积双向注意力组件（DyBAC）**

- **动态卷积核生成**：
  - 预定义N组卷积核，通过输入特征的全局平均池化和softmax激活生成动态权重，自适应聚合卷积核（公式6），提升特征表示能力。
- **参数轻量化设计**：
  - 采用深度可分离卷积解耦空间与通道相关性，参数数量仅为标准动态卷积的1/40（公式9），有效降低计算成本。
- **空间注意力增强**：
  - 对输入特征图进行空间注意力加权，突出医学图像中的关键结构（如病灶边缘），减少低对比度和噪声干扰。

### **3. 模型结构与训练流程**

- **自集成框架**：
  - 学生模型通过监督损失、一致性损失和对抗损失训练，教师模型为学生模型权重的指数移动平均（EMA），提供可靠伪标签。
- **交替训练机制**：
  - 分割网络与判别器网络交替优化：分割网络生成高质量分割结果以“欺骗”判别器，判别器则区分标记/未标记数据及扰动数据的预测差异。
- **推理阶段优化**：
  - 判别器仅用于训练，推理时仅保留轻量化分割网络，避免额外计算开销。

## 实验（Compared with SOTA）

### 1、实验数据集

1. **LiTS肝脏CT数据集**
   - 131例CT扫描图像，尺寸512×512，评估指标为Dice系数（DI）和平均对称表面距离（ASD）。
   - 训练集含121例，测试集10例；按10%/20%标记数据比例划分（12/24例标记，其余无标记）。
2. **ISIC皮肤镜图像数据集**
   - 2594张皮肤 lesion 图像，尺寸调整为256×192，评估指标包括DI、Jaccard指数（JA）、像素准确率（AC）、敏感度（SE）、特异度（SP）。
   - 按10%/20%标记数据比例划分（259/519张标记，其余无标记）。
3. **3D左心房MR数据集**
   - 100例3D MR图像，分辨率0.625×0.625×0.625 mm³，评估指标为DI、JA、95% Hausdorff距离（95HD）、ASD。
   - 训练集80例，验证集20例；按10%/20%标记数据比例划分（8/16例标记，其余无标记）。



### 2. 评估指标

![Snipaste_2025-12-17_19-26-17](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/cPtT/598X307/6uL7K84RNHJz0q686YEz3C.png)

![Snipaste_2025-12-17_19-26-23](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/j7FV/648X230/1YrIT3mYYsdtTbKxg4FVDU.png)

### 3、实验设置

- **硬件与框架**：NVIDIA RTX 3090，PyTorch 1.7。
- **优化器**：
  - 分割网络：Adam优化器，初始学习率1×10⁻³。
  - 判别器网络：SGD优化器，动量0.9，初始学习率0.01，权重衰减1×10⁻⁴。
- **数据增强**：随机翻转、镜像、旋转（在线增强）。



### 4、实验结果

- **基线方法**：
  - 监督学习：U-Net、U-Net++、V-Net。
  - 半监督学习：DAN、Mean Teacher（MT）、UA-MT、TCSM_v2、CPS、DTC、MC-Net。
- **结果**：
  - **LiTS（10%标记数据）**：ASE-Net的DI达94.12%，较MT提升1.65%，较MC-Net提升0.5%（表IV）。
  - **皮肤镜（20%标记数据）**：ASE-Net的DI达87.21%，JA达79.25%，均为最优（表VII）。
  - **3D左心房（10%标记数据）**：ASE-Net的DI达87.83%，较MT提升3.59%（表VIII）。

![Snipaste_2025-12-17_19-29-26](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/lrUG/619X545/6Z2062yskbMBrwLm7PGTC9.png)

![Snipaste_2025-12-17_19-29-31](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/yFyI/673X559/013Ml8CGob2dDicaxOsC0K.png)

![Snipaste_2025-12-17_19-29-38](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/oCry/1304X612/0XYv9AlB8nmfXcxbq65WVo.png)

## 实验（Ablation Experiments）​​

- **ACTS（对抗一致性训练策略）**：
  - 双判别器（D1/D2）分别学习标记/无标记数据质量差异、扰动/未扰动数据一致性。
  - 在LiTS数据集上，D1/D2使DI分别提升0.72%/0.75%（基于Mean Teacher基线）。
- **DyBAC（动态卷积双向注意力组件）**：
  - 替换标准卷积以动态调整核参数，减少过拟合。
  - 在皮肤镜数据集上，DyBAC使DI提升0.97%，并降低验证集损失波动（见图4）。

![Snipaste_2025-12-17_19-28-10](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wLhG/659X395/5lMtOx6nLnxTaCdFpULBsf.png)

![Snipaste_2025-12-17_19-28-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5ixO/653X380/5pZpH8TLJ2k32X3Zm7pxzJ.png)



## 效率和统计学分析

- **模型轻量化**：
  - 与U-Net相比，ASE-Net参数数量减少85%，FLOPs降低70%（表X）。
- **统计显著性**：
  - 配对t检验显示，ASE-Net与MT在LiTS和皮肤镜数据集上的Dice差异具有统计学意义（p<0.05，表XI）。

![Snipaste_2025-12-17_19-30-29](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/IL6V/662X352/2BmbjdfNU4VEbroRAX03UK.png)



![Snipaste_2025-12-17_19-30-34](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/eGsn/615X382/40RG2wdvomQHJdlJKLhJ57.png)

## 结论

本文提出了一种基于动态卷积的对抗性自集成网络（ASE-Net）用于半监督医学图像分割，主要结论如下：

1. **对抗性一致性训练策略（ACTS）的有效性**
   通过引入两个判别器网络（D1和D2），有效结合了一致性学习与对抗学习的优势。D1学习标记数据与未标记数据的预测质量差异，D2学习未标记数据在不同扰动下的图像级一致性，从而同时优化像素级和图像级特征，提升了未标记数据的伪标签质量。
2. **动态卷积双向注意力组件（DyBAC）的优势**
   DyBAC通过空间注意力增强关键区域特征，并动态聚合多组卷积核参数，实现了网络参数的自适应调整。该组件不仅提升了特征表示能力，还显著降低了过拟合风险，尤其适用于小样本标注场景。实验表明，DyBAC在保持分割精度的同时，减少了40%-85%的参数量和计算成本。
3. **性能与效率的综合提升**
   在LiTS肝脏CT、ISIC皮肤病变和3D左心房MR三个公开数据集上的实验显示，ASE-Net在Dice系数、ASD（平均对称表面距离）等指标上均优于现有半监督方法（如MC-Net、CPS）。与监督学习相比，在10%标记数据下，ASE-Net的Dice提升达5.95%，且模型参数量仅为传统U-Net的15%，推理速度更快。
4. **统计显著性验证**
   通过配对t检验（α=0.05）证实，ASE-Net与基线方法（Mean Teacher）的性能差异具有统计学意义（p<0.05），表明其优势并非偶然。

综上，ASE-Net通过创新的训练策略和动态网络结构，为半监督医学图像分割提供了高效解决方案，尤其在标注数据稀缺的临床场景中具有实用价值。



## 部分参考文献

[1] O. Ronneberger, P. Fischer, and T. Brox, “U-Net: Convolutional networks for biomedical image segmentation,” in Proc. Int. Conf. Med. Image Comput. Comput.-Assist. Intervent. Cham, Switzerland: Springer, 2015, pp. 234–241.

[2] Z. Zhou et al., “UNet++: Redesigning skip connections to exploit multiscale features in image segmentation,” IEEE Trans. Med. Imag., vol. 39, no. 6, pp. 1856–1867, Dec. 2019.

[3] X. Li, H. Chen, X. Qi, Q. Dou, C.-W. Fu, and P.-A. Heng, “H-DenseUNet: Hybrid densely connected UNet for liver and tumor segmentation from CT volumes,” IEEE Trans. Med. Imag., vol. 37, no. 12, pp. 2663–2674, Dec. 2017.

[4] Z.-H. Zhou, “A brief introduction to weakly supervised learning,” Nat. Sci. Rev., vol. 5, no. 1, pp. 44–53, 2018.

[5] A. Tarvainen and H. Valpola, “Mean teachers are better role models: Weight-averaged consistency targets improve semi-supervised deep learning results,” in Proc. 31st Int. Conf. Neural Inf. Process. Syst., 2017, pp. 1195–1204. 

[6] X. Li, L. Yu, H. Chen, C.-W. Fu, and P.-A. Heng, “Transformation-consistent self-ensembling model for semisupervised medical image segmentation,” IEEE Trans. Neural Netw. Learn. Syst., vol. 32, no. 2, pp. 523–534, Feb. 2021.

[7] K. Sohn et al., “FixMatch: Simplifying semi-supervised learning with consistency and confidence,” in Proc. Adv. Neural Inf. Process. Syst., vol. 33, 2020, pp. 596–608.

