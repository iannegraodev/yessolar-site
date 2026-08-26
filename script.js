/* ============================================================
   YES SOLAR — comportamentos da página
   Cada bloco abaixo cuida de uma parte só, para ficar fácil de mexer.
   ============================================================ */
(function () {
  'use strict';

  var WHATS = '5517981256489';
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  function waLink(msg) {
    return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- 0. Tela de carregamento ----------
     Some quando a página termina de carregar, respeitando um tempo mínimo
     para não dar um "flash" em conexão rápida, e um tempo máximo para nunca
     prender o visitante caso alguma imagem demore demais. */
  var tela = $('#carregando');
  if (tela) {
    var TEMPO_MINIMO = 900;    /* evita o piscar em conexão rápida */
    var TEMPO_MAXIMO = 4500;   /* trava de segurança */
    var comecou = Date.now();
    var jaSaiu = false;

    document.body.classList.add('carregando-ativo');

    function fecharTela() {
      if (jaSaiu) return;
      jaSaiu = true;
      tela.classList.add('saiu');
      document.body.classList.remove('carregando-ativo');
      /* tira da árvore depois da transição, para não capturar cliques nem foco */
      setTimeout(function () { tela.hidden = true; }, 700);
    }

    function fecharRespeitandoMinimo() {
      setTimeout(fecharTela, Math.max(0, TEMPO_MINIMO - (Date.now() - comecou)));
    }

    if (document.readyState === 'complete') fecharRespeitandoMinimo();
    else window.addEventListener('load', fecharRespeitandoMinimo);

    setTimeout(fecharTela, TEMPO_MAXIMO);
  }

  /* ---------- 1. Ano no rodapé ---------- */
  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- 2. Barra de progresso + cabeçalho grudado ---------- */
  var header = $('#header');
  var bar = $('#progressBar');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var alcance = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (alcance > 0 ? Math.min(y / alcance, 1) : 0) + ')';
    if (header) header.classList.toggle('is-stuck', y > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 3. Menu no celular ---------- */
  var burger = $('#burger');
  var nav = $('#nav');

  function fecharMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('nav-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(aberto));
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('nav-open', aberto);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', fecharMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { fecharMenu(); burger.focus(); }
    });
  }

  /* ---------- 4. Link ativo conforme a seção visível ---------- */
  var linksNav = $$('.nav__list a');
  var secoes = linksNav.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

  if ('IntersectionObserver' in window && secoes.length) {
    var spy = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        linksNav.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 5. Está aberto agora? (horário de Mirassol) ---------- */
  var HORARIOS = {
    Mon: [450, 1080], Tue: [450, 1080], Wed: [450, 1080],
    Thu: [450, 1080], Fri: [450, 1080], Sat: [450, 720], Sun: null
  };
  var ORDEM = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var NOMES = { Sun: 'domingo', Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado' };

  function hhmm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return m ? h + 'h' + (m < 10 ? '0' + m : m) : h + 'h';
  }

  function agoraEmMirassol() {
    try {
      var partes = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var mapa = {};
      partes.forEach(function (p) { mapa[p.type] = p.value; });
      return { dia: mapa.weekday, min: parseInt(mapa.hour, 10) * 60 + parseInt(mapa.minute, 10) };
    } catch (err) {
      var d = new Date();
      return { dia: ORDEM[d.getDay()], min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  var elStatus = $('#statusHorario');
  if (elStatus) {
    var texto = $('.topbar__status-text', elStatus);
    var atualizar = function () {
      var agora = agoraEmMirassol();
      var hoje = HORARIOS[agora.dia];

      if (hoje && agora.min >= hoje[0] && agora.min < hoje[1]) {
        elStatus.setAttribute('data-status', 'aberto');
        texto.textContent = 'Aberto agora · fechamos às ' + hhmm(hoje[1]);
        return;
      }

      elStatus.setAttribute('data-status', 'fechado');

      if (hoje && agora.min < hoje[0]) {
        texto.textContent = 'Fechado · abrimos hoje às ' + hhmm(hoje[0]);
        return;
      }

      var i = ORDEM.indexOf(agora.dia);
      for (var passo = 1; passo <= 7; passo++) {
        var chave = ORDEM[(i + passo) % 7];
        if (HORARIOS[chave]) {
          var fimDeSemana = (chave === 'Sat' || chave === 'Sun');
          var quando = passo === 1 ? 'amanhã'
                     : (fimDeSemana ? NOMES[chave] : NOMES[chave] + '-feira');
          texto.textContent = 'Fechado · abrimos ' + quando + ' às ' + hhmm(HORARIOS[chave][0]);
          return;
        }
      }
    };
    atualizar();
    setInterval(atualizar, 60000);
  }

  /* ---------- 6. Carrossel de projetos ---------- */
  var track = $('#track');
  var slides = $$('.slide', track);
  var btnPrev = $('#prevBtn');
  var btnNext = $('#nextBtn');
  var vazio = $('#trackEmpty');

  function passoDoCarrossel() {
    var visivel = slides.find(function (s) { return !s.hidden; });
    if (!visivel) return 320;
    var estilo = getComputedStyle(track);
    return visivel.getBoundingClientRect().width + (parseFloat(estilo.columnGap) || 16);
  }

  function atualizarSetas() {
    if (!track || !btnPrev) return;
    var max = track.scrollWidth - track.clientWidth - 2;
    btnPrev.disabled = track.scrollLeft <= 2;
    btnNext.disabled = track.scrollLeft >= max;
  }

  if (track && btnPrev && btnNext) {
    btnPrev.addEventListener('click', function () { track.scrollBy({ left: -passoDoCarrossel(), behavior: 'smooth' }); });
    btnNext.addEventListener('click', function () { track.scrollBy({ left: passoDoCarrossel(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { requestAnimationFrame(atualizarSetas); }, { passive: true });
    window.addEventListener('resize', atualizarSetas);
    atualizarSetas();

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: passoDoCarrossel(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); track.scrollBy({ left: -passoDoCarrossel(), behavior: 'smooth' }); }
    });

    /* Arrastar com o mouse */
    var arrastando = false, xInicial = 0, scrollInicial = 0, moveu = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;      /* no toque o próprio scroll nativo resolve */
      arrastando = true; moveu = 0;
      xInicial = e.clientX; scrollInicial = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!arrastando) return;
      var delta = e.clientX - xInicial;
      moveu = Math.abs(delta);
      track.scrollLeft = scrollInicial - delta;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      track.addEventListener(ev, function () {
        if (!arrastando) return;
        arrastando = false;
        track.classList.remove('is-dragging');
      });
    });
    track.addEventListener('click', function (e) {
      if (moveu > 8) { e.preventDefault(); e.stopPropagation(); moveu = 0; }
    }, true);
  }

  /* ---------- 7. Filtros dos projetos ---------- */
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filtro = chip.dataset.filter;

      $$('.chip').forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', String(on));
      });

      var visiveis = 0;
      slides.forEach(function (s) {
        var mostra = filtro === 'todos' || s.dataset.cat === filtro;
        s.hidden = !mostra;
        if (mostra) visiveis++;
      });

      if (vazio) vazio.hidden = visiveis > 0;
      track.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(atualizarSetas, 400);
    });
  });

  /* ---------- 8. Lightbox (foto ampliada) ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var galeria = [];
  var indice = 0;

  function cartoesVisiveis() {
    return slides.filter(function (s) { return !s.hidden; }).map(function (s) { return $('.card', s); });
  }

  function mostrarFoto(i) {
    if (!galeria.length) return;
    indice = (i + galeria.length) % galeria.length;
    var card = galeria[indice];
    lbImg.src = card.dataset.img;
    lbImg.alt = $('img', card).alt;
    lbCap.textContent = card.dataset.title;
  }

  if (lb && lbImg) {
    $$('.card').forEach(function (card) {
      card.addEventListener('click', function () {
        galeria = cartoesVisiveis();
        mostrarFoto(galeria.indexOf(card));
        if (typeof lb.showModal === 'function') lb.showModal();
      });
    });

    $('#lbNext').addEventListener('click', function () { mostrarFoto(indice + 1); });
    $('#lbPrev').addEventListener('click', function () { mostrarFoto(indice - 1); });
    $('#lbClose').addEventListener('click', function () { lb.close(); });

    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrarFoto(indice + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); mostrarFoto(indice - 1); }
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) lb.close();   /* clicou fora da foto */
    });
  }

  /* ---------- 9. Simulador de economia ---------- */
  var HSP = 5.2;        /* horas de sol pleno por dia na região */
  var RENDIMENTO = 0.78;/* eficiência real do sistema */
  var TARIFA = 0.95;    /* R$ por kWh */
  var POT_MODULO = 610; /* watts por módulo */
  var TAXA_MINIMA = { mono: 30, bi: 50, tri: 100 };  /* kWh que continuam na conta */

  var campoConta = $('#conta');
  var campoTipo = $('#tipoImovel');
  var simCta = $('#simCta');

  function calcular() {
    if (!campoConta) return;

    var conta = Math.max(parseFloat(campoConta.value) || 0, 0);
    var minimo = TAXA_MINIMA[campoTipo.value] || 50;

    var consumoMes = conta / TARIFA;
    var compensavel = Math.max(consumoMes - minimo, 0);

    var kwpNecessario = compensavel / (HSP * RENDIMENTO * 30);
    var modulos = Math.max(Math.ceil((kwpNecessario * 1000) / POT_MODULO), compensavel > 0 ? 1 : 0);
    var kwpReal = (modulos * POT_MODULO) / 1000;
    var geracaoMes = kwpReal * HSP * RENDIMENTO * 30;
    var economiaMes = Math.min(geracaoMes, compensavel) * TARIFA;

    $('#rEconomia').textContent = brl.format(economiaMes);
    $('#rKwp').textContent = kwpReal.toFixed(2).replace('.', ',') + ' kWp';
    $('#rModulos').textContent = modulos + (modulos === 1 ? ' módulo' : ' módulos');
    $('#rGeracao').textContent = num.format(geracaoMes) + ' kWh';
    $('#rTotal').textContent = brl.format(economiaMes * 12 * 25);

    if (simCta) {
      simCta.href = waLink(
        'Olá! Simulei no site da YES SOLAR.\n' +
        'Minha conta de luz é de aproximadamente ' + brl.format(conta) + ' por mês.\n' +
        'A simulação sugeriu ' + modulos + ' módulos (' + kwpReal.toFixed(2).replace('.', ',') + ' kWp) ' +
        'e economia de ' + brl.format(economiaMes) + ' por mês.\n' +
        'Quero o cálculo exato para o meu telhado.'
      );
    }
  }

  if (campoConta) {
    ['input', 'change'].forEach(function (ev) {
      campoConta.addEventListener(ev, calcular);
      campoTipo.addEventListener(ev, calcular);
    });
    $('#simForm').addEventListener('submit', function (e) { e.preventDefault(); });
    calcular();
  }

  /* ---------- 10. Formulário que abre o WhatsApp preenchido ---------- */
  var form = $('#waForm');

  function erro(campo, msg) {
    var box = campo.closest('.field');
    var alvo = $('[data-error-for="' + campo.id + '"]');
    box.classList.toggle('has-error', Boolean(msg));
    if (alvo) alvo.textContent = msg || '';
    if (msg) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    return !msg;
  }

  if (form) {
    var obrigatorios = [
      { id: 'nome',    msg: 'Escreva seu nome para a gente saber com quem falar.' },
      { id: 'cidade',  msg: 'Diga a cidade para conferirmos se atendemos a região.' },
      { id: 'servico', msg: 'Escolha o que você precisa.' }
    ];

    obrigatorios.forEach(function (item) {
      var campo = $('#' + item.id);
      campo.addEventListener('blur', function () {
        if (campo.value.trim()) erro(campo, '');
      });
      campo.addEventListener('input', function () {
        if (campo.value.trim()) erro(campo, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true, primeiroErro = null;
      obrigatorios.forEach(function (item) {
        var campo = $('#' + item.id);
        var valido = erro(campo, campo.value.trim() ? '' : item.msg);
        if (!valido) { ok = false; if (!primeiroErro) primeiroErro = campo; }
      });

      if (!ok) { primeiroErro.focus(); return; }

      var conta = $('#valorConta').value.trim();
      var extra = $('#mensagem').value.trim();

      var linhas = [
        'Olá! Vim pelo site da YES SOLAR.',
        '',
        'Nome: ' + $('#nome').value.trim(),
        'Cidade: ' + $('#cidade').value.trim(),
        'Preciso de: ' + $('#servico').value
      ];
      if (conta) linhas.push('Conta de luz: cerca de ' + brl.format(parseFloat(conta)) + ' por mês');
      if (extra) linhas.push('', extra);

      window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- 11. Aparecer ao rolar ----------
     Se o IntersectionObserver não existir (ou demorar), tudo aparece assim mesmo. */
  var alvos = $$([
    '.sec-head', '.feature__media', '.feature__body', '.band', '.diffs li',
    '.step', '.depo', '.sim__intro', '.sim__panel', '.contato__info', '.form',
    '.hero__facts li'
  ].join(','));

  function revelarTudo() { alvos.forEach(function (el) { el.classList.add('is-in'); }); }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    alvos.forEach(function (el) { obs.observe(el); });
    setTimeout(revelarTudo, 3500);   /* rede de segurança */
  } else {
    revelarTudo();
  }
})();
