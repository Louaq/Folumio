---
title: BraTs2019数据集处理及python读取.nii文件
published: 2025-08-12 21:05:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "BraTs数据集"
category: BraTs数据集
tags: [BraTs数据集]
---

## 数据集

BraTS 是MICCAI脑肿瘤分割比赛的数据集，BraTs 2018中的训练集( training set) 有285个病例
每个病例有四个模态(t1、t2、flair、t1ce)，需要分割三个部分：whole tumor(WT), enhance tumor(ET), and tumor core(TC)，相当于三个label。
每例病例中包含4种模态的MRI序列和1个seg文件,所有序列尺寸全部为(240, 240, 155)，如下图：  
![在这里插入图片描述](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/3Stw/0X0/0343OUPBHWoC5681DzWwTp.webp)

MR图像属性信息：（240x240x155）一个MR序列有155张图片，每张图片的大小为240x240

## HGG、LGG

BraTs训练集( training set) 又划分为HGG和LGG,他们分别表示:  
**HGG :高级别胶质瘤（WHO3～4级）** 为低分化胶质瘤；这类肿瘤为恶性肿瘤，患者预后较差。  
**LGG :低级别胶质瘤（WHO1～2级）** 为分化良好的胶质瘤；虽然这类肿瘤在生物上并不属于良性肿瘤，但是患者的预后相对较好。

> **Domain shift 域转移**  
> 即试图将学习的模型应用于与训练数据(源域)分布不同的测试数据(目标域)上，其性能会下降。由于医学图像多模态，数据域偏移的情况更加自然和严重。如下图所示，不同的医学图像（核磁共振（MR)成像和计算机断层扫描（CT））可以看到两幅图像的心脏区域在视觉上明显不同。毫无疑问的是，网络在MR图像上进行训练后不能用于CT图像上的测试。  
> ![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/361793728e77ba4f81e9fa2a4b26c188.png)

## 多模态

多模态通俗地讲就是一个东西可以有多种不同的形态表现，个人理解四个模态就相当于channels。BraTs数据集中有t1、t2、t1ce、flair四个模态，而在医学界，把像 t1、t2、t1ce、flair这样的称为序列,一个病例的可以有多个序列,每个序列由许多切片组成, 此外,获得每种序列的方式不同,例如t1、t2是由于测量电磁波的物理量不同而产生的两种不同的序列,再例如t1ce序列要在做MR之前往血液打造影剂.

## nii格式数据

标准NIFTI图像的扩展名是.nii，也包含了头文件及图像资料，NIFTI格式也可使用独立的图像文件（.img）和头文件（.hdr）。  
**nii图像为三维图像，进行切片后分别表示  
矢量面Median sagittal section (人体从前向后切开)  
冠状面coronal section (人体沿左向右切开)  
水平面Transverse section**  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/1c71bfc511b80e8dbecddb1063ae4cc7.png)

## 读取nii文件方法

### 2.利用代码进行解析

**2.1 安装torchio**

```bash
pip install torchio
AI写代码python运行1
```

读取文件并显示图片(以下仅读取t1)：

```python
import torchio as tio
t1_path = 'BraTS19_2013_2_1_t1.nii.gz'
t1_img = tio.ScalarImage(t1_path)
t1_img.plot()
```

t1显示如下：  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/3565edad611614d765c5f18680583840.png)

**2.2 安装nibabel：**

```bash
pip install nibabel
```

读取文件并显示图片(以下仅读取t1)：

```python
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np
img = nib.load('BraTS19_2013_2_1_flair.nii.gz')
print(img.shape)        # shape(240, 240, 155)
print(img.header['db_name']) 
width, height, queue = img.dataobj.shape    # 由文件本身维度确定，可能是3维，也可能是4维 
#print("width",width)  # 240
#print("height",height) # 240
#print("queue",queue)   # 155
nib.viewers.OrthoSlicer3D(img.dataobj).show()

num = 1
for i in range(0,queue,10):
 
    img_arr = img.dataobj[:,:,i]
    plt.subplot(5,4,num)
    plt.imshow(img_arr,cmap='gray')
    num +=1
 
plt.show()
```

