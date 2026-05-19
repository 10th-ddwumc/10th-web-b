interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full text-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40"
    >
      +
    </button>
  );
}