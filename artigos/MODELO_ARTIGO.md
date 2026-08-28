# Modelo de artigo — do .md para a página

Cada artigo tem um `.md` nesta pasta (a escrita) e um `.html` na raiz do
projeto (a publicação). O `.md` é a fonte; o `.html` é ele transposto para a
marcação abaixo.

| Artigo | Fonte `.md` | Página |
|---|---|---|
| Como um portifólio de UX deve ser? | `como-um-portifolio-de-ux-deve-ser.md` | `artigo-portfolio-ux.html` |
| Valor = Função | `valor-igual-funcao.md` | `artigo-valor-funcao.html` |
| Casos de estudo com programação assistida por IA | `casos-de-estudo-com-ia.md` | `artigo-casos-estudo-ia.html` |
| Evoluir é errar | `notas_artigo_errar 1.md` | `artigo-evoluir-e-errar.html` |

Só o miolo do `<div class="article-body">` é substituído. Cabeçalho, menu
lateral e `<head>` da página permanecem.

## Equivalências

| No `.md` | Na página |
|---|---|
| `# Título` | `<h1>` do `.article-header` (e o `<title>` da aba) |
| linha logo abaixo do `#` | `<span class="subtitle">` do cabeçalho |
| `## Seção` | `<h2>` |
| `### Subseção` | `<h3>` |
| parágrafo | `<p>` |
| `- item` | `<ul class="article-list"><li>` |
| `1. item` | `<ol class="article-list"><li>` |
| `[texto](url)` | `<a href="url">` (sublinhado automático dentro do corpo) |
| `![legenda](arquivo)` | bloco `<figure class="article-figure">` |
| `> citação` | `<blockquote class="article-quote">` |

Nada além disso: se um artigo precisar de um elemento novo, ele entra antes
no `css/style.css` (bloco "Artigo"), para nenhum texto depender de estilo
solto na página.

## Bloco de imagem

Enquanto a arte não existe, o frame reserva o espaço e mostra o texto do
`placeholder`:

```html
<figure class="article-figure">
  <div class="article-figure__frame">
    <span class="article-figure__placeholder">descrição do que vai aqui</span>
  </div>
  <figcaption class="article-caption">Imagem 01 — legenda</figcaption>
</figure>
```

Quando a imagem chegar, ela substitui o `<span>` e o resto fica igual:

```html
<div class="article-figure__frame">
  <img src="img/artigos/nome-do-arquivo.png" alt="descrição para leitores de tela">
</div>
```

Proporção do frame: `4:3` é o padrão; `article-figure__frame--wide` dá 16:9
(usado nas aberturas) e `article-figure__frame--square` dá 1:1.

## Componentes fora do vocabulário padrão

Nada além das equivalências acima deveria aparecer num artigo — mas o artigo
"Evoluir é errar" tem uma exceção registrada: a seção Análise usa um
componente interativo próprio (`.analise`, em `css/style.css` e
`js/analise.js`), porque o conteúdo (dez pontos de crítica, cada um
vinculado a uma imagem e a uma região destacada nela) não cabe nas classes
de artigo comuns. Se outro artigo precisar de algo parecido, reaproveitar
esse bloco em vez de criar um novo — não duplicar o padrão.

## Ao publicar um artigo novo

1. Duplicar uma das três páginas existentes e trocar título, `<title>` e miolo.
2. Acrescentar o item na seção Artigos do `index.html`, no mesmo formato dos
   outros (`<div class="featured-link">` com o link e a descrição).
3. As descrições da home ainda estão como "Descrição em breve." — trocar
   quando o texto de cada artigo estiver fechado.
