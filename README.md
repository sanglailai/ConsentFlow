# ConsentFlow 同意管理系统项目

## 一、项目背景与意义

随着数据隐私问题逐渐成为全球关注的焦点，欧盟通用数据保护条例（GDPR）等法律法规提出了严格的数据隐私保护要求。其中，明确的用户同意机制成为企业必须遵循的重要原则之一。然而，实际中仍存在许多企业的隐私管理做法并未完全满足法规要求，如默认勾选、未提供撤回机制、同意记录缺失等问题。

为了解决以上问题，我设计并实现了ConsentFlow项目，旨在演示如何将隐私合规策略工程化落地，体现隐私保护与用户体验（Privacy UX）的完美融合。

## 二、项目核心功能设计

### 2.1核心功能：

1. **Cookie Banner展示**：首次访问页面时，以醒目的弹窗提示用户选择Cookie类型。
2. **用户偏好设置页面**：提供清晰、易懂的界面，让用户自主选择必要（Necessary）、功能性（Functional）和广告追踪（Marketing）类的同意与否。
3. **审计日志记录与导出**：后端自动记录用户每次操作，并可提供给管理员审计导出。
4. **合规说明页面**：详细说明数据处理目的与合规法规依据，确保信息透明性。
5. **追踪脚本延迟执行机制**：明确用户同意前，禁止广告追踪等敏感脚本的执行。

### 2.2项目结构

```php
ConsentFlow/
│
├── backend/
│   └── [main.py](http://main.py/)                      # FastAPI 服务端逻辑
│
├── consentflow-frontend/
│   ├── components/
│   │   └── CookieBanner.tsx        # Cookie 弹窗组件
│   │
│   ├── pages/
│   │   ├── Home.tsx                # 首页（嵌入 CookieBanner）
│   │   ├── Preferences.tsx         # 偏好设置页
│   │   ├── Audit.tsx               # 审计日志查看页
│   │   └── Compliance.tsx          # 合规说明页
│   │
│   ├── App.tsx                     # 全局路由配置
│   ├── main.tsx                    # React 应用入口
│   ├── index.css                   # Tailwind 样式
│   └── App.css                     # 可选样式定义

```

### 2.3系统架构图（逻辑流程）

```
           +------------------------+
           |      浏览器前端        |
           |  React + Tailwind CSS |
           +------------------------+
                     |
     用户选择偏好 (点击按钮)
                     |
                     v
       +-----------------------------+
       |     ConsentFlow API 后端     |
       |  FastAPI + SQLite 数据库     |
       +-----------------------------+
                     |
        记录用户选择（user_id、偏好）
                     |
                     v
         +------------------------+
         |     consent.db 数据库   |
         |  存储所有审计日志记录   |
         +------------------------+

```

## 三、各个模块的功能讲解

我们按照实际功能模块，把系统拆解成 6 个关键部分进行解释：

---

### ① 用户界面（前端 UI）

**涉及文件**：

- `components/CookieBanner.tsx`
- `pages/Preferences.tsx`
- `pages/Audit.tsx`
- `pages/Compliance.tsx`

**作用**：

- **Cookie 弹窗**：用户一进入网站，会看到提示“我们使用 cookie，是否接受？”（在 `CookieBanner.tsx` 中实现）
- **设置页面**：点击“设置偏好”按钮后，跳转到 `/preferences` 页面，用户可选择启用/禁用某些类型的 cookie
- **审计页面**：管理员可打开 `/audit` 页面，查看所有用户的选择记录
- **合规说明页面**：展示 GDPR 法规内容，让用户知道自己的权利（例如第7条、13条）

---

### ② 偏好数据存储与加载（localStorage）

**技术：** `window.localStorage`

**作用**：

- 第一次访问时没有任何数据，会弹出 cookie banner
- 用户点击“接受 / 拒绝 / 设置”之后，前端会把偏好保存到 localStorage
- 每次刷新页面会自动读取本地保存的偏好设置

```
const stored = localStorage.getItem("consentPreferences");

```

---

### ③ 唯一用户标识（UUID）

**技术：** UUID + localStorage

**作用**：

- 模拟网站上“匿名用户”的 ID，记录到日志中
- 保证每个人的点击行为都有独立标识，便于审计

```
// 若 localStorage 中无用户 ID，则生成一个
if (!localStorage.getItem("userId")) {
  const uuid = crypto.randomUUID();  // 或用自定义 uuid 函数
  localStorage.setItem("userId", uuid);
}

```

---

### ④ 前端与后端的通信（Fetch + FastAPI）

**技术：** `fetch(...)` 发送 HTTP 请求，FastAPI 提供 `/submit-consent` 接口

**作用**：

- 用户每次点击“接受 / 拒绝”，会向后端发送一条 POST 请求
- 后端使用 Pydantic 验证参数结构（user_id, consent_type, status）

```
await fetch("http://localhost:8000/submit-consent", {
  method: "POST",
  body: JSON.stringify({ user_id, consent_type, status }),
});

```

---

### ⑤ 审计日志记录（后端 + 数据库）

**技术：** FastAPI + SQLAlchemy ORM + SQLite

**作用**：

- 后端将每次用户的选择（如 user_001 同意了 ads）写入数据库 `consent.db`
- 表结构定义在 `main.py` 中的 `ConsentLog` 类
- 每条记录包含：user_id, consent_type, status, timestamp

```
class ConsentLog(Base):
    __tablename__ = "consent_logs"
    user_id = Column(String)
    consent_type = Column(String)
    status = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

```

---

### ⑥ 审计数据导出与展示

**接口：**

- `/consent-logs`：查看所有记录
- `/audit/logs`（可选）：JSON 格式返回审计数据
- `/audit/export`（可选扩展）：导出为 CSV 表格文件，方便监管提交

**页面展示**：

- 在前端 `Audit.tsx` 中，使用 `useEffect()` 获取数据并用 `<table>` 渲染

---

### ✅ 简化流程总结（用户角度）

| 用户行为 | 前端行为 | 后端行为 | 合规意义 |
| --- | --- | --- | --- |
| 访问网站 | 弹出 CookieBanner | - | 实现默认非激活追踪，符合 GDPR“最小默认”原则 |
| 点击接受 | 保存偏好 + 调接口 | 写入数据库 | 明确同意，记录审计日志 |
| 拒绝或更改 | 更新 localStorage + 调接口 | 写入数据库 | 同样记录，符合“可随时撤回”原则 |
| 管理员查看日志 | `/audit` 页面拉取数据 | `/consent-logs` 返回 JSON | 满足 GDPR 第30条“记录处理活动”要求 |

---

## 四、项目部署与演示（截图可见screenshots/ ）

### 本地部署

- 启动前端
    
    ```bash
    npm run dev
    
    ```
    
- 启动后端
    
    ```bash
    uvicorn main:app --reload
    
    ```
    

参考资料：

- [GDPR全文](https://gdpr-info.eu/)
- [IAB TCF技术框架说明](https://iabeurope.eu/tcf-2-0/)

---

感谢阅读，欢迎留言交流！
