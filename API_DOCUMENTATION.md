# API Documentation - Mãozinhas

Documentação completa das rotas de API para integração com o assistente virtual e frontend.

Base URL (Produção): `https://maozinhas-front.vercel.app/api`
Base URL (Local): `http://localhost:3000/api`

## Autenticação

Atualmente as rotas são públicas. Para integração futura com Firebase Auth, adicione o token no header:
```
Authorization: Bearer {firebase-token}
```

---

## Workers (Prestadores de Serviço)

### 1. Buscar Trabalhadores

**Endpoint:** `GET /api/workers`

**Query Parameters:**
- `category` (opcional): ServiceCategory - casa, cuidados, aulas, beleza, outros, esportes, pets
- `city` (opcional): string - Nome da cidade
- `state` (opcional): string - UF (ex: SP, RJ)
- `minRating` (opcional): number - Rating mínimo (0-5)
- `availableOnly` (opcional): boolean - Apenas disponíveis
- `verifiedOnly` (opcional): boolean - Apenas verificados
- `page` (opcional): number - Página (default: 1)
- `pageSize` (opcional): number - Itens por página (default: 10)

**Exemplo de Request:**
```bash
GET /api/workers?category=casa&city=São Paulo&state=SP&availableOnly=true
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "worker123",
      "name": "João Silva",
      "companyName": "João Pinturas",
      "category": "casa",
      "services": ["pintor", "reformas"],
      "rating": 4.8,
      "reviewCount": 127,
      "location": {
        "city": "São Paulo",
        "state": "SP",
        "cep": "01310-100"
      },
      "available": true,
      "verified": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "hasMore": false
}
```

### 2. Buscar Trabalhadores Próximos

**Endpoint:** `GET /api/workers?nearby=true`

**Query Parameters Obrigatórios:**
- `nearby=true`
- `city`: string
- `state`: string

**Query Parameters Opcionais:**
- `category`: ServiceCategory
- `limit`: number (default: 10)

**Exemplo:**
```bash
GET /api/workers?nearby=true&city=São Paulo&state=SP&category=casa&limit=5
```

### 3. Buscar Trabalhadores em Destaque

**Endpoint:** `GET /api/workers?featured=true`

**Query Parameters:**
- `featured=true`
- `limit` (opcional): number (default: 6)

**Exemplo:**
```bash
GET /api/workers?featured=true&limit=6
```

### 4. Buscar Trabalhador por ID

**Endpoint:** `GET /api/workers/{id}`

**Exemplo:**
```bash
GET /api/workers/worker123
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "worker123",
    "uid": "firebase-uid",
    "email": "joao@example.com",
    "name": "João Silva",
    "companyName": "João Pinturas",
    "phone": "+5511999999999",
    "description": "Pintor profissional com 10 anos de experiência",
    "category": "casa",
    "services": ["pintor", "reformas"],
    "status": "approved",
    "verified": true,
    "available": true,
    "rating": 4.8,
    "reviewCount": 127,
    "priceRange": {
      "min": 150,
      "max": 300,
      "unit": "dia"
    },
    "location": {
      "cep": "01310-100",
      "street": "Rua da Consolação",
      "number": "123",
      "neighborhood": "Consolação",
      "city": "São Paulo",
      "state": "SP"
    },
    "stats": {
      "views": 1523,
      "contacts": 234,
      "hires": 89
    }
  }
}
```

### 5. Atualizar Trabalhador

**Endpoint:** `PATCH /api/workers/{id}`

**Body:**
```json
{
  "name": "João Silva Santos",
  "description": "Nova descrição",
  "available": false,
  "priceRange": {
    "min": 200,
    "max": 400,
    "unit": "dia"
  }
}
```

### 6. Registrar Contato

**Endpoint:** `POST /api/workers/{id}/contact`

**Descrição:** Incrementa o contador de contatos quando um usuário entra em contato com o trabalhador.

