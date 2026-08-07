"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const painPoints = [
  "Seis abas abertas. Nenhuma decisão.",
  "O hospital de confiança ficou fora da rede.",
  "A coparticipação veio maior que a mensalidade.",
  "O reajuste chegou sem explicação.",
  "Trocar de plano parece recomeçar do zero.",
];

const deliverables = [
  { n: "01", title: "Comparativo que cabe em uma tela", text: "Mensalidade, coparticipação, carência, rede e o que cada opção deixa de fora — sem folheto e sem letras miúdas." },
  { n: "02", title: "A rede do seu CEP, antes da assinatura", text: "Hospitais e laboratórios realmente próximos. Inclusive quando nenhuma opção atende bem à sua região." },
  { n: "03", title: "Cenários de custo a longo prazo", text: "Três cenários de reajuste para enxergar além da mensalidade de entrada. Simulação para decidir, nunca promessa." },
  { n: "04", title: "A lista do que ficou de fora", text: "Você recebe também as opções descartadas e o motivo. É essa parte que devolve segurança para a sua escolha." },
];

const support = [
  { n: "01", title: "Negativa de cobertura", text: "Ajudo você a pedir a justificativa por escrito, entender o fundamento e localizar o canal adequado para encaminhar o caso." },
  { n: "02", title: "Reajuste e renovação", text: "Organizo o que precisa ser solicitado e comparo o histórico do contrato antes de qualquer decisão apressada." },
  { n: "03", title: "Autorização e reembolso", text: "Quando o processo trava, você sabe o que pedir, quais documentos separar e por onde começar." },
  { n: "04", title: "Mudança de rede", text: "Se um prestador importante sair, avaliamos juntos o impacto e se é hora de estudar outras possibilidades." },
];

const modalities = [
  { type: "Individual / Familiar", best: "Proteção contratual", fit: "Para quem não tem CNPJ e valoriza maior previsibilidade.", attention: "O preço de entrada costuma ser mais alto e há menor oferta." },
  { type: "Coletivo por adesão", best: "Acesso sem CNPJ", fit: "Para quem possui vínculo com conselho, sindicato ou entidade.", attention: "Reajustes e permanência dependem das regras do contrato e do vínculo." },
  { type: "MEI / PME", best: "Entrada competitiva", fit: "Para autônomos e pequenas empresas que cumprem os critérios.", attention: "Preço inicial não significa menor custo no longo prazo." },
  { type: "Empresarial", best: "Gestão do benefício", fit: "Para empresas com equipe consolidada e visão de continuidade.", attention: "Sinistralidade e regras de negociação precisam de acompanhamento." },
];

const faqs = [
  { q: "Eu pago mais caro contratando com corretor?", a: "Em regra, a remuneração da corretagem vem da operadora. Se existir qualquer taxa adicional, ela deve ser informada antes da contratação. Na versão final do site, esse ponto será ajustado ao modelo real de trabalho da Suzayne." },
  { q: "Dá para trocar aproveitando a carência que já cumpri?", a: "Em muitos casos, sim. A portabilidade pode ser solicitada a qualquer momento, sem janela de aniversário, desde que os requisitos da ANS sejam atendidos — como permanência mínima, adimplência, contrato compatível e faixa de preço." },
  { q: "Quanto tempo até eu poder usar o plano?", a: "Os prazos variam conforme a cobertura e o contrato. Existem limites regulatórios, mas campanhas e condições específicas podem reduzir alguns períodos. A análise precisa ser feita na proposta vigente, nunca apenas na promessa verbal." },
  { q: "Coparticipação vale a pena?", a: "Depende do perfil de uso. Quem usa pouco pode economizar; acompanhamento contínuo, filhos pequenos ou tratamentos frequentes podem elevar o custo total. A conta correta soma mensalidade e estimativa de utilização." },
  { q: "Tenho uma condição já diagnosticada. Posso contratar?", a: "Pode. A condição deve ser declarada corretamente. Poderá haver Cobertura Parcial Temporária para determinados procedimentos relacionados a ela, enquanto as demais coberturas continuam sujeitas às carências do contrato." },
  { q: "E se o plano negar alguma coisa depois?", a: "Peça a justificativa formal. A comunicação deve ser clara e indicar o fundamento contratual ou legal. Suzayne pode ajudar a organizar o pedido, interpretar a resposta e indicar os canais adequados, sem prometer um resultado que depende da operadora e da ANS." },
];

