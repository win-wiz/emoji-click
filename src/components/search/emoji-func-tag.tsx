import { t } from "@lingui/macro";
import { memo } from "react";


const Kouyu = memo(function Kouyu() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">🌐</span>
      <h3>{t`支持各种口语表达`}</h3>
    </div>
  );
});

Kouyu.displayName = 'Kouyu';

const Multilingual = memo(function Multilingual() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">🔤</span>
      <h3>{t`支持多语言搜索`}</h3>
    </div>
  );
}); 

Multilingual.displayName = 'Multilingual';

const Emotional = memo(function Emotional() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">🧠</span>
      <h3>{t`理解情感语义`}</h3>
    </div>
  );
});

// 主组件
const EmojiFuncTag = memo(function EmojiFuncTag() {
  return (
    <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
      <Kouyu />
      <Multilingual />
      <Emotional />
    </div>
  );
});

EmojiFuncTag.displayName = 'EmojiFuncTag';

export default EmojiFuncTag;