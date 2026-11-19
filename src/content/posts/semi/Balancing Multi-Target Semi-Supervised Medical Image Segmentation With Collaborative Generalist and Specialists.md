---
title: Balancing Multi-Target Semi-Supervised Medical Image Segmentation With Collaborative Generalist and Specialists
published: 2026-01-23 15:53:00
expires: 2026-01-31 23:59:59
description: "尽管当前的半监督模型在单个医学目标分割任务中表现优异"
category: 半监督医学图像分割
tags: [TMI]
---

::github{repo="wangyou0804/CGS"}

:::note
本文提出了一个新的出发点：尺度不平衡、出现频率不平衡
:::

## 摘要

Despite the promising performance achieved by current semi-supervised models in segmenting individual medical targets, many of these models suffer a notable decrease in performance when tasked with the simultaneous segmentation of multiple targets.A vital factor could be attributed to the imbalanced scales among different targets: during simultaneously segmenting multiple targets, large targets dominate the loss, leading to small targets being misclassified as larger ones. To this end, we propose a novel method, which consists of a Collaborative Generalist and several Specialists, termed CGS. It is centered around the idea of employing a specialist for each target class, thus avoiding the dominance of larger targets. The generalist performs conventional multi-target segmentation, while each specialist is dedicated to distinguishing a specific target class from the remaining target classes and the background. Based on a theoretical insight, we demonstrate that CGS can achieve a more balanced training. Moreover, we develop cross-consistency losses to foster collaborative learning between the generalist and the specialists. Lastly, regarding their intrinsic relation that the target class of any specialized head should belong to the remaining classes of the other heads, we introduce an inter-head error detection module to further enhance the quality of pseudo-labels. Experimental results on three popular benchmarks showcase its superior performance compared to state-of-the-art methods. Our code is available at https://github.com/wangyou0804/CGS.

## 翻译

尽管当前的半监督模型在单个医学目标分割任务中表现优异，但面对多个目标同时分割任务时，很多模型的性能显著下降。一个关键因素可能是由于不同目标之间尺度不平衡：在同时分割多个目标时，大目标主导了损失，导致小目标被误分类为较大的目标。为了应对这一问题，我们提出了一种新方法，称为CGS，由一个协同通用体和多个专家组成。其核心思想是为每个目标类别配备一个专家，从而避免大目标的影响。通用体执行常规的多目标分割，而每个专家则专注于将特定目标类别与剩余目标类别和背景区分开来。基于理论见解，我们证明了CGS可以实现更平衡的训练。此外，我们开发了交叉一致性损失，以促进通用体和专家之间的协同学习。最后，考虑到任何专用头的目标类别都应属于其余头部的剩余类别，我们引入了一个头部间错误检测模块，以进一步提高伪标签的质量。我们在三个流行的基准测试上的实验结果显示，与最新的方法相比，该方法性能优越。我们的代码可以在 https://github.com/wangyou0804/CGS 找到。

## 研究背景

![Snipaste_2026-01-23_16-02-12](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/KNDm/0X0/0343OUJG4QSEMqKuIKrsna.webp)

前半监督医学图像分割模型在单目标分割中表现出良好性能，但在多目标同时分割时性能显著下降。关键原因在于不同目标间的尺度不平衡：多目标分割中，大目标主导损失函数，导致小目标被误分类为大目标。

医学图像标注成本高、主观性强，半监督方法可缓解标注数据稀缺问题，但现有方法忽视类别间干扰。医学图像中多器官/组织常同时出现，**尺度不平衡**而非**出现频率不平衡**是主要问题——不同目标尺寸差异大，**大目标在训练中占据主导，导致小目标分割性能差。**在半监督场景下，有限标注数据无法缓解此问题，而全监督中充足标注可部分抵消尺度不平衡影响。因此，亟需针对多目标半监督医学图像分割的尺度不平衡问题开发新方法。

## 研究现状

