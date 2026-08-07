"use client";

import { useMemo, useState } from "react";

type Answers = { situation?: string; forWho?: string; cep?: string; hospital?: string; ages?: string; condition?: string };

export default function Diagnostic() {
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
