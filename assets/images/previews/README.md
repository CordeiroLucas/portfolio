# 📸 Previews dos Projetos

Esta pasta contém as imagens de preview exibidas nos cards da página de projetos.
A quantidade de imagens por projeto é **totalmente dinâmica** — basta adicionar ou remover arquivos.

## Como funciona

O JavaScript sonda automaticamente os arquivos em sequência (`-1`, `-2`, `-3`, …) e para no primeiro número que não encontrar. Não é preciso alterar nenhum código.

## Padrão de Nomes

```
<slug-do-projeto>-<número>.<extensão>
```

| Projeto | Slug | Exemplos de arquivos |
|---|---|---|
| EV Stations Analytics | `ev-stations-analytics` | `ev-stations-analytics-1.webp`, `ev-stations-analytics-2.webp`, … |
| FastDelivery API | `fastdelivery-api` | `fastdelivery-api-1.webp`, `fastdelivery-api-2.webp`, … |
| AI Resume Optimizer | `ai-resume-optimizer` | `ai-resume-optimizer-1.webp`, `ai-resume-optimizer-2.webp`, … |
| Estocka-Ai | `estocka-ai` | `estocka-ai-1.webp`, `estocka-ai-2.webp`, … |
| Pokedevs | `pokedevs` | `pokedevs-1.webp`, `pokedevs-2.webp`, … |

> A numeração deve ser **contínua a partir de 1** — se `slug-2` existir mas `slug-1` não, apenas `slug-1` em diante será detectado.

## Extensões suportadas

Tentadas em ordem de prioridade por slot: `.webp` → `.jpg` → `.png`

## Especificações

- **Proporção:** **16:9** obrigatória
- **Resolução recomendada:** 1280×720 px (mínimo) ou 1920×1080 px
- **Tamanho máximo:** 300 KB por arquivo
- **Formato preferido:** `.webp` (melhor compressão)

## Comportamento automático

| Imagens encontradas | Resultado |
|---|---|
| 0 | Placeholder com gradiente animado |
| 1 | Imagem estática, sem setas |
| 2 ou mais | Carousel com setas ← → e dots |
