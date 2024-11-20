// components/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="inline-flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Processing...
    </div>
  );
}
