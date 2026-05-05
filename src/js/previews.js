/**
 * Preview Carousel — Portfolio
 *
 * Como funciona:
 * - Cada `.project-preview` precisa de um atributo `data-slug="nome-do-projeto"`
 * - O JS testa `nome-do-projeto-1.webp`, `nome-do-projeto-2.webp`, ... até o primeiro 404
 * - Constrói o carousel com quantas imagens forem encontradas (sem limite fixo)
 * - Setas e dots aparecem apenas quando há 2+ imagens
 */
(function () {
  'use strict';

  /** Caminho relativo de src/pages/projetos.html até a pasta de previews */
  const BASE_PATH = '../../assets/images/previews/';

  /** Extensões tentadas em ordem de prioridade */
  const EXTS = ['webp', 'jpg', 'png'];

  /** Testa se uma URL de imagem carrega com sucesso */
  function tryLoad(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload  = () => resolve(src);   // retorna a src se ok
      img.onerror = () => resolve(null);  // retorna null se 404/erro
      img.src = src;
    });
  }

  /**
   * Sonda imagens para `slug` em sequência (1, 2, 3, …)
   * Para no primeiro índice que não carregou nenhuma extensão.
   * @returns {Promise<string[]>} lista de srcs que existem
   */
  async function probeSlides(slug) {
    const found = [];
    for (let i = 1; ; i++) {
      let loaded = null;
      for (const ext of EXTS) {
        loaded = await tryLoad(`${BASE_PATH}${slug}-${i}.${ext}`);
        if (loaded) break;
      }
      if (!loaded) break; // primeiro índice que não existe → para
      found.push(loaded);
    }
    return found;
  }

  async function initCarousel(preview) {
    const slug = preview.dataset.slug;
    if (!slug) return;

    const track       = preview.querySelector('.preview-track');
    const btnPrev     = preview.querySelector('.preview-arrow--prev');
    const btnNext     = preview.querySelector('.preview-arrow--next');
    const dotsCont    = preview.querySelector('.preview-dots');
    if (!track) return;

    // Sonda todas as imagens disponíveis para este projeto
    const srcs = await probeSlides(slug);
    if (srcs.length === 0) return; // sem imagens → mantém o placeholder

    // Aplica largura customizada via data-preview-width (ex: "560", "640", "100%")
    const customWidth = preview.dataset.previewWidth;
    if (customWidth) {
      const val = /^\d+$/.test(customWidth) ? `${customWidth}px` : customWidth;
      preview.style.maxWidth = val;
    }

    // Injeta os <img> no track
    srcs.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Preview ${i + 1} — ${slug}`;
      img.loading = i === 0 ? 'eager' : 'lazy';
      track.appendChild(img);
    });

    // Com apenas 1 imagem não há carousel
    const total = srcs.length;
    if (total === 1) return;

    // --- Carousel com 2+ imagens ---
    let current = 0;

    // Cria os dots
    srcs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'preview-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1} de ${total}`);
      dot.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(i); });
      dotsCont.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsCont.querySelectorAll('.preview-dot').forEach((d, i) =>
        d.classList.toggle('is-active', i === current)
      );
    }

    btnPrev.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(current - 1); });
    btnNext.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(current + 1); });

    // Revela setas e dots
    btnPrev.removeAttribute('hidden');
    btnNext.removeAttribute('hidden');
    dotsCont.removeAttribute('hidden');

    // Suporte a teclado
    preview.setAttribute('tabindex', '0');
    preview.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });
  }

  // Inicializa todos os carousels em paralelo após o load da página
  window.addEventListener('load', () => {
    document.querySelectorAll('.project-preview[data-slug]').forEach(initCarousel);
  });
})();
