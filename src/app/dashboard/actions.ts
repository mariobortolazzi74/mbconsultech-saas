'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
export async function createProject(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const name = formData.get('name') as string
  const file = formData.get('file') as File
  
  const { data: project, error: projectError } = await supabase
    .from('mbc_projects')
    .insert({
      client_id: user.id,
      name: name,
      status: 'analisi_preliminare'
    })
    .select()
    .single()
    
  if (projectError || !project) {
    throw new Error('Unable to create the project')
  }

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${project.id}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${project.id}/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('mbc_documents')
      .upload(filePath, file)
      
    if (!uploadError) {
      await supabase.from('mbc_documents').insert({
        project_id: project.id,
        file_name: file.name,
        storage_path: filePath
      })
    }
  }
  
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const projectId = formData.get('project_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  const { error } = await supabase
    .from('mbc_tickets')
    .insert({
      project_id: projectId,
      title,
      description,
      status: 'open'
    })
    
  if (error) {
    throw new Error('Unable to create the ticket')
  }
  
  revalidatePath('/dashboard/tickets')
  redirect('/dashboard/tickets?success=true')
}

export async function uploadProjectDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthenticated')
  }

  const projectId = formData.get('project_id') as string
  const file = formData.get('file') as File

  if (!projectId || !file || file.size === 0) {
    throw new Error('Missing data or invalid file')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${projectId}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${user.id}/${projectId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('mbc_documents')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error('Unable to upload the file to storage')
  }

  const { data: document, error: dbError } = await supabase
    .from('mbc_documents')
    .insert({
      project_id: projectId,
      file_name: file.name,
      storage_path: filePath
    })
    .select()
    .single()

  if (dbError || !document) {
    throw new Error('Unable to save file metadata')
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  
  return { 
    success: true, 
    documentId: document.id, 
    storagePath: filePath 
  }
}

export async function simulateAnalysisComplete(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  await supabase
    .from('mbc_projects')
    .update({ status: 'da_pagare' })
    .eq('id', projectId)
    .eq('client_id', user.id)

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard')
}

export async function simulatePayment(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  await supabase
    .from('mbc_projects')
    .update({ status: 'completato' })
    .eq('id', projectId)
    .eq('client_id', user.id)

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard')
}
