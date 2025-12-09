import { useQuery } from '@tanstack/react-query';

export default function Test() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/health');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      return await response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data.message}</div>;
}
