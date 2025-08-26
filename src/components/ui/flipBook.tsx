import HTMLFlipBook from 'react-pageflip'
import { useEffect, useState } from 'react';
import { preloadImages } from '@/lib/preloadImages';

// Интерфейс для пропсов компонента
interface FlibBookProps {
  width: number;
  height: number;
  scale?: number;
}

// Массив с картинками для страниц книги
const bookPages = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/1200x800?text=Page+1',
    title: 'Страница 1'
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/1200x800?text=Page+2',
    title: 'Страница 2'
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/1200x800?text=Page+3',
    title: 'Страница 3'
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/1200x800?text=Page+4',
    title: 'Страница 4'
  },
  {
    id: 5,
    imageUrl: 'https://placehold.co/1200x800?text=Page+5',
    title: 'Страница 5'
  },
  {
    id: 6,
    imageUrl: 'https://placehold.co/1200x800?text=Page+6',
    title: 'Страница 6'
  }
];

export default function FlibBook({ width, height, scale = 1 }: FlibBookProps) {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Предварительная загрузка всех картинок для книги
  useEffect(() => {
    const imageUrls = bookPages.map(page => page.imageUrl);
    
    preloadImages(imageUrls)
      .then(() => {
        console.log('Все картинки для FlipBook загружены');
        setImagesLoaded(true);
      })
      .catch((error) => {
        console.error('Ошибка загрузки картинок для FlipBook:', error);
        setImagesLoaded(true); // Показываем книгу даже при ошибке
      });
  }, []);

  // Показываем загрузку, пока картинки не загружены
  if (!imagesLoaded) {
    return (
      <div 
        className="flib-book-container"
        style={{
          width: width,
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}
      >
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div>Загрузка книги...</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>Подождите, страницы загружаются</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flib-book-container"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <HTMLFlipBook 
        width={scaledWidth} 
        height={scaledHeight} 
        size="stretch"
        minWidth={scaledWidth * 0.8}
        maxWidth={scaledWidth * 1.2}
        minHeight={scaledHeight * 0.8}
        maxHeight={scaledHeight * 1.2}
        showCover={false}
        flippingTime={1000}
        usePortrait={false}
        startPage={0}
        drawShadow={true}
        className="demo-book"
        style={{ margin: '0 auto' }}
        {...({} as any)}
      >
        {bookPages.map((page) => (
          <div key={page.id} className="demoPage" data-density="soft">
            <div 
              className="page-content"
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${page.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div 
                className="page-title"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {page.title}
              </div>
            </div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}