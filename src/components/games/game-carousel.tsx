import Image from "next/image";

export const runtime = 'edge';

// 类型定义
interface CarouselItem {
  id: string;
  url: string;
  alt: string;
}

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full aspect-video relative rounded-2xl overflow-hidden bg-gray-100",
    image: "object-cover object-center"
  }
} as const;

// 图片组件 - 纯展示
function CarouselImage({ item }: { item: CarouselItem }) {
  return (
    <Image
      src={item.url}
      alt={item.alt}
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      className={STYLES.container.image}
    />
  );
}

// 数据处理函数
function parseCarouselData(carouselJson: string): CarouselItem[] {
  if (!carouselJson) return [];

  try {
    const items = JSON.parse(carouselJson);
    if (!Array.isArray(items) || !items.length) return [];
    
    // 验证数组中的每个项目是否符合 CarouselItem 接口
    return items.filter((item): item is CarouselItem => 
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.url === 'string' &&
      typeof item.alt === 'string'
    );
  } catch (error) {
    console.error('Failed to parse carousel data:', error);
    return [];
  }
}

// 主组件
export function GameCarousel({ carousel }: { carousel: string }) {
  const items = parseCarouselData(carousel);

  // 确保至少有一个有效项目
  const firstItem = items[0];
  if (!firstItem) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <CarouselImage item={firstItem} />
    </div>
  );
}

export default GameCarousel;