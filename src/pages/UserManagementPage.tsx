import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import request, { ApiError } from '../lib/api'
import {
  ArrowLeft,
  Users,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Check,
  X,
  Shield,
} from 'lucide-react'
import Heading2 from '../imports/Heading2/Heading2'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'GERENTE' | 'MASTER'
  createdAt: string
}

type ModalMode = 'create' | 'edit' | 'delete' | null

export default function UserManagementPage() {
  const { user: me } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [modal, setModal] = useState<ModalMode>(null)
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<'USER' | 'GERENTE' | 'MASTER'>('USER')
  const [submitting, setSubmitting] = useState(false)

  function loadUsers() {
    setLoading(true)
    setError('')
    request<{ users: AdminUser[] }>('/admin/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  useEffect(() => { loadUsers() }, [])

  function openCreate() {
    setModal('create')
    setTargetUser(null)
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormRole('USER')
  }

  function openEdit(u: AdminUser) {
    setModal('edit')
    setTargetUser(u)
    setFormName(u.name)
    setFormEmail(u.email)
    setFormPassword('')
    setFormRole(u.role)
  }

  function openDelete(u: AdminUser) {
    setModal('delete')
    setTargetUser(u)
  }

  function closeModal() {
    setModal(null)
    setTargetUser(null)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const body: any = { name: formName, email: formEmail, password: formPassword }
      if (me?.role === 'MASTER') body.role = formRole
      await request('/admin/users', { method: 'POST', body: JSON.stringify(body) })
      showSuccess('Usuário criado com sucesso')
      closeModal()
      loadUsers()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault()
    if (!targetUser) return
    setSubmitting(true)
    setError('')
    try {
      const body: any = { name: formName, email: formEmail }
      if (formPassword) body.password = formPassword
      await request(`/admin/users/${targetUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
      showSuccess('Usuário atualizado')
      closeModal()
      loadUsers()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao atualizar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRoleChange(u: AdminUser, newRole: 'USER' | 'GERENTE' | 'MASTER') {
    try {
      await request(`/admin/users/${u.id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      })
      showSuccess(`Papel de ${u.name} alterado para ${newRole}`)
      loadUsers()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao alterar papel')
    }
  }

  async function handleDelete() {
    if (!targetUser) return
    setSubmitting(true)
    setError('')
    try {
      await request(`/admin/users/${targetUser.id}`, { method: 'DELETE' })
      showSuccess('Usuário excluído')
      closeModal()
      loadUsers()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao excluir')
    } finally {
      setSubmitting(false)
    }
  }

  const canEditRole = me?.role === 'MASTER'
  const canEditUser = (target: AdminUser) => me?.role === 'MASTER' || (me?.role === 'GERENTE' && target.role === 'USER')

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      MASTER: 'bg-purple-100 text-purple-700',
      GERENTE: 'bg-amber-100 text-amber-700',
      USER: 'bg-neutral-100 text-neutral-600',
    }
    return `text-xs px-2 py-0.5 rounded-full font-medium ${colors[role] || colors.USER}`
  }

  const roleOptions: ('USER' | 'GERENTE' | 'MASTER')[] = ['USER', 'GERENTE', 'MASTER']

  return (
    <div className="size-full flex flex-col bg-neutral-100">
      <div className="bg-white border-b px-6 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-neutral-400 hover:text-neutral-600 p-1"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <Heading2 />
        </div>
      </div>

      <div className="flex-1 flex">
        <aside className="w-60 bg-white border-r shrink-0 p-4">
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Editor
            </button>
            {me?.role === 'MASTER' && (
              <button
                onClick={() => navigate('/admin/proposals')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50"
              >
                Todas as Propostas
              </button>
            )}
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 font-medium"
            >
              Gerenciar Usuários
            </button>
          </nav>
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-neutral-400 mb-2">
              Logado como <span className="font-medium text-neutral-600">{me?.name}</span>
            </p>
            <span className={`${roleBadge(me?.role || 'USER')}`}>
              {me?.role}
            </span>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-neutral-800">Gerenciar Usuários</h1>
              <p className="text-sm text-neutral-500">Crie, edite e gerencie contas de usuários</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="size-4" />
              Novo Usuário
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-4">
              <Check className="size-4" />
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="size-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50">
                    <th className="text-left px-4 py-3 text-xs text-neutral-500 font-medium">Nome</th>
                    <th className="text-left px-4 py-3 text-xs text-neutral-500 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-xs text-neutral-500 font-medium">Papel</th>
                    <th className="text-left px-4 py-3 text-xs text-neutral-500 font-medium">Criado em</th>
                    <th className="text-right px-4 py-3 text-xs text-neutral-500 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="px-4 py-3 text-neutral-800">{u.name}</td>
                      <td className="px-4 py-3 text-neutral-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={roleBadge(u.role)}>{u.role}</span>
                          {canEditRole && (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value as any)}
                              className="text-xs border border-neutral-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {roleOptions.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canEditUser(u) ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(u)}
                              className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                              title="Editar"
                            >
                              <Edit3 className="size-4" />
                            </button>
                            <button
                              onClick={() => openDelete(u)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                              title="Excluir"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-800">
                {modal === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-600">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={modal === 'create' ? handleCreate : handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Senha {modal === 'edit' && <span className="text-neutral-300">(deixe em branco para manter)</span>}
                </label>
                <input
                  type="password"
                  {...(modal === 'create' ? { required: true } : {})}
                  minLength={6}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {me?.role === 'MASTER' && modal === 'create' && (
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Papel</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}

              {modal === 'create' && me?.role === 'GERENTE' && (
                <p className="text-xs text-neutral-400 bg-neutral-50 rounded-lg px-3 py-2">
                  O papel do novo usuário será <strong>USER</strong>
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === 'delete' && targetUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="size-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-800">Excluir usuário</h2>
                <p className="text-sm text-neutral-500">
                  Tem certeza que deseja excluir <strong>{targetUser.name}</strong>?
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {submitting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
