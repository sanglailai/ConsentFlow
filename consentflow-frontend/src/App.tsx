// src/App.tsx

import { Routes, Route } from "react-router-dom";

// 页面组件
import Home from "./pages/Home";
import Preferences from "./pages/Preferences";
import Audit from "./pages/Audit";
import Compliance from "./pages/Compliance";

function App() {
  return (
    <Routes>
      {/* 首页：Cookie 弹窗 + 设置按钮 */}
      <Route path="/" element={<Home />} />

      {/* 偏好设置页面（可选入口） */}
      <Route path="/preferences" element={<Preferences />} />

      {/* 审计日志查看页 */}
      <Route path="/audit" element={<Audit />} />

      {/* 隐私合规说明页 */}
      <Route path="/compliance" element={<Compliance />} />
    </Routes>
  );
}

export default App;
