# 塔罗与心理自我反思知识库（第 1 版）

本知识库服务于免费、离线的自我反思体验。它不把塔罗当成心理测评、诊断或治疗。程序只引用本库中已经核对过的开放资料与自行编写的提示；未获得全文的现代著作仅列为后续阅读书目。

## 已核对并使用的资料

| 来源 | 可核对文本 | 提炼到产品里的方法 | 边界 |
| --- | --- | --- | --- |
| A. E. Waite, *The Pictorial Key to the Tarot* (1910) | [Wikisource 原文](https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot) | 牌是象征和解释的素材；解读明确区分牌面、位置与提问 | 历史塔罗文本，不是心理科学证据；本站的中文牌义是独立编写，不是逐字译本 |
| OpenStax, *Psychology 2e* | [压力概述](https://openstax.org/books/psychology-2e/pages/14-1-what-is-stress)、[压力调节](https://openstax.org/books/psychology-2e/pages/14-4-regulation-of-stress) | 区分压力源、感受和应对；建议回到自己可控制的下一步 | 教材不支持用塔罗诊断心理状况 |
| WHO, *Doing What Matters in Times of Stress* (2020) | [WHO 出版页](https://www.who.int/publications/i/item/9789240003927) | 压力很强时，先暂停、注意当下，再选择一件小而可行的事 | 只作为普遍自助提示，不宣称能替代医疗或心理服务 |

## 已确认书目，尚未纳入产品知识

| 书籍 | 状态 |
| --- | --- |
| Rachel Pollack, *Seventy-Eight Degrees of Wisdom* | [Open Library 书目](https://openlibrary.org/works/OL106545W)已核实；未获取可复用全文，未提炼书中具体牌义 |
| Mary K. Greer, *Tarot for Your Self* | [Open Library 书目](https://openlibrary.org/works/OL3495066W)已核实；未获取可复用全文，未提炼书中练习 |
| William R. Miller & Stephen Rollnick, *Motivational Interviewing* | [Open Library 书目](https://openlibrary.org/works/OL3507478W)已核实；未获取可复用全文，未把特定方法归于此书 |

## 可执行规则

1. **先理解问题**：识别关系、工作、选择、边界、沟通等关注点；同时留意焦虑、难过、愤怒等情绪词。无把握时明说“可能没抓准”，不能假装读懂。
2. **再看牌与牌位**：每张牌提供正逆位含义，牌位决定它在问题中的角色。牌不能证明对方的想法或未来结果。
3. **回应分层**：先回应问题和感受，再提供牌面视角；最后给一个自问问题和一个可选择的小行动。强烈压力下先给暂停与安顿提示。
4. **保持自主**：使用“可以”“也许”“如果愿意”等措辞，不替用户作决定，不把坏结果归咎于用户。
5. **风险边界**：遇到自伤、疾病诊断、法律裁定、投资指令等，不用塔罗给结论。优先提示现实支持。

## 资料与程序的对应关系

- `knowledge.mjs`：问题识别、情绪支持、行动提示及其来源编号。
- `core.mjs`：将知识规则与牌义、牌位结合。
- `core.test.mjs`：固定问题的贴合度与边界测试。

本库是对可访问资料的**简短方法提炼**，不包含书籍全文或大段翻译。更新任何规则时应补充可核对来源和测试问题。
