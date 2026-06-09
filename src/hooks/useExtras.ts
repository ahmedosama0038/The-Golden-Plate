import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { extraApi } from '@/lib/api';
import { CreateExtraDto } from '@/types';


export const useExtras = () => {
  const queryClient = useQueryClient();

  // 1. Hook لجلب كل الإضافات (للطباخ أو الداشبورد)
  const useGetAllExtras = () => {
    return useQuery({
      queryKey: ['extras'],
      queryFn: extraApi.getAll,
    });
  };

  // 2. Hook لجلب الإضافات المتاحة فقط (للزبون وهو بيطلب)
  const useGetAvailableExtras = () => {
    return useQuery({
      queryKey: ['extras', 'available'],
      queryFn: extraApi.getAvailable,
    });
  };

  // 3. Hook لإضافة إكسترا جديدة
  const useCreateExtra = () => {
    return useMutation({
      mutationFn: (data: CreateExtraDto) => extraApi.create(data),
      onSuccess: () => {
        // بيعمل ريفريش تلقائي للقائمة أول ما تضيف عشان تظهر علطول
        queryClient.invalidateQueries({ queryKey: ['extras'] });
      },
    });
  };

  // 4. Hook لتعديل إكسترا موجودة
  const useUpdateExtra = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: CreateExtraDto }) =>
        extraApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['extras'] });
      },
    });
  };

  // 5. Hook لمسح إكسترا تماماً
  const useDeleteExtra = () => {
    return useMutation({
      mutationFn: (id: string | number) => extraApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['extras'] });
      },
    });
  };

  return {
    useGetAllExtras,
    useGetAvailableExtras,
    useCreateExtra,
    useUpdateExtra,
    useDeleteExtra,
  };
};