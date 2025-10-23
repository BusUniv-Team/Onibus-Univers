import { useState } from 'react'
import './style.css'

function Home() {
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [comprovante, setComprovante] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!cpf || !telefone || !email || !comprovante) {
      setMessage({ type: 'error', text: 'Preencha todos os campos e envie o PDF!' })
      return
    }

    const formData = new FormData()
    formData.append('cpf', cpf)
    formData.append('telefone', telefone)
    formData.append('email', email)
    formData.append('comprovante', comprovante) // nome deve bater com multer.single('comprovante')

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/cadastro', {
        method: 'POST',
        body: formData
      })

      // ler como texto primeiro (isso vai evitar um erro de json input)
      const text = await res.text()
      let data = null
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (err) {
          // se nao for json, guardar o texto bruto como mensagem
          data = { message: text }
        }
      }

      if (!res.ok) throw new Error(data?.message || 'Erro no envio')

      setMessage({ type: 'success', text: data?.message || 'Cadastro enviado com sucesso!' })
      setCpf('')
      setTelefone('')
      setEmail('')
      setComprovante(null)

    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form className="card" noValidate onSubmit={handleSubmit}>
        <h1>Cadastro Universitário</h1>
        <p className="subtitle">Digite suas informações abaixo</p>

        <label className="field">
          <span className="label-text">CPF</span>
          <input
            name="cpf"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength="11"
            placeholder="Digite seu CPF"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </label>

        <label className="field file-field">
          <span className="label-text">Comprovante de Matrícula (PDF)</span>
          <input
            id="comprovante"
            name="comprovante"
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setComprovante(e.target.files?.[0] ?? null)}
          />
          <span className="file-hint">Envie um PDF</span>
        </label>

        <label className="field">
          <span className="label-text">Telefone</span>
          <input
            name="telefone"
            type="tel"
            inputMode="tel"
            placeholder="(00) 0 0000-0000"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="label-text">Email</span>
          <input
            name="email"
            type="email"
            placeholder="seu@exemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>

        {message && (
          <p style={{ marginTop: 12, color: message.type === 'error' ? '#b00020' : '#0a7a3a' }}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}

export default Home