显示图片如下：*（如果是黑色，鼠标拖动一下图片或者动一下滚轮，可能是坐标在原点）*  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/383a27fe5b998e62881b627bcc20ed64.png)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/ae90cda8e929faa17e89aed401044ca8.png)

两种方式好像第二种会显示的的是3D的，更多态化一点，光是看一下数据长什么样子的话，两种方式都能用

### T1加权、T2加权

MRI扫描方式可以简单的划分为常规扫描和功能扫描两大类。常规扫描主要反映解剖形态；功能扫描则以不同方式反映人体新陈代谢、血液流动等功能信息。  
**T1加权（T1 Weighted）和T2加权（T2 Weighted）是最常用，也是最基础的常规扫描。几乎所有的临床MRI检查都会包含T1加权和T2加权扫描。这里的“加权”，就是突出的意思。**

**T1看结构**

T1图像的整体感官跟“临床图像”的“习惯配色风格”非常接近,你看白质是白的,灰质是灰的,脑脊液是黑的.所以T1图像就可以看出各种断层解剖图.于是“T1看解剖结构”的说法就这么来了.

**T2看病变**

T2信号跟水含量有关(而Flair是结合水)很多病灶的T2信号要强于周围的正常组织.而很多病变都伴随组织水肿.从下图中可以看到,非常白的是水肿,然后比较白的那块影影约约的就是病变(红色)的地方了.  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/76f9af39dca5f18ef8a0cd485dd9a11d.png)

如下图所示，左：T1加权图像 右：T2加权图像  
T1加权突出显示解剖结构，T2加权则能够突出显示病灶  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/c060f70ebac1fd8d70fab3cea10a690b.png)

### T1CE

t1ce序列要在做MR之前往血液打造影剂(颜料),**亮的地方血供丰富**,强化明显说明血流很丰富,什么地方需要血流很快呢?**肿瘤嘛~它们不断分裂需要大量的营养.**  
下图所示, **蓝色区域是增强瘤(enhancing tumor),它环绕的里面绿色那些是坏疽(ju)(necrotic components),坏疽就是细胞坏死然后液化.所以这些坏疽还被被称为非增强瘤(non-enhancing tumor).**  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/7e6911952c9ee327e5eb42e35dde0493.png)

### Flair

FLAIR序列是核磁共振(MR)的一种常用的序列，全称是液体衰减反转回复序列，也称为水抑制成像技术. 通俗地说,它是压水像。在该序列上，脑脊液呈现低信号(暗一些)，实质性病灶和含有结合水的病灶显示为明显的高信号(亮一些)  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/803d8fd6791236b331a58ff404df5820.png)

### 分割部分WT、ET、TC

下图是Brats的数据集的一个序列的病例\[颜色标签和上面那些图无关\],我通过ITK-SNAP导入flair序列以及对应的分割标签, 需要分割有三个部分,分别是WT、ET、TC.  
![在这里插入图片描述](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/fbd1e73394ba9ccd7edf12beb79e0660.png)  
**数据集规定, 图中绿色为浮肿区域(ED,peritumoral edema) (标签2)、黄色为增强肿瘤区域(ET,enhancing tumor)(标签4)、红色为坏疽(NET,non-enhancing tumor)(标签1)、背景(标签0)**

然后这些标签合并为3个嵌套的子区域:  
**whole tumor (WT) --------包含所有labels（红+黄+绿）  
tumor core (TC) --------- 红色+黄色label  
enhancing tumor (ET) -------黄色label**

**即 WT = ED + ET + NET  
TC = ET+NET  
ET**

转载自CSDN：https://blog.csdn.net/qq_42740834/article/details/124473611