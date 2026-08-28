O Claude deve marcar como concluído o item dessa lista após sua implementação.

- [x] Reduzir pela metade os espaçamentos do card de projetos.
- [x] Renomeie Landing Page para LP no titulo do card do projeto em questão. Também preciso alterar "empresa de serviços turísticos e assessoria de viagens brasileira." para "empresa de turismo e assessoria brasileira."
- [x] O card deve retrair/fechar quando é acionado um clique fora dele.
- [x] Altere o texto para que meus hyperlinks no página tenham um linha abaixo do texto. O email também deve estar na cor cinza.
- [x] Deixe todos os títulos de sessões das páginas na cor cinza que viemos usando.
- [x] reduza 1/3 do espaçamento superior da pagina.
1. [x] adaptar o conteúdo para o mobile em uma branch de teste
2. [x] fazer um branch que reuna os nome e cargo + dados de contato + botão currículo no meu lateral
3. [x] ao clicar sobre os cards, o componente deve sofrer uma animação de redução de 3% antes de abrir, mostrando sua responsividade ao clique.
4. [x] essa regra de animação e responsividade também deve ser aplicada a cada div da sessão de artigos e ao botão de curriculo, alem dos botões do menu
5. [x] desfaça as alterações apenas relativas aos raios das bordas redondas para antes de aplicarmos o calculo para interno e externo. Todo o resto se mantem. Bordas internas e externas do card com 8px.
6. [x] fazer commit e merge apos eu confirmar.
7. [x] deixar o peso do texto/botão currículo no index igual ao dos títulos do artigos
8. [x] trocar no descrição que aparece na guia do navegador de Product para UX Designer
9. [x] engrosse o peso das setas do carrossel para que conversem com as setas usadas nos títulos de artigos. Quando a seta é cl içável (tem ação disponível) ela deve ser azul (o mesmo que usamos em outros lugares.)
10. [x] alterar a ordem dos artigos na sessão do index. se considerarmos 1, 2 e 3 respectivamente a ordem atual empilhada, a nova ordem deve ser 2,3,1.
11. [x] Adicione no Card do projeto logia, assim como no da Landing Page, um um hyperlink com seta "Saiba mais" para o link https://repositorio.bc.ufg.br/items/5d11560e-2910-4a99-898c-4fdaaf554609 ; Renomeie o da LP para "Visite agora"
12. [x] revisar mudanças interrompidas pelo limite da sessão. a transição de estado dos itens que estão contraídos na pagina currículo deve seguir a animação que já acontece com os cards no index.
13. [x] adicionar um quarto artigo + criar sua respectiva pagina. titulo: "Evoluir é errar" Descr.: "Uma revisão crítica dos meus primeiros projetos."
14. [x] adicionar um placeholder de mídia 4:3 no lado esquerdo de cada item de artigo. use o estilo dos cards como referencia, mas sem sombra.
15. [x] analise os pontos de quebra da site atualmente. quero que a parti do momento que o espaçamento esquerdo do menu lateral seja menor que o espaçamento direito do menu, a pagina se altere para que o o componente do menu seja empilhado na vertical (que usamos para o mobile). [breakpoint calculado em ~1245px; menu empilha alinhado à coluna fixa; mobile completo segue em 640px]
16. [x] corrija para que o botão inicio siga o mesmo peso que o botão currículo e commite as alterações em aberto.
17. [x] em vez de após (abaixo) do componente de nome, os botões do menu devem estar ao lado direito do componente de nome, alinhados a direita do corpo da pagina. essa configuração só deve valer para a quebra de pagina que intermediaria (breakpoint ~1245px); no mobile completo (<=640px) mantém o empilhamento vertical. 
18. [x] altere o icone no final do nome para a linha descritiva debaixo, antes do texto. confira em todas as paginas.
19. [x] configurar a página do artigo "Evoluir é errar": conteúdo textual baseado em `artigos/notas_artigo_errar 1.md`, imagens de `refs/artigo 01/`, e o componente interativo da seção Análise (carrossel vertical de tópicos com imagem e destaque vinculados, histórico colapsável, animações de blur). Teste inicial com os 3 primeiros tópicos com destaque
20. [x] algumas revisões que devem ser aplicadas na pagina do artigo evoluir é errar:
	1. [x] tópicos da descrição da imagem 02 devem ter suas letras iniciais em caixa alta
	2. [x] descrição do video deve ser ser reduzida para que acabe em Figma.
	3. [x] as caixas de texto de descrição do video e da imagem 07 em especifico devem ser comprimidas para que fiquem mais retangulares (estado atual cria linhas desproporcionais em tamanhos)
	4. [x] a troca de parágrafos do componente da sessão analise deve poder interagir com a rolagem do mouse quando o mesmo está posicionado sobre o componente. porem deve existir alguma resistência na interação de troca, para não criar um efeito de scroll desenfreado.
	5. [x] atualizei o primeiro parágrafo da sessão contexto com o texto "A iteração foi trabalho final da matéria "Experiência do Usuário", optativa no curso de D. Gráfico (UFG), servindo como primeira experiência do grupo com a temática." 
	6. [x] um clique fora do componente deve fazer com que ele retorne para o estado inicial.
	7. [x] commit caso aprovado
21. [x] remova as capas dos itens da sessão artigo do index.
22. [x] altere o peso dos titulos das experiencias profissionais na pagina curriculo para o mesmo usado nos titulos de artigo na pagina index.
23. [x] faça com que o segundo item da lista de experiencia profissional do curriculo apareça (atualmente é contraído com os outros 2).
24. [x] deixe os 3 pontinhos que ativam a expansão de texto da bio do index em azul e peso igual ao dos títulos de artigos do index.
25. [x] contraia o segundo paragrafo da bio junto com o terceiro no index. deixe o hyperlink para o artigo citado no terceiro parágrafo com um peso maior que o corpo do texto.
26. [x] crie um componente de rodapé para o final das paginas de artigo destacando 2 outros artigos do site. pode ser um componente de 2 colunas (uma para cada artigo) usando a mesma aparência que os links para os artigos tem no index (seta + titulo + descrição).
27. [x] adapte para que os cards da sessão acervo do index tenham as mesmas bordas que as imagens do artigo desenvolvido a pouco.
28. [x] caso eu aprove, commit em todas as atualizações e merge.
29. [ ] desenvolva um plano de ação (branch separada) para a função de escala para o conteúdo da pagina (mais especificamente o texto). o foco dessa feature é a acessibilidade do site. talvez o tamanho do corpo do site necessite ser alterado, pondere a respeito. primeiro me liste os tamanhos atuais que usamos para os textos e vamos definir juntos quais seriam os tamanhos desejáveis para a versão escalada. essa função será ativada por um botão com função de switch no menu (me peça a referencia visual antes de finalizar o plano.)
30. [x] crie um plano de ação para um feature que cria uma miniatura do tamanho dos cards do acervo que paira sobre link do artigo que o mouse está parado no index (deve conter um print do começo da pagina do artigo na miniatura do card.) o card deve sobrepor os outros artigos e usar da mesma sombra que os componentes os cards do acervo usam. devem estar alinhado com a esquerda da coluna da sessão de artigos e não devem ter sua posição alterada quando o mouse se move.