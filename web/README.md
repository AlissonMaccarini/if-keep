# IFkeep 📝

O **IFkeep** é uma aplicação web full-stack desenvolvida para a gestão eficiente de notas de estudo, organização por matérias e mapeamento contextual de produtividade.

---

## 🚀 Aceder à Aplicação (Produção)
* **Frontend (Aplicação Web):** [https://ifkeep-frontend.onrender.com](https://ifkeep-frontend.onrender.com)
* **Backend (API Server):** [https://ifkeep-backend.onrender.com](https://ifkeep-backend.onrender.com)

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
* **React** (Create React App)
* **TypeScript**
* **Styled Components**
* **Axios** para consumo de APIs

### **Backend**
* **Node.js** & **Express**
* **MySQL** (com alojamento na nuvem **TiDB Cloud** via SSL)
* **JSON Web Token (JWT)** para autenticação de sessões
* **Bcrypt** para encriptação de palavras-passe

---

## ✨ Funcionalidades Principais
* **Autenticação Segura:** Registo de utilizadores, login com encriptação de palavra-passe (bcrypt) e recuperação de conta por palavra-secreta.
* **Gestão de Matérias:** Criação, edição/renomeação e exclusão de matérias escolares com suporte à atualização automática associada às notas.
* **Blocos de Notas Avançados:** Criação de notas com títulos, conteúdos, marcação de favoritas/fixadas (*pinned*) e cores personalizadas.
* **Arquivo Automático:** As notas arquivadas entram num ciclo de retenção com exclusão automática após 10 dias.

---

## ⚙️ Como Executar o Projeto Localmente

Se quiseres executar o projeto no teu computador para desenvolvimento, segue os passos abaixo:

### 1. Clonar o Repositório
```bash
git clone [https://github.com/AlissonMaccarini/if-keep.git](https://github.com/AlissonMaccarini/if-keep.git)
cd if-keep