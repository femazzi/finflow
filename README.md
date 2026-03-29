<div align="center">
  <img src="https://ui-avatars.com/api/?name=Fin&background=27272a&color=ffffff&size=128&rounded=true" alt="Finflow Logo" width="100"/>
  <h1>Finflow - Plataforma de Inteligência Financeira</h1>
  <p><b>Solução moderna para gestão de faturas, ganhos e portfólio de investimentos.</b></p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-brightgreen.svg?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
</div>

<br/>

## Sobre o Projeto
O **Finflow** é um MVP (Minimum Viable Product) de gestão financeira pessoal planejado para unir um design deslumbrante à verdadeira escalabilidade e robustez de uma arquitetura baseada em microserviços. Diferente de aplicações financeiras tradicionais engessadas, o Finflow utiliza um *Design System* baseado em **Glassmorphism & Bento Grids**, com foco absoluto em responsividade, animações micro-interativas fluidas (60FPS) e performance.

### Features Premium
- **Dashboard "Bento UI"**: Componentes assimétricos modernos que reorganizam dinamicamente a arquitetura de blocos para priorizar os dados mais sensíveis na tela do usuário.
- **Atomic Data Fetching**: Utiliza `@tanstack/react-query` para abstrair o Redux, fazendo o fetch seletivo, deduplicação paralela de requisições, L1 Caching e Invalidations otimistas do Backend.
- **Engine Java**: Back-end movido a **Spring Boot 3** que lida com a lógica ACID (*Atomicity, Consistency, Isolation, e Durability*) e Cascading Entities no nível do Persistence Layer (Hibernate).
- **Framer Motion Micro-Interactions**: Diálogos assíncronos que ignoram os engessamentos padrão dos Browsers e resolvem promessas de deleção visualmente.

<br/>

## Stack de Engenharia
### Frontend:
*   **Core:** React 18, TypeScript, Vite.
*   **Estilização:** Tailwind CSS (Dark Mode Matte customizado).
*   **Animação:** Framer Motion (Presence hooks).
*   **Gerenciamento de Estado:** React Query & Axios.
*   **Iconografia:** Lucide-React.

### Backend:
*   **Framework:** Java 17 + Spring Boot 3.x
*   **Banco de Dados:** H2 Database (In-Memory, fácil de inicializar para avaliações).
*   **Arquitetura:** MVC (Model, View, Controller) com DTO pattern para serialização fina.

<br/>

## Como Rodar o Projeto na Sua Máquina

Você precisará do **Node.js 18+** e **Java 17+** (com Maven) instalados na sua máquina.

### Passo 1: Iniciar o Backend (Spring Boot)
Abra um terminal (`Powershell` ou `Bash`), navegue até a pasta `backend` e use o wrapper do Maven:
```bash
cd backend
# No Windows:
.\mvnw spring-boot:run
# No Mac/Linux:
./mvnw spring-boot:run
```
O servidor começará a rodar em `http://localhost:8080`.

### Passo 2: Iniciar o Frontend (React / Vite)
Abra um segundo terminal na raiz do projeto `projeto-finflow`:
```bash
npm install
npm run dev
```
O servidor Vite provisionará o módulo e abrirá a UI em `http://localhost:5173`.

<br/>

## Decisões de Arquitetura & Aprendizados
1. **Hoisting de Componentes Funcionais:** Modificados componentes internos do React para evitar "Remounting" anônimo a cada KeyStroke. O estado permanece isolado no View, garantindo uma digitação zero-flicker e performática.
2. **CORS & Preflight OPTIONS**: Para permitir Deleções (Verbo DELETE HTTP) nativas provenientes de Fetch APIs no navegador sem gerar falhas `403` via Chrome, o Controller Spring Boot recebeu liberações explícitas contra Cross-Origin Resource Sharing.
3. **Hibernate Cascade Deletion Manual**: O Spring injeta dependências Transacionais (`@Transactional`) que forçam o cache nível 1 a purgar filhos em Coleções (Collections do Hash) antes de dropar Constraints de chave-estrangeira do banco, mantendo toda a deleção íntegra.