1. **半监督医学图像分割（SSMIS）**
   - 主流方法依赖一致性正则化（如Mean Teacher）和伪标签技术（如FixMatch），在单目标分割中性能优异。
   - 多目标分割需同时处理多个器官/组织，但现有模型因**尺度不平衡**（大目标主导损失，小目标易被误分类）导致性能下降。
2. **多目标分割挑战**
   - 医学图像中不同目标尺度差异显著（如SegTHOR数据集中心脏与食道），半监督场景下标注数据稀缺，加剧小目标学习不足。
   - 现有方法（如MagicNet、DHC）未充分解决尺度不平衡，多依赖复杂3D架构或特征级融合，泛化性有限。

## 提出的模型

![Snipaste_2026-01-23_16-02-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ohnH/557X552/6N1SvYaI5T29nfePmJBcjJ.png)

![Snipaste_2026-01-23_16-03-41](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/TIB0/1137X534/17YaaUARIhT432VcYWZq8x.png)

CGS由两部分组成：

- **通用分支（Generalist）**：执行传统的多目标分割任务，输出所有目标类别的联合预测。
- **多专家分支（Specialists）**：为每个目标类别分配一个专家头（Specialist Head），每个专家头专注于区分**特定目标类别**与**其他所有目标类别及背景**（而非仅区分目标与背景）。

#### **（1）专家头的标签重定义**

为缓解尺度不平衡，每个专家头将原始标签重定义为三类：

- **目标类别**（当前专家负责的类别）；
- **剩余类别**（其他所有目标类别）；
- **背景**。
  通过这种设计，每个小目标类别在其专属专家头中成为“主角”，避免被大目标主导。

#### **（2）理论上的平衡训练保证**

通过数学推导证明，CGS能使各目标类别的训练参与比例更均衡。对于第$i$类目标，其训练参与比例$p_{i}^{,}$满足：
$$|p_i'-\frac{1}{K}|\leq|p_i-\frac{1}{K}|,$$

#### **（3）跨一致性损失（Cross-Consistency Losses）**

促进通用分支与专家分支的协作学习：

- **双向一致性损失**：通用分支与专家分支互为主导，为对方提供伪标签监督；
- **共识一致性损失**：强化两分支在高置信区域的预测一致性。

#### **（4）头间误差检测模块（Inter-Head Error Detection, IHED）**

利用专家头间的逻辑约束过滤伪标签噪声：

- 若某像素被专家头i标记为目标类别，则其他所有专家头必须将其标记为“剩余类别”；
- 否则该像素被判定为错误预测并过滤。

## 实验（Compared with SOTA）



> 1. **ACDC数据集**
>    - **任务**：三目标分割（右心室、左心室、心肌）
>    - **数据规模**：100例患者CT扫描，按7:1:2划分为训练/验证/测试集，图像 resize 至224×224。
> 2. **SegTHOR数据集**
>    - **任务**：四目标分割（心脏、主动脉、气管、食道）
>    - **数据规模**：28例训练、4例验证、8例测试，3D体积转为2D切片后 resize 至224×224。
> 3. **Synapse数据集**
>    - **任务**：八目标腹部器官分割（如肾脏、肝脏等），存在显著类别不平衡。
>    - **数据规模**：18例训练、12例测试，切片 resize 至224×224。



> 1. **评价指标**
>    - **主要指标**：3D Dice相似系数（DSC）、Jaccard指数、95% Hausdorff距离（95HD）、平均表面距离（ASD）。
>    - **辅助分析**：不同类别性能对比、伪标签质量评估。
> 2. **训练配置**
>    - **网络架构**：以UNet为基础，添加K个专家分支（K为目标类别数），推理时仅保留通用分支。
>    - **优化器**：SGD（动量0.9，权重衰减1e-4），初始学习率0.01，批大小24（12标注+12未标注）。
>    - **数据增强**：弱增强（裁剪、旋转、翻转）、强增强（颜色抖动、CutMix）。
>    - **超参数**：置信阈值τ=0.9，损失平衡系数λ采用ramp-up策略（最大值2.0）。



