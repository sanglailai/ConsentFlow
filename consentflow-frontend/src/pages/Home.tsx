
import { Link } from "react-router-dom";
import CookieBanner from "../components/CookieBanner";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ConsentFlow 同意管理系统 PoC
      </h1>

      <p className="text-gray-700 text-center max-w-xl mb-6">
        本系统用于模拟隐私同意采集流程，支持记录用户的 Cookie 偏好、记录合规日志，并符合 GDPR 第 7 条、第 13 条与第 30 条的合规要求。
      </p>

      <div className="flex space-x-4">
        <Link
          to="/preferences"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          设置偏好
        </Link>
        <Link
          to="/audit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          查看审计日志
        </Link>
        <Link
          to="/compliance"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          合规说明
        </Link>
      </div>

      {/* 显示 Cookie 弹窗 */}
      <CookieBanner />
    </div>
  );
};

export default Home;
