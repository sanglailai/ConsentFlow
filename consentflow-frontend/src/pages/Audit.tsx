import { useEffect, useState } from "react";

type LogEntry = {
  user_id: string;
  consent_type: string;
  status: string;
  timestamp: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/consent-logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("日志加载失败:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📝 用户同意审计日志</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">用户 ID</th>
            <th className="p-2">类型</th>
            <th className="p-2">状态</th>
            <th className="p-2">时间戳</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{log.user_id}</td>
              <td className="p-2">{log.consent_type}</td>
              <td className="p-2">{log.status === "accepted" ? "✅ 同意" : "❌ 拒绝"}</td>
              <td className="p-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
