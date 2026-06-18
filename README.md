# TCC_Ecommerce_multi_tenant
Projeto de TCC que visa implementar o modelo multi-tenant à um sistema de ecommerce e analisar os resultados e impactos.
## Tecnologias
React + Vite  
NestJS  
PostgreSQL  
Prisma ORM  
TypeScript  
## Pré-requisitos
Node.js 20+  
PostgreSQL  
Git  
## Clonar o projeto
```bash
git clone https://github.com/Mateus-Luna/TCC_Ecommerce_multi_tenant.git  
```
```bash
cd TCC_Ecommerce_multi_tenant
```
## Configuração do Backend
```bash
cd backend
```
```bash 
npm install
```
### Criar arquivo .env:  
```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/tcc?schema=public"
```
### Gerar Prisma Client:
```bash
npx prisma generate
```
### Aplicar migrations: 
```bash
npx prisma migrate dev
```
### Iniciar backend:
```bash
npm run start:dev
```
### Backend disponivel em:
```bash
http://localhost:3000
```
## Configuração do Frontend
```
cd frontend
```
```bash
npm install
```
### Criar arquivo .env: 
```bash
VITE_API_URL=http://localhost:3000
```
### Iniciar frontend:
```bash
npm run dev
```
### Frontend disponível em:
```bash
http://localhost:5173  
```