type Answers = { situation?: string; forWho?: string; cep?: string; hospital?: string; ages?: string; condition?: string };

function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const screens = useMemo(() => [
    { key: "situation" as const, title: "Como está sua situação hoje?", options: ["Não tenho plano de saúde", "Tenho e quero trocar", "Tenho pela empresa e vou perder", "Quero saber se estou pagando caro"] },
    { key: "forWho" as const, title: "O plano é para quem?", options: ["Só para mim", "Para mim e minha família", "Tenho CNPJ (MEI ou empresa)", "Para minha empresa, com funcionários"] },
    { key: "cep" as const, title: "Qual é o seu CEP?", placeholder: "00000-000", note: "Usado apenas para orientar a rede da região. Não fica salvo." },
    { key: "hospital" as const, title: "Tem hospital ou médico de que não abre mão?", placeholder: "Digite aqui ou deixe em branco", note: "Essa informação costuma eliminar boa parte das opções." },
    { key: "ages" as const, title: "Qual é a idade de quem vai entrar?", placeholder: "Ex.: 34, 32 e 7 anos", note: "A idade influencia o preço atual e as próximas faixas." },
    { key: "condition" as const, title: "Existe alguma condição já diagnosticada?", options: ["Não", "Sim", "Prefiro falar sobre isso depois"], note: "Dado sensível: processado somente neste navegador e não armazenado." },
  ], []);

  const current = screens[step];
  const choose = (value: string) => {
    if (transitioning) return;
    const key = current.key;
    setAnswers((old) => ({ ...old, [key]: value }));
    setSelected(value);
    setTransitioning(true);
    window.setTimeout(() => {
      setStep((old) => Math.min(old + 1, screens.length));
      setSelected(null);
      setTransitioning(false);
    }, 240);
  };
  const typeValue = (value: string) => setAnswers((old) => ({ ...old, [current.key]: value }));
  const restart = () => { setAnswers({}); setSelected(null); setTransitioning(false); setStep(0); };
  const goBack = () => { setSelected(null); setTransitioning(false); setStep((old) => Math.max(0, old - 1)); };

  if (step === screens.length) {
    const business = answers.forWho?.includes("CNPJ") || answers.forWho?.includes("empresa");
    const switching = answers.situation?.includes("trocar") || answers.situation?.includes("perder") || answers.situation?.includes("pagando");
    return (
      <div className="diagnostic-card result-card" aria-live="polite">
        <div className="diagnostic-top"><span>Sua pré-análise</span><small>Concluída ✓</small></div>
        <p>Há dois caminhos que merecem comparação.</p>
        <div className="result-option"><small>Mais indicado para investigar</small><b>{business ? "Plano empresarial sob medida" : "Plano individual ou familiar"}</b><span>{business ? "Seu perfil permite avaliar contratos empresariais, mas o custo de longo prazo precisa entrar na conta." : "Tende a oferecer mais previsibilidade contratual para o perfil informado."}</span></div>
        <div className="result-option muted"><small>Também vale comparar</small><b>{switching ? "Portabilidade de carências" : "Coletivo por adesão"}</b><span>{switching ? "Seu plano atual pode abrir a possibilidade de troca sem reiniciar tudo, desde que os requisitos sejam atendidos." : "Pode fazer sentido se houver vínculo elegível e as regras forem vantajosas."}</span></div>
        <div className="result-alert"><span>!</span><p><b>Ponto de atenção</b>A rede do CEP {answers.cep || "informado"} e as idades precisam ser cruzadas com propostas vigentes antes de recomendar qualquer plano.</p></div>
        <button className="button button-dark" onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}>Quero a comparação real <span>↗</span></button>
        <button className="restart" onClick={restart}>Refazer diagnóstico</button>
      </div>
    );
  }

  return (
    <div className="diagnostic-card">
      <div className="diagnostic-top"><span>Pré-análise pessoal</span><small>{String(step + 1).padStart(2, "0")} / 06</small></div>
      <div className="progress-track"><i style={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
      <div className="step-dots" aria-hidden="true">{screens.map((_, index) => <i className={index <= step ? "active" : ""} key={index} />)}</div>
      <div className={`question-stage ${transitioning ? "is-leaving" : ""}`} key={step}>
        <p>{current.title}</p>
        {current.options ? current.options.map((option, index) => <button className={`diagnostic-option ${selected === option ? "selected" : ""}`} disabled={transitioning} key={option} onClick={() => choose(option)}><span className="option-index">{String(index + 1).padStart(2, "0")}</span><span className="option-label">{option}</span><span className="option-arrow">→</span></button>) : (
          <>
            <label className="diagnostic-field"><span className="sr-only">{current.title}</span><input value={answers[current.key] || ""} onChange={(e) => typeValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && answers[current.key]?.trim() && choose(answers[current.key] || "")} placeholder={current.placeholder} autoComplete={current.key === "cep" ? "postal-code" : "off"} /></label>
            <button className="field-next" disabled={!answers[current.key]?.trim() || transitioning} onClick={() => choose(answers[current.key] || "")}>Continuar <span>→</span></button>
          </>
        )}
        {current.note && <small className="privacy-note">{current.note}</small>}
      </div>
      {step > 0 && <button className="back-step" onClick={goBack}>← Voltar</button>}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    revealElements.forEach((element) => {
      const siblings = element.parentElement
        ? Array.from(element.parentElement.children).filter((child) => child.classList.contains("reveal"))
        : [];
      const siblingIndex = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * 85, 255)}ms`);
      reveal.observe(element);
    });

    const onScroll = () => { setScrolled(window.scrollY > 80); setShowFloat(window.scrollY > document.documentElement.scrollHeight * .4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      reveal.disconnect();
      root.classList.remove("motion-ready");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goToDiagnostic = () => { document.querySelector("#diagnostico")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <main id="conteudo">
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Suzayne Pinheiro — início"><span className="brand-mark">SP</span><span><b>Suzayne Pinheiro</b><small>Planos de saúde</small></span></a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Navegação principal">
          <a href="#entrega" onClick={() => setMenuOpen(false)}>O que você recebe</a><a href="#diagnostico" onClick={() => setMenuOpen(false)}>Diagnóstico</a><a href="#acompanhamento" onClick={() => setMenuOpen(false)}>Pós-venda</a><a href="#sobre" onClick={() => setMenuOpen(false)}>Quem sou eu</a>
          <button className="nav-cta" onClick={goToDiagnostic}>Falar comigo <span>↗</span></button>
        </nav>
        <button className="menu-button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-image"><Image src="/hero-suzayne-real.webp" alt="Suzayne Pinheiro, consultora de planos de saúde" fill priority sizes="100vw" quality={82} unoptimized /></div><div className="hero-vignette" aria-hidden="true" /><div className="hero-grain" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Plano de Saúde em São Paulo</p>
          <h1>Entre tantas opções,<br /><em>poucas servem</em> pra você.</h1>
          <p className="hero-copy">Meu trabalho é encontrar essas poucas — e te dizer, com clareza, por que as outras ficaram de fora.</p>
          <div className="hero-actions"><button className="button button-light" onClick={goToDiagnostic}>Fazer meu diagnóstico <span>↗</span></button><a className="text-link" href="#contato">Prefiro falar direto <span>→</span></a></div>
          <div className="hero-proof" aria-label="Características do diagnóstico"><div className="proof-item"><b>02</b><span>minutos</span></div><div className="proof-item"><b>✓</b><span>sem cadastro</span></div><div className="proof-item"><b>✓</b><span>resultado na tela</span></div></div>
        </div>
        <div className="hero-identity"><span>SP</span><div><b>Suzayne Pinheiro</b><small>Consultoria para famílias e empresas</small></div></div>
        <div className="scroll-cue"><span>Role para descobrir</span><i /></div>
      </section>

      <section className="pain-section">
        <div className="section-shell pain-grid"><div className="reveal"><p className="section-index">01 — Talvez você reconheça</p><h2>Escolher um plano não deveria parecer uma aposta.</h2></div><div className="pain-list reveal">{painPoints.map((pain, index) => <div className="pain-row" key={pain}><span>0{index + 1}</span><p>{pain}</p><i>↗</i></div>)}</div></div>
        <p className="pain-statement reveal">Nada disso é falta de atenção sua.<br /><em>É um mercado difícil de comparar.</em></p>
      </section>

      <section className="delivery-section" id="entrega">
        <div className="section-shell"><div className="delivery-heading reveal"><p className="section-index light">02 — O que muda na prática</p><h2>Não é uma cotação.<br /><em>É clareza para decidir.</em></h2><p>Você não recebe uma pilha de PDFs. Recebe um raciocínio organizado sobre o seu caso.</p></div>
          <div className="delivery-grid">{deliverables.map((item) => <article className="delivery-card reveal" key={item.n}><span>{item.n}</span><i>↗</i><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
          <div className="promise-strip reveal"><span>Sem custo</span><span>Sem compromisso</span><span>Por escrito</span><p>Se você já estiver bem servido, eu digo isso.</p></div>
        </div>
      </section>

      <section className="diagnostic-intro" id="diagnostico"><div className="section-shell diagnostic-shell reveal"><div><p className="section-index">03 — Diagnóstico</p><h2>Seu caso primeiro.<br /><em>O catálogo depois.</em></h2><p className="diagnostic-copy">Seis perguntas, nenhum cadastro. No final, você vê os caminhos que merecem comparação e os pontos de atenção do seu perfil.</p></div><Diagnostic /></div></section>

      <section className="support-section" id="acompanhamento">
        <div className="section-shell"><div className="support-intro"><div className="support-heading reveal"><p className="section-index light">04 — Depois da contratação</p><h2>A venda é o começo.<br /><em>Não o fim do trabalho.</em></h2><p>Quando o uso do plano ficar confuso, você terá um canal próximo para organizar cada passo — da primeira solicitação ao acompanhamento do caso.</p></div><div className="support-gallery reveal" aria-label="Famílias atendidas com cuidado e proximidade"><div className="support-photo family-photo" role="img" aria-label="Família sorrindo em ambiente residencial sofisticado"><span>Proteção para toda a família</span></div><div className="support-photo couple-photo" role="img" aria-label="Casal sorrindo em ambiente acolhedor"><span>Cuidado que acompanha</span></div></div></div>
          <div className="support-list">{support.map((item) => <article className="support-item reveal" key={item.n}><span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
          <div className="honesty reveal"><span>Uma conversa honesta</span><p>O resultado depende da operadora e da ANS. O compromisso de Suzayne é com o canal, o método e o encaminhamento — para você não enfrentar tudo sem saber o que pedir nem para quem.</p></div>
        </div>
      </section>

      <section className="contrast-section">
        <div className="section-shell"><div className="contrast-title reveal"><p className="section-index">05 — Antes e depois</p><h2>A diferença não é o plano.<br /><em>É como você chega nele.</em></h2></div>
          <div className="contrast-grid reveal"><div><span>Decidindo sozinho</span><ul><li>Compara só a mensalidade</li><li>Descobre a rede depois de assinar</li><li>Escolhe sem saber o que ficou de fora</li><li>Enfrenta o 0800 sem direção</li></ul></div><div className="with-suzayne"><span>Decidindo com Suzayne</span><ul><li>Compara custo, rede e contrato</li><li>Vê os prestadores antes da assinatura</li><li>Conhece os descartes e os motivos</li><li>Sabe o que pedir e por onde começar</li></ul></div></div>
        </div>
      </section>

      <section className="modalities-section" id="modalidades"><div className="section-shell"><div className="modalities-title reveal"><p className="section-index">06 — Formas de contratar</p><h2>Nenhuma modalidade é perfeita.<br /><em>Cada uma serve a um cenário.</em></h2></div>
        <div className="modalities-table reveal">{modalities.map((item, i) => <article key={item.type}><span>0{i + 1}</span><h3>{item.type}</h3><div><small>Força principal</small><b>{item.best}</b></div><p>{item.fit}</p><p className="attention"><small>Ponto de atenção</small>{item.attention}</p></article>)}</div>
        <button className="button button-dark center-button" onClick={goToDiagnostic}>Descobrir o meu caso <span>↗</span></button></div>
      </section>

      <section className="about-section" id="sobre"><div className="section-shell about-grid"><div className="portrait-suzayne reveal"><Image src="/hero-suzayne-real.webp" alt="Suzayne Pinheiro em atendimento consultivo" fill sizes="(max-width: 800px) 88vw, 36vw" quality={82} unoptimized /><span>Foto provisória criada a partir da referência enviada</span></div><div className="about-copy reveal"><p className="section-index light">07 — Suzayne Pinheiro</p><h2>Plano de saúde é contrato.<br /><em>Mas também é cuidado.</em></h2><p>Meu trabalho começa entendendo onde você quer ser atendido, quem precisa estar protegido e o que não pode ficar de fora. Só depois eu comparo as modalidades e reduzo as opções ao que realmente merece sua atenção.</p><p>Você recebe os motivos da recomendação, os pontos de atenção e o que foi descartado — para escolher com segurança, sem depender de promessa verbal.</p><blockquote>“A melhor escolha não é a que parece mais barata hoje. É a que continua fazendo sentido quando você precisa usar.”</blockquote><div className="credentials"><span>Corretagem multimarcas</span><span>Registro SUSEP a inserir</span><span>Atendimento personalizado</span></div></div></div></section>

      <section className="anti-section"><div className="section-shell anti-grid"><div className="anti-title reveal"><p className="section-index">08 — Transparência</p><h2>O que eu<br /><em>não faço.</em></h2></div><div className="anti-list reveal"><article><span>01</span><div><h3>Não empurro um catálogo.</h3><p>Reduzo a comparação ao que realmente faz sentido para o seu perfil.</p></div></article><article><span>02</span><div><h3>Não prometo rede sem documento.</h3><p>Hospital e laboratório precisam constar na proposta vigente.</p></div></article><article><span>03</span><div><h3>Não escondo o lado ruim.</h3><p>Todo plano deixa algo de fora. Você precisa saber antes de assinar.</p></div></article><article><span>04</span><div><h3>Não vendo se você já está bem servido.</h3><p>Se o seu plano atual for a melhor escolha, a análise termina ali.</p></div></article></div></div></section>

      <section className="faq-section"><div className="section-shell faq-grid"><div className="faq-title reveal"><p className="section-index">09 — Perguntas frequentes</p><h2>As dúvidas que<br /><em>todo mundo traz.</em></h2><p>As respostas abaixo seguem a copy regulatória enviada e devem receber revisão especializada antes da publicação.</p></div><div className="faq-list reveal">{faqs.map((item, i) => <details key={item.q}><summary><span>0{i + 1}</span>{item.q}<i>+</i></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="final-cta" id="contato"><div className="final-glow" /><div className="final-content reveal"><p className="eyebrow"><span /> Uma decisão importante merece método</p><h2>Vamos fazer<br /><em>do jeito certo?</em></h2><p>Conte apenas o seu cenário. Sem compromisso, sem pressão e sem uma ligação surpresa.</p><div><button className="button button-light">Conversar no WhatsApp <span>↗</span></button><button className="schedule-button">Agendar um horário →</button></div><small>Botões demonstrativos — conectar número e agenda antes da publicação.</small></div></section>

      <footer><div className="footer-main"><a className="brand footer-brand" href="#top"><span className="brand-mark">SP</span><span><b>Suzayne Pinheiro</b><small>Planos de saúde</small></span></a><div><small>Navegação</small><a href="#diagnostico">Diagnóstico</a><a href="#entrega">O que você recebe</a><a href="#acompanhamento">Pós-venda</a><a href="#sobre">Quem sou eu</a></div><div><small>Guias futuros</small><span>Carência e portabilidade</span><span>Reajuste do plano</span><span>Plano para MEI e PME</span><span>Negativa de cobertura</span></div><div><small>Dados para publicação</small><span>WhatsApp a inserir</span><span>E-mail a inserir</span><span>SUSEP a inserir</span><span>CNPJ a inserir</span></div></div><div className="footer-legal"><p>Informações de preços, redes e coberturas dependem das propostas e contratos vigentes das operadoras. Este modelo não substitui revisão jurídica especializada.</p><span>© 2026 Suzayne Pinheiro</span></div></footer>

      <button className={`floating-contact ${showFloat ? "visible" : ""}`} onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}><span>✦</span> Tirar uma dúvida</button>
      </main>
    </>
  );
}
