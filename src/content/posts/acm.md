---
title: ACM MM 2026
published: 2026-03-25 18:36:00
expires: 2026-08-21 23:59:59
description: "ACM模板调整"
category: ACM
tags: [ACM]
---

删除图中的1，2处信息：
![](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/SUBm/0X0/0343OU8U2bnH3EimkML1mH.webp)

```tex
% Removes citation information below abstract
\settopmatter{printacmref=false} 
% removes footnote with conference information in first column
\renewcommand\footnotetextcopyrightpermission[1]{} 
% removes running headers
\pagestyle{plain} 

```

删除acmSubmissionID后面的```*```，注释\authornotemark[1]，大概138行左右
```tex
%\authornotemark[1]
```










