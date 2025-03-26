// frontend/src/pages/Compliance.jsx
import { Link } from 'react-router-dom';

const Compliance = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-4">隐私合规说明</h1>

      <p className="mb-4">
        本页面用于说明我们如何收集、使用和保护您的个人数据，确保符合
        <strong>《欧盟通用数据保护条例》（GDPR）</strong> 的要求。
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📌 我们收集哪些数据？</h2>
      <ul className="list-disc list-inside mb-4">
        <li>功能性 Cookie（提升用户体验）</li>
        <li>营销 Cookie（广告推荐和效果分析）</li>
        <li>偏好设置记录（用于记住您的选择）</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">📜 合规依据（GDPR）</h2>
      <ul className="list-disc list-inside mb-4">
        <li>第7条：同意应明确、自由、可随时撤回</li>
        <li>第13条：用户有权知晓其数据的用途和收集目的</li>
        <li>第30条：我们有义务记录数据处理活动（如同意记录）</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">🛠️ 您的权利</h2>
      <ul className="list-disc list-inside mb-4">
        <li>可随时修改或撤销您的同意设置</li>
        <li>有权访问、删除、限制处理您的个人数据</li>
        <li>可通过偏好设置页面更改同意类型</li>
      </ul>

      <Link to="/" className="text-blue-600 underline">返回首页</Link>
    </div>
  );
};

export default Compliance;