**Exemplo:**
```bash
POST /api/workers/worker123/contact
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Contato registrado com sucesso"
}
```

---

## Users (Usuários/Buscadores)

### 1. Criar Usuário

**Endpoint:** `POST /api/users`

**Body:**
```json
{
  "uid": "firebase-uid-123",
  "email": "maria@example.com",
  "name": "Maria Santos",
  "phone": "+5511988888888",
  "userType": "seeker",
  "location": {
    "cep": "01310-100",
    "street": "Rua da Consolação",
    "number": "456",
    "neighborhood": "Consolação",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "uid": "firebase-uid-123",
    "email": "maria@example.com",
    "name": "Maria Santos",
    "userType": "seeker",
    "favorites": [],
    "searchHistory": []
  }
}
```

### 2. Buscar Usuário por ID

**Endpoint:** `GET /api/users/{id}`

**Exemplo:**
```bash
GET /api/users/user123
```

### 3. Atualizar Usuário

**Endpoint:** `PATCH /api/users/{id}`

**Body:**
```json
{
  "name": "Maria Santos Silva",
  "phone": "+5511977777777",
  "location": {
    "cep": "01310-200",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

### 4. Buscar Favoritos

**Endpoint:** `GET /api/users/{id}/favorites`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": ["worker123", "worker456", "worker789"]
}
```

### 5. Adicionar aos Favoritos

**Endpoint:** `POST /api/users/{id}/favorites`

**Body:**
```json
{
  "workerId": "worker123"
}
```

### 6. Remover dos Favoritos

**Endpoint:** `DELETE /api/users/{id}/favorites`

**Body:**
```json
{
  "workerId": "worker123"
}
```

---

## Tipos e Enums

### ServiceCategory
```typescript
"casa" | "cuidados" | "aulas" | "beleza" | "outros" | "esportes" | "pets"
```

### SubCategory (Serviços de Casa)
```typescript
"limpeza" | "passar-roupa" | "faz-tudo" | "mudanca" | "encanador" | 
"pintor" | "eletricista" | "eletrodomesticos" | "reformas" | 
"jardinagem" | "chaveiro" | "climatizacao"
```

### WorkerStatus
```typescript
"pending" | "approved" | "rejected" | "suspended"
```

---

## Códigos de Erro

- `400` - Bad Request (dados inválidos)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error

**Formato de Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva"
}
```

---

## Exemplos de Uso para o Assistente Virtual

### Cenário 1: Usuário pede para encontrar um pintor

```javascript
// 1. Buscar pintores próximos
const response = await fetch(
  'https://maozinhas-front.vercel.app/api/workers?nearby=true&city=São Paulo&state=SP&category=casa'
);
const data = await response.json();

// 2. Filtrar pintores
const pintores = data.data.filter(w => w.services.includes('pintor'));

// 3. Retornar os 3 melhores
const melhoresPintores = pintores.slice(0, 3);
```

### Cenário 2: Registrar interesse do usuário

```javascript
// Quando o usuário solicita contato com um trabalhador
await fetch(
  'https://maozinhas-front.vercel.app/api/workers/worker123/contact',
  { method: 'POST' }
);
```

### Cenário 3: Buscar trabalhadores em destaque

```javascript
// Para mostrar recomendações
const response = await fetch(
  'https://maozinhas-front.vercel.app/api/workers?featured=true&limit=3'
);
const { data } = await response.json();
```

---

## Notas para Integração

1. **CORS**: As rotas estão configuradas para aceitar requisições de qualquer origem em desenvolvimento
2. **Rate Limiting**: Implementar rate limiting futuramente para produção
3. **Autenticação**: Futuras rotas protegidas requerirão Firebase Auth token
4. **Paginação**: Use os parâmetros `page` e `pageSize` para resultados grandes
5. **Cache**: Considere cachear resultados de busca por alguns minutos

---

## Contato

Para dúvidas ou sugestões sobre a API, entre em contato com a equipe de desenvolvimento.

