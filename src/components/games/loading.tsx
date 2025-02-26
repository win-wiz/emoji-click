import { memo } from 'react';
import styles from './loading.module.css';

// 使用 useMemo 缓存文本内容
const loadingText = '加载中...' as const;

function LoadingComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 
          使用 translate3d 触发 GPU 加速
          使用 containment 优化渲染性能
        */}
        <div 
          className={styles.spinner} 
          aria-hidden="true"
          style={{ 
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout style paint'
          }} 
        />
        <p className={styles.text} role="status">{loadingText}</p>
      </div>
    </div>
  );
}

// 使用 memo 包装组件，因为这是一个纯展示组件，不需要重复渲染
export default memo(LoadingComponent, () => true); 