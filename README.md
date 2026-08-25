# Site YES SOLAR Energia Renovável

Landing page da YES SOLAR — energia solar fotovoltaica e instalação de carregadores para
carros elétricos em Mirassol, São José do Rio Preto e região.

**Feito com HTML, CSS e JavaScript puros.** Sem framework, sem build, sem dependência:
qualquer hospedagem estática serve.

- 📱 WhatsApp: [(17) 98125-6489](https://wa.me/5517981256489)
- 📷 Instagram: [@yessolarenergia](https://www.instagram.com/yessolarenergia)
- 📍 Av. Djair José Marques, 3625 · Mirassol/SP

---

## Guia de manutenção

## Como abrir

Dê dois cliques em `index.html`. É só isso: o site é feito de HTML, CSS e JavaScript puros,
não precisa instalar nada nem rodar comando nenhum.

## Os 3 arquivos que importam

| Arquivo | O que tem dentro |
|---|---|
| `index.html` | Todo o **texto** e as **fotos** do site |
| `style.css` | Todas as **cores, tamanhos e espaçamentos** |
| `script.js` | O que **se mexe**: carrossel, filtros, simulador, formulário |

As fotos ficam em `assets/img/`.

---

## Recolocar a seção de depoimentos

A seção de depoimentos **foi retirada** do site. Ela existia com textos de exemplo que eu
escrevi, e publicar avaliação inventada como se fosse de cliente real é propaganda enganosa
(Código de Defesa do Consumidor, art. 37). O estilo continua pronto no `style.css`.

Quando tiver avaliações de verdade (copie do Google Meu Negócio ou dos comentários do
Instagram), cole este bloco no `index.html`, logo antes de `<!-- ══════════ CONTATO`:

```html
<section class="section depoimentos" id="depoimentos">
  <div class="wrap">
    <header class="sec-head">
      <h2 class="sec-head__title">Quem já instalou conta</h2>
      <p class="sec-head__deck">Clientes de Mirassol e região falando do que mais importa
        depois da obra: a conta que chegou.</p>
    </header>

    <ul class="depos">
      <li class="depo">
        <p class="stars" aria-label="5 de 5 estrelas"><span aria-hidden="true">★★★★★</span></p>
        <blockquote>COLE AQUI O TEXTO QUE O CLIENTE ESCREVEU.</blockquote>
        <footer><b>NOME DO CLIENTE</b><span>Tipo de obra · Cidade, SP</span></footer>
      </li>
      <!-- repita o <li> para cada avaliação real -->
    </ul>
  </div>
</section>
```

Depois é só recolocar o link no menu e no rodapé:
```html
<li><a href="#depoimentos">Depoimentos</a></li>
```

Três avaliações verdadeiras convencem mais que seis inventadas.

---

## ⚠️ Confira os 8 pontos de "Por que fecham com a gente"

Essa seção assume compromissos em nome da empresa: treinamento para trabalho em altura
(NR-35), ART assinada por engenheiro, preço fechado sem custo extra na obra e garantia
do próprio serviço de instalação.

São coisas que empresa séria de energia solar faz — mas **confira uma por uma** se
corresponde exatamente à forma como vocês trabalham hoje. Se algum ponto não bater,
mude o texto em vez de deixar como está: prometer no site o que não se cumpre na obra
gera problema com o cliente depois.

No `index.html`, procure por `<ul class="diffs">`.

---

## Trocar ou acrescentar fotos de projeto

1. Coloque a foto nova em `assets/img/`.
2. No `index.html`, procure por `<ul class="track"` (a seção **Projetos**).
3. Copie um bloco `<li class="slide">` inteiro e cole logo abaixo, mudando:
   - `data-cat` → `solar`, `ev` (carregador) ou `infra`
   - `src` da imagem pequena e `data-img` da imagem grande
   - `alt` (descrição da foto, importante para quem não enxerga e para o Google)
   - o título em `<b>` e a descrição em `<i>`

As fotos estão em dois tamanhos: `nome.webp` (aparece no carrossel) e
`nome-lg.webp` (aparece ampliada quando clica). Se só tiver uma versão, use a mesma nos dois.

---

## Mudar textos e contatos

- **Telefone do WhatsApp:** procure por `5517981256489` no `index.html` e no `script.js`.
  O formato é `55` + DDD + número, tudo junto e sem símbolos.
- **Instagram:** procure por `yessolarenergia`.
- **Endereço e horário:** estão na barra de cima, na seção **Contato** e no rodapé.
  Se mudar o horário, ajuste também a lista `HORARIOS` no `script.js` — é ela que faz
  aparecer "Aberto agora" ou "Fechado" automaticamente.

---

## Mudar as cores

Estão todas juntas no topo do `style.css`, no bloco `:root`:

```css
--navy-700: oklch(25.5% 0.083 266);   /* azul da logo — #101F4A */
--amber:    oklch(81.8% 0.171 78);    /* amarelo da logo — #FFB300 */
```

Mexeu ali, mudou no site inteiro.

---

## Sobre o simulador de economia

Os números vêm destas premissas, que estão no começo da seção 9 do `script.js`:

- 5,2 horas de sol pleno por dia (média da região de Mirassol)
- tarifa de R$ 0,95 por kWh
- módulos de 610 W
- 78% de eficiência real do sistema

Quando a tarifa da concessionária mudar, atualize `TARIFA` no `script.js` **e** o texto
da observação embaixo do simulador no `index.html`, para os dois continuarem batendo.

---

## Colocar no ar

O site é estático, então serve em qualquer hospedagem: Hostinger, Netlify, Vercel,
GitHub Pages, ou o mesmo servidor onde está o `yessolar.com.br` hoje.
Basta enviar a pasta inteira (`index.html`, `style.css`, `script.js` e `assets/`).
