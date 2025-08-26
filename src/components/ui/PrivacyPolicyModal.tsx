import React from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const PrivacyPolicyContent: React.FC = () => (
  <div className="p-8 text-lg max-w-[1400px] mx-auto w-full">
    <div className="text-4xl font-bold text-center text-accent mb-8">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</div>
    <p>НАСТОЯЩАЯ ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ОПРЕДЕЛЯЕТ ПОРЯДОК ОБРАБОТКИ И ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ ФИЗИЧЕСКИХ ЛИЦ, ПОЛЬЗУЮЩИХСЯ СЕРВИСАМИ САЙТА SHELF (ДАЛЕЕ – КОМПАНИЯ).</p>
    <h3 className="text-accent mt-6 text-xl font-bold">1. Общие положения</h3>
    <p>1.1. Настоящая Политика является официальным документом Компании и определяет порядок обработки и защиты информации о физических лицах, пользующихся услугами сайта SHELF.</p>
    <p>1.2. Целью настоящей Политики является обеспечение надлежащей защиты информации о пользователях, в том числе их персональных данных, от несанкционированного доступа и разглашения.</p>
    <h3 className="text-accent mt-6 text-xl font-bold">2. Собираемая информация</h3>
    <p>2.1. Компания собирает следующую информацию о пользователях:</p>
    <ul className="list-disc ml-8">
      <li>Имя</li>
      <li>Номер телефона</li>
      <li>Адрес электронной почты</li>
      <li>Адрес для выполнения работ</li>
    </ul>
    <h3 className="text-accent mt-6 text-xl font-bold">3. Цели сбора и обработки</h3>
    <p>3.1. Компания собирает и хранит только ту персональную информацию, которая необходима для предоставления сервисов сайта.</p>
    <p>3.2. Персональная информация пользователя используется в следующих целях:</p>
    <ul className="list-disc ml-8">
      <li>Оказание услуг по сборке мебели</li>
      <li>Осуществление клиентской поддержки</li>
      <li>Информирование о новых услугах и акциях</li>
      <li>Улучшение качества предоставляемых услуг</li>
    </ul>
    <h3 className="text-accent mt-6 text-xl font-bold">4. Защита информации</h3>
    <p>4.1. Компания принимает все необходимые организационные и технические меры для защиты персональной информации пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий с ней третьих лиц.</p>
    <h3 className="text-accent mt-6 text-xl font-bold">5. Изменение и удаление информации</h3>
    <p>5.1. Пользователь может в любой момент изменить (обновить, дополнить) предоставленную им персональную информацию или её часть, обратившись в Компанию.</p>
    <p>5.2. Пользователь также может удалить предоставленную им в рамках определенной учетной записи персональную информацию, обратившись в Компанию по телефону <a href="tel:+79219992200" className="text-accent underline">+7 (921) 999-22-00</a>.</p>
    <h3 className="text-accent mt-6 text-xl font-bold">6. Контакты</h3>
    <p>6.1. По всем вопросам, связанным с настоящей Политикой, пользователи могут обращаться в Компанию по следующим контактным данным:</p>
    <ul className="list-disc ml-8">
      <li>Телефон: <a href="tel:+79219992200" className="text-accent underline">+7 (921) 999-22-00</a></li>
      <li>Email: <a href="mailto:shelf.sborka.spb@gmail.com" className="text-accent underline">shelf.sborka.spb@gmail.com</a></li>
      <li>Адрес: г. Санкт-Петербург, Большой пр. В.О. 80</li>
    </ul>
  </div>
);

export default function PrivacyPolicyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'hsla(var(--background) / 0.85)', // Use theme variable for background
            backdropFilter: 'blur(5px)', // Added backdrop-filter
            zIndex: 200000, // Ensure it's above other content
            display: 'flex',
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            transition: 'background 0.3s, opacity 0.3s', // Added opacity transition
            opacity: open ? 1 : 0, // Control opacity for fade in/out
          }}
        >
          <div
            style={{
              background: 'hsl(var(--card))', // Use theme variable
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              color: 'hsl(var(--card-foreground))', // Use theme variable
              animation: 'modalSlideUpFull 0.5s cubic-bezier(.4,1,.7,1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '90vw',
              height: '80vh',
              maxHeight: '80vh',
              borderRadius: 'var(--radius)', // Use theme radius
              padding: '0',
              position: 'relative', // For absolute positioning of close button
              overflow: 'hidden', // Prevent content overflow from breaking layout before scroll kicks in
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(var(--border))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--accent))',
                  cursor: 'pointer',
                  padding: '1rem', // Increased padding for larger clickable area
                  lineHeight: 1,
                }}
                aria-label="Закрыть политику"
              >
                <X size={28} />
              </button>
            </div>
            <div className="pp-scroll" style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <PrivacyPolicyContent />
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes modalSlideUpFull {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* Hide scrollbars inside privacy policy modal content */
        .pp-scroll::-webkit-scrollbar { display: none; }
        .pp-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Dialog>
  );
}
