# 🏋️ FitPulse – Sistema de Agendamento para Academia

Desenvolvido como parte de um desafio técnico para a vaga de Desenvolvedor Front-End Pleno, este sistema simula a interface de agendamento de aulas para uma rede de academias, com foco em performance, escalabilidade e boa experiência de usuário, especialmente em dispositivos móveis.

-----

## 🚀 Tecnologias Utilizadas

  - **Next.js** – Framework React para SSR e performance.
  - **TypeScript** – Tipagem estática para maior segurança e legibilidade.
  - **Shadcn UI** – Sistema de design moderno e flexível.
  - **Zustand** – Gerenciamento de estado simples e leve.
  - **Tailwind CSS** – Estilização com classes utilitárias.
  - **React Hook Form + Zod** – Formulários com validação robusta.
  - **Mock API** – Persistência local de dados (simulação).

-----

## 📱 Público-Alvo

  - **85% mobile**: foco em performance e responsividade.
  - **15% desktop**: interface também compatível com telas maiores.

-----

## 🔧 Funcionalidades

### Alunos

  - Cadastro e edição de aluno com os seguintes campos:
      - Nome (obrigatório)
      - Data de nascimento (obrigatório)
      - CPF
      - Cidade, Bairro, Endereço
      - Tipo de plano (Mensal, Trimestral, Anual) – obrigatório
  - Listagem de alunos cadastrados

### Aulas

  - Cadastro e edição de aula:
      - Descrição, Tipo, Data e Hora, Capacidade, Status
      - Permitir agendamento após início
  - Listagem por dia com:
      - Horário, descrição, capacidade, status e alunos agendados
  - Modal com:
      - Informações completas da aula
      - Participantes (adicionar/remover)
      - Finalizar aula

-----

## 📋 Regras de Negócio

  - ❌ Não permitir mais participantes do que a capacidade máxima
  - ⛔ Aula finalizada não permite alterações
  - 🕒 Adição pós-início apenas se configurado

-----

## 📁 Estrutura do Projeto

```
app/
├── agenda/           # Páginas e lógica de agendamento
├── classes/          # Páginas e lógica de aulas
├── students/         # Páginas e lógica de alunos
├── layout.tsx
└── page.tsx          # Dashboard principal

components/
├── modules/          # Formulários e componentes específicos por domínio
├── shared/           # Componentes reutilizáveis (UI, forms, cards, layout, etc.)

lib/
└── utils/            # Funções utilitárias

docs/
└── design-system.ts  # Base do design system
```

-----

## 🛠️ Como rodar o projeto

### 1\. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fitpulse.git
cd fitpulse
```

### 2\. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3\. Rode o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar o app.

-----

## 📦 Simulação de API

Atualmente, o projeto **não utiliza um backend real**. Os dados são simulados e persistidos localmente, podendo ser adaptado futuramente para uma API real.

-----

## 📌 Observações Finais

  - O projeto foca em **boas práticas de código**, **componentização limpa**, e **responsividade**.
  - A estrutura é pensada para escalar facilmente e lidar com **grande volume de dados**.
  - Os formulários seguem padrões acessíveis e seguros.
