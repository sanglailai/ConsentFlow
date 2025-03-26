import { useState, useEffect } from "react";

// 生成/获取本地用户 ID
const getUserId = () => {
  let userId = localStorage.getItem("consent_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("consent_user_id", userId);
  }
  return userId;
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(true);
  const [userId, setUserId] = useState("");

  // 初始化用户 ID
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  const handleConsent = async (type: string, status: string) => {
    await fetch("http://localhost:8000/submit-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        consent_type: type,
        status: status,
      }),
    });
  };

  const acceptAll = async () => {
    await handleConsent("ads", "accepted");
    await handleConsent("analytics", "accepted");
    alert("✅ 您已接受所有可选 cookie。偏好已记录。");
    setVisible(false);
  };

  const rejectAll = async () => {
    await handleConsent("ads", "rejected");
    await handleConsent("analytics", "rejected");
    alert("❌ 您已拒绝所有可选 cookie。偏好已记录。");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 shadow-lg flex justify-between items-center z-50">
      <p className="text-sm">我们使用 cookies 来提升用户体验，你同意吗？</p>
      <div className="flex gap-2">
        <button className="bg-green-500 px-4 py-1 rounded" onClick={acceptAll}>
          接受
        </button>
        <button className="bg-yellow-500 px-4 py-1 rounded" onClick={rejectAll}>
          拒绝
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
