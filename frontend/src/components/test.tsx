import { useSuspenseQuery } from '@tanstack/react-query';

export default function Test() {
  const { data } = useSuspenseQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      return response.json();
    },
  });

  return <div>{data.message}</div>;
}
