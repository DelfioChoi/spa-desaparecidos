# Dados Participante
Nome: Delfio Alexandre Choi  
E-mail: delfioalexandre@gmail.com  
Nº Celular: (65) 99282-8139  
Link projeto GITHUB: [https://github.com/DelfioChoi/spa-desaparecidos](https://github.com/DelfioChoi/spa-desaparecidos)

## Como rodar o projeto

### 1. Instalação local
```bash
npm install
npm run dev
```
Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### 2. Build de produção
```bash
npm run build
npm run preview
```

### 3. Docker
```bash
npm run docker:build
npm run docker:run
```
Ou:
```bash
docker build -t spa-desaparecidos .
docker run -p 8080:80 spa-desaparecidos
```

## Dependências principais
- React
- Vite
- Tailwind CSS
- React Router DOM
- TypeScript

## Observações
- Todos os arquivos necessários estão versionados neste repositório.
- O envio de informações é simulado localmente, pois a API não permite POST público.