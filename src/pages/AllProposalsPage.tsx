import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import request, { ApiError } from '../lib/api'
import { ArrowLeft, FileText, Search, User as UserIcon, AlertCircle, Eye } from 'lucide-react'
import Heading2 from '../imports/Heading2/Heading2'

interface ProposalItem {
  id: string
  title: string
  formData: any
  createdAt: string
  updatedAt: string
  user: { id: string; name: string; email: string }
}

export default function AllProposalsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [proposals, setProposals] = useState<ProposalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ProposalItem | null>(null)
  const [loadingProposal, setLoadingProposal] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'MASTER') return
    setLoading(true)
    request<{ proposals: ProposalItem[] }>('/admin/proposals')
      .then((data) => setProposals(data.proposals))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleViewProposal(id: string) {
    setLoadingProposal(id)
    try {
      const data = await request<{ proposal: ProposalItem }>(`/admin/proposals/${id}`)
      navigate('/', { state: { viewingProposal: data.proposal } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar proposta')
    } finally {
      setLoadingProposal(null)
    }
  }

  const filtered = proposals.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.user.name.toLowerCase().includes(q) ||
      p.user.email.toLowerCase().includes(q)
    )
  })

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
            {user?.role === 'MASTER' && (
              <button
                onClick={() => navigate('/admin/proposals')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 font-medium"
              >
                Todas as Propostas
              </button>
            )}
            {(user?.role === 'MASTER' || user?.role === 'GERENTE') && (
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50"
              >
                Gerenciar Usuários
              </button>
            )}
          </nav>
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-neutral-400 mb-2">
              Logado como <span className="font-medium text-neutral-600">{user?.name}</span>
            </p>
            <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {user?.role}
            </span>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-lg font-semibold text-neutral-800 mb-1">Todas as Propostas</h1>
          <p className="text-sm text-neutral-500 mb-4">
            Visualize as propostas de todos os usuários
          </p>

          <div className="relative mb-4">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por título, nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="size-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <FileText className="size-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-sm">
                {search ? 'Nenhuma proposta encontrada' : 'Nenhuma proposta cadastrada'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewProposal(p.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <UserIcon className="size-3.5 text-neutral-400" />
                        <span className="text-xs text-neutral-500">
                          {p.user.name} ({p.user.email})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {new Date(p.updatedAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(p.updatedAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {loadingProposal === p.id ? (
                        <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Eye className="size-5 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
