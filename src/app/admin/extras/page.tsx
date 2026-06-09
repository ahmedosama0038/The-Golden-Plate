'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import type { Extra } from '@/types'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'
import { extraApi } from '@/lib/api'

export default function AdminExtrasPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null)

  // 1. استخدام الـ Type الصح مع قيم الـ Form المبدئية
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Extra>({
    defaultValues: {
      name: '',
      price: 0,
      isAvailableAlone: true,
    }
  })
// 2. جلب البيانات مع الفلترة النظيفة طالما الداتا راجعة Array علطول
  const { data: extras = [], isLoading } = useQuery<Extra[]>({
    queryKey: ['admin-extras'],
    queryFn: async () => {
      const res = await extraApi.getAll()
      // طالما متأكدين إنها Array من الـ Console، هنفلتر علطول
      return res.filter((item: Extra) => !item.isDeleted)
    },
  })

  // 3. Mutation الحفظ والتعديل بالـ Types الصح
  const saveMutation = useMutation({
    mutationFn: async (data: Extra) => {
      if (selectedExtra) {
        return extraApi.update(selectedExtra.id, data)
      } else {
        return extraApi.create(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
      queryClient.invalidateQueries({ queryKey: ['extras'] })
      toast.success(selectedExtra ? 'Extra updated successfully' : 'Extra added successfully')
      closeModal()
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || err.message
      toast.error('Operation failed', typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg)
    }
  })

  // 4. Mutation الحذف
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => extraApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
      queryClient.invalidateQueries({ queryKey: ['extras'] })
      toast.success('Extra deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete extra')
    }
  })

  // هنا تظبيط الـ Type ليكون Extra أو null علطول
  const openModal = (extra: Extra | null = null) => {
    setSelectedExtra(extra)
    if (extra) {
      reset({
        name: extra.name,
        price: extra.price,
        isAvailableAlone: extra.isAvailableAlone
      } as any) // الـ cast الصغير ده عشان الـ reset يقبل الأوبجكت المبعوت بسلاسة
    } else {
      reset({
        name: '',
        price: 0,
        isAvailableAlone: true
      } as any)
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedExtra(null)
    reset()
  }

  const onSubmit = (data: Extra) => {
    saveMutation.mutate({
      ...data,
      price: Number(data.price),
    })
  }

  return (
    <>
      <TopBar title="Extras" />
      <div className="adm-content">
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <button className="adm-btn primary" onClick={() => openModal()}>
            <i className="fa-solid fa-plus" /> Add Extra
          </button>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {!isLoading && (
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              <div className="adm-table-title">All Extras ({extras.length})</div>
            </div>

            {extras.length === 0 ? (
              <div className="adm-empty">
                <i className="fa-solid fa-plus-minus" />
                <p>No extras found.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Extra Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {extras.map((extra) => (
                    <tr key={extra.id}>
                      <td style={{ fontWeight: 600, color: 'var(--adm-muted)', width: '80px' }}>#{extra.id}</td>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{extra.name}</td>
                      <td style={{ fontWeight: 600 }}>{extra.price} ج.م</td>
                      <td>
                        <span className={`adm-status ${extra.isAvailableAlone ? 'success' : 'danger'}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {extra.isAvailableAlone ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ width: '120px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="adm-btn ghost" onClick={() => openModal(extra)}>
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="adm-btn danger"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              toast.confirm(
                                'Are you sure?',
                                'Deleting this extra will remove it from the menu options!',
                                () => deleteMutation.mutate(extra.id)
                              )
                            }}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Pop-up Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="adm-modal-card" style={{ background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--adm-gold)' }}>
              {selectedExtra ? 'Edit Extra' : 'Add New Extra'}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Extra Name</label>
              <input
                type="text"
                {...register('name', { required: true })}
                placeholder="e.g. Extra Cheese..."
                style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none' }}
              />
              {errors.name && <span style={{ color: 'red', fontSize: '0.75rem' }}>Name is required</span>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--adm-muted)', marginBottom: '0.4rem' }}>Price (EGP)</label>
              <input
                type="number"
                {...register('price', { required: true, min: 0 })}
                placeholder="e.g. 20"
                style={{ background: 'transparent', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '0.6rem', width: '100%', outline: 'none' }}
              />
              {errors.price && <span style={{ color: 'red', fontSize: '0.75rem' }}>Valid price is required</span>}
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="isAvailableAlone"
                {...register('isAvailableAlone')}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="isAvailableAlone" style={{ fontSize: '0.85rem', color: 'var(--adm-text)', cursor: 'pointer', userSelect: 'none' }}>
                Available in Kitchen
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" className="adm-btn primary" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}