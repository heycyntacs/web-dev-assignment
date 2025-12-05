import Test from '@/components/test';
import Loading from '@/components/common/loading';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <Test />
    </Suspense>
  );
}
