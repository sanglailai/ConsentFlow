import { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // 引入 Link

type Preferences = {
  necessary: boolean;
  functional: boolean;
  marketing: boolean;
};

const Preferences = () => {
  const [prefs, setPrefs] = useState<Preferences>({
    necessary: true,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("consentPreferences");
    if (stored) {
      setPrefs(JSON.parse(stored));
    }
  }, []);

  const handleChange = (type: keyof Preferences) => {
    setPrefs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const savePreferences = async () => {
    localStorage.setItem("consentPreferences", JSON.stringify(prefs));

    const consentTypes: { [key: string]: string } = {
      functional: "功能 Cookie",
      marketing: "广告 Cookie",
    };

    for (const type of Object.keys(consentTypes)) {
      const status = prefs[type as keyof Preferences] ? "accepted" : "rejected";
      await fetch("http://localhost:8000/submit-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id") || "anonymous",
          consent_type: type,
          status,
        }),
      });
    }

    alert("✅ 偏好设置已保存！");
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Cookie 偏好设置</h2>

      <div className="mb-4">
        <label className="flex items-center">
          <input type="checkbox" checked={prefs.necessary} disabled className="mr-2" />
          必要 Cookie（始终启用）
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={prefs.functional}
            onChange={() => handleChange("functional")}
            className="mr-2"
          />
          功能性 Cookie（提升使用体验）
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={prefs.marketing}
            onChange={() => handleChange("marketing")}
            className="mr-2"
          />
          营销 Cookie（广告推荐和重定向）
        </label>
      </div>

      <button
        onClick={savePreferences}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        保存偏好设置
      </button>

      {/* 返回首页按钮 */}
      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-600 underline">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default Preferences;
