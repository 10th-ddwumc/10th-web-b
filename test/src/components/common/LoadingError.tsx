// src/components/common/LoadingError.tsx
type LoadingErrorProps = {
  message?: string;
  onRetry: () => void;
};

const LoadingError = ({
  message = "데이터를 불러오지 못했어요.",
  onRetry,
}: LoadingErrorProps) => {
  return (
    <div className="loading-error">
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
};

export default LoadingError;