在三个数据集上与13种半监督分割方法（如UA-MT、FixMatch、MagicNet等）对比，结果如下：

- **ACDC（5%/10%标注数据）**：CGS的DSC分别为88.83%/89.83%，超越所有对比方法，尤其提升小目标（如右心室）分割精度。
- **SegTHOR（10%/20%标注数据）**：CGS在所有指标（DSC、Jaccard、95HD、ASD）上均显著领先，例如DSC比SOTA方法高3.2%。
- **Synapse（3例标注数据）**：CGS的平均DSC达85.6%，对小器官（如食道）的分割性能提升明显，且优于SAM等大模型。

![Snipaste_2026-01-23_16-10-02](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wIw3/1141X425/5QnLBws2SXd4XtgnwAg4cL.png)

![Snipaste_2026-01-23_16-10-17](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/yzd2/1102X302/4UiRAERFk9IN9wruc1E9ZE.png)



:::note

这里不在展示所有实验

:::

## 实验（Ablation Experiments）​​

验证各模块（专家分支、交叉一致性损失、头间误差检测IHED）的贡献：

- **专家分支（SSH）vs 传统二值分支（BSH）**：SSH在ACDC上提升DSC 2.1%，SegTHOR上提升1.8%，证明其缓解尺度不平衡的有效性。
- **交叉一致性损失（Lc）**：引入后ACDC的DSC提升1.5%，SegTHOR提升1.2%，增强通用分支与专家分支的协同学习。
- **IHED模块**：过滤错误伪标签，ACDC的DSC进一步提升0.8%，SegTHOR提升0.6%。

#### **3. 扩展性与鲁棒性实验**

- **不同骨干网络**：将UNet替换为TransUNet，CGS仍比基线提升2.3% DSC，验证架构无关性。
- **高分辨率图像**：输入分辨率提升至384×384时，CGS性能保持优势（DSC下降<1%）。
- **参数与效率**：训练时仅增加0.12%参数，推理时无额外开销，GPU内存占用增加<5%。

#### **4. 其他分析**

- **阈值τ影响**：τ=0.9时性能最优，过高导致数据不足，过低引入噪声伪标签。
- **类别级性能**：对小目标（如SegTHOR中的食道）的DSC提升达5.7%，证明缓解尺度不平衡的有效性。
- **与集成方法对比**：CGS性能优于4个基线模型的集成结果（Avg/Conf/Vot策略），且计算成本更低。

![Snipaste_2026-01-23_16-12-14](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/mwoS/571X269/0HQ49sdZTGZD5phvy2QIST.png)

## 结论

本文针对多目标半监督医学图像分割中的尺度不平衡问题，提出了一种名为CGS（Collaborative Generalist and Specialists）的新方法。该方法包含一个通用分支（Generalist）和多个专用分支（Specialists），通过为每个目标类别分配一个专用分支来避免大目标主导训练过程。通用分支执行常规的多目标分割，而每个专用分支专注于区分特定目标类别与其他目标类别及背景。

基于理论分析，CGS能够实现更平衡的训练。此外，研究人员开发了交叉一致性损失以促进通用分支和专用分支之间的协作学习，并引入了头间错误检测模块（Inter-Head Error Detection, IHED）来进一步提高伪标签的质量。

实验结果表明，CGS在ACDC、SegTHOR和Synapse三个流行基准数据集上均表现出优于现有最先进方法的性能。例如，在ACDC数据集上，使用3个标记扫描时，DSC（Dice相似系数）从87.27%提升至88.83%；使用7个标记扫描时，DSC从88.89%提升至89.83%。该方法能够有效缓解尺度不平衡问题，提升多目标半监督医学图像分割的准确性和稳定性。





