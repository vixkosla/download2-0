import React from "react";

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
}

export class HydrationErrorBoundary extends React.Component<HydrationErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    if (
      error.message.includes("Hydration failed") ||
      error.message.includes("didn't match the client")
    ) {
      return { hasError: true, error };
    }
    return { hasError: false, error: null };
  }

  componentDidCatch(error: Error, info: any) {
    // Можно логировать ошибку
    console.error("Hydration error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Произошла ошибка гидрации. Пожалуйста, обновите страницу.</div>;
    }
    return this.props.children;
  }
}
