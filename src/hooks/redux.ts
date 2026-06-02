// ============================================================
//  hooks/redux.ts — Typed Redux Hooks
//
//  المشكلة: useDispatch و useSelector الأصليين مش عارفين الـ types
//  الحل: نعمل versions منهم بالـ types الصح
//
//  بدل ما تكتب:
//    const dispatch = useDispatch<AppDispatch>()
//  بتكتب:
//    const dispatch = useAppDispatch()
// ============================================================
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
