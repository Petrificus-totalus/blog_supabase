import { useState } from "react";

export default function CopyText({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div>
      <button onClick={handleCopy}>复制</button>
      {copied && <span>✅ 已复制!</span>}
    </div>
  );
}
