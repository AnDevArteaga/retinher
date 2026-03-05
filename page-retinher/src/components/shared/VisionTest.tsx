import { useState, useRef } from 'react'
import gsap from 'gsap'

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const ISHIHARA_NUMEROS = [
  '3',
  '5',
  '6',
  '7',
  '8',
  '12',
  '29',
  '42',
  '45',
  '56',
  '74',
  '89',
]

function buildIshiharaOpciones(correct: string): string[] {
  const otros = ISHIHARA_NUMEROS.filter((n) => n !== correct)
  const wrong1 = otros[Math.floor(Math.random() * otros.length)]
  let wrong2 = otros[Math.floor(Math.random() * otros.length)]
  while (wrong2 === wrong1)
    wrong2 = otros[Math.floor(Math.random() * otros.length)]
  return shuffleArray([correct, wrong1, wrong2, 'No veo nada'])
}

export function VisionTest() {
  const [step, setStep] = useState(-1) // -1: Inicio, 0: Snellen, 1: Duocromo, 2: Astigmatismo, 3: Ishihara, 4: Resultados
  const [subStep, setSubStep] = useState(0)
  const [respuestas, setRespuestas] = useState<{
    snellen: string[]
    duocromo: string
    astigmatismo: string
    ishihara: string[]
  }>({
    snellen: [],
    duocromo: '',
    astigmatismo: '',
    ishihara: [],
  })
  const [ishiharaOpciones, setIshiharaOpciones] = useState<string[]>([])
  const cardRef = useRef(null)

  // --- CONFIGURACIÓN DE LOS EJERCICIOS ---
  const SNELLEN_STEPS = [
    { size: 'text-8xl', rotation: 0, label: 'Derecha' }, // Grande
    { size: 'text-4xl', rotation: 180, label: 'Izquierda' }, // Mediana
    { size: 'text-xl', rotation: 90, label: 'Abajo' }, // Pequeña
  ]

  const ISHIHARA_STEPS = [
    {
      img: 'https://www.colorlitelens.com/images/Ishihara/Ishihara_07.jpg',
      correct: '45',
    },
    {
      img: 'https://amamedicalproducts.com.au/cdn/shop/files/Ishihara-Colour-Blind-Test-Kanehara-14-Plate-1_1500x.png?v=1700466029',
      correct: '74',
    },
    {
      img: 'https://iristech.co/wp-content/uploads/2018/05/ishihara-number.jpg',
      correct: '12',
    },
    {
      img: 'https://www.colorlitelens.com/images/Ishihara/Ishihara_11.jpg',
      correct: '42',
    },
  ]

  // --- LÓGICA DE NAVEGACIÓN ---
  const nextStep = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setStep((prev) => prev + 1)
        setSubStep(0)
        if (step === 2)
          setIshiharaOpciones(buildIshiharaOpciones(ISHIHARA_STEPS[0].correct))
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
        )
      },
    })
  }

  // --- RENDERIZADO DE RESULTADOS REALES ---
  const renderInforme = () => {
    const hallazgos: string[] = []
    const fallosSnellen = respuestas.snellen.filter(
      (r, i) => r !== SNELLEN_STEPS[i].label,
    ).length
    const fallosIshihara = respuestas.ishihara.filter(
      (r, i) => r !== ISHIHARA_STEPS[i].correct,
    ).length

    if (fallosSnellen > 1)
      hallazgos.push(
        'Baja agudeza visual detectada. Requiere examen de refracción.',
      )
    if (respuestas.duocromo === 'Rojo')
      hallazgos.push('Tendencia a Miopía (enfoca mejor en longitudes largas).')
    if (respuestas.duocromo === 'Verde')
      hallazgos.push(
        'Tendencia a Hipermetropía (enfoca mejor en longitudes cortas).',
      )
    if (respuestas.astigmatismo === 'Sí')
      hallazgos.push('Signos de Astigmatismo (curvatura corneal irregular).')
    if (fallosIshihara > 1)
      hallazgos.push('Deficiencia en percepción de color (Posible Daltonismo).')

    return hallazgos.length > 0
      ? hallazgos
      : [
          'Tu visión parece estar dentro de los rangos normales para este tamizaje.',
        ]
  }

  return (
    <section
      id="vision-lab"
      className="min-h-screen bg-slate-100 py-20 flex items-center justify-center font-sans"
    >
      <div className="max-w-2xl w-full px-6" ref={cardRef}>
        {/* INICIO */}
        {step === -1 && (
          <div className="p-12 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
              Evaluación Visual <br />
              <span className="text-[var(--color-title)] uppercase text-sm tracking-[0.3em]">
                Nivel Clínico
              </span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed text-justify">
              Este test interactivo evalúa agudeza, contraste, enfoque y
              percepción de color.
            </p>
            <button
              onClick={() => setStep(0)}
              className="w-full bg-[var(--color-btn)] text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              Iniciar Test
            </button>
          </div>
        )}

        {/* 1. TEST DE SNELLEN DINÁMICO (LA LETRA E) */}
        {step === 0 && (
          <div className="p-10 text-center">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
              Agudeza Visual (Nivel {subStep + 1})
            </span>
            <div className="my-12 flex justify-center items-center h-40">
              <div
                className={`font-sans font-bold text-black transition-all duration-500 ${SNELLEN_STEPS[subStep].size}`}
                style={{
                  transform: `rotate(${SNELLEN_STEPS[subStep].rotation}deg)`,
                }}
              >
                E
              </div>
            </div>
            <p className="mb-8 font-medium">
              ¿Hacia dónde apuntan las "patas" de la E?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Arriba', 'Abajo', 'Izquierda', 'Derecha'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => {
                    const r = [...respuestas.snellen, dir]
                    setRespuestas({ ...respuestas, snellen: r })
                    if (subStep < 2) setSubStep(subStep + 1)
                    else nextStep()
                  }}
                  className="py-4 border-2 border-slate-200 rounded-2xl hover:border-[var(--color-btn)] font-bold"
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. TEST BICROMÁTICO */}
        {step === 1 && (
          <div className="p-10 text-center">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
              Test Duocromo
            </span>
            <div>
              <img
                src="https://www.kiversal.com/web/image/1476-4f14bf59/Dise%C3%B1o%20sin%20t%C3%ADtulo%20%2844%29.png"
                alt="test duocromo"
                className="w-2/3 mx-auto"
              />
            </div>
            <p className="mb-8 font-medium">
              ¿En qué fondo ves las letras más definidas?
            </p>
            <div className="grid grid-cols-1 gap-4">
              {['Rojo', 'Verde', 'Ambos iguales'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setRespuestas({ ...respuestas, duocromo: opt })
                    nextStep()
                  }}
                  className="py-4 border-2 border-slate-200 rounded-2xl font-bold hover:border-[var(--color-btn)]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. TEST DE ASTIGMATISMO */}
        {step === 2 && (
          <div className="p-10 text-center">
            <span className="text-[var(--color-title)] font-black text-xs uppercase tracking-widest">
              Círculo Horario
            </span>
            <div className="my-8 flex justify-center">
              <img
                src="https://cupones.optica2000.com/bloomreach-iframes/tests/visual/es/img/test-ast.png"
                className="h-96"
                alt="Astigmatismo"
              />
            </div>
            <p className="mb-8 font-medium text-sm">
              ¿Ves algunas líneas más oscuras que otras?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Sí', 'No'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setRespuestas({ ...respuestas, astigmatismo: opt })
                    nextStep()
                  }}
                  className="py-4 border-2 border-slate-200 rounded-2xl font-bold hover:border-[var(--color-btn)]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. TEST DE ISHIHARA (4 EJERCICIOS) */}
        {step === 3 && (
          <div className="p-10 text-center">
            <span className="text-[var(--color-title)] font-black text-xs uppercase tracking-widest">
              Test de Ishihara ({subStep + 1}/4)
            </span>
            <div className="my-8 flex justify-center">
              <img
                src={ISHIHARA_STEPS[subStep].img}
                className="h-48 rounded-full border-4 border-slate-200"
                alt="Ishihara"
              />
            </div>
            <p className="mb-8 font-medium text-sm">¿Qué número ves?</p>
            <div className="grid grid-cols-2 gap-4">
              {(ishiharaOpciones.length === 4
                ? ishiharaOpciones
                : [ISHIHARA_STEPS[subStep].correct, 'No veo nada', '42', '5']
              ).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const r = [...respuestas.ishihara, opt]
                    setRespuestas({ ...respuestas, ishihara: r })
                    if (subStep < 3) {
                      setIshiharaOpciones(
                        buildIshiharaOpciones(
                          ISHIHARA_STEPS[subStep + 1].correct,
                        ),
                      )
                      setSubStep(subStep + 1)
                    } else nextStep()
                  }}
                  className="py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-[var(--color-btn)]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTADOS FINALES */}
        {step === 4 && (
          <div className="p-12 border-t-[12px] border-[var(--color-btn)]">
            <h3 className="text-3xl font-black mb-6">Informe de Resultados</h3>
            <div className="space-y-4 mb-10">
              {renderInforme().map((h, i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-50 border-l-4 border-[var(--color-btn)] rounded-r-xl flex items-start gap-3"
                >
                  <span className="text-[var(--color-btn)] mt-1">●</span>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {h}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-[var(--color-title)] p-6 rounded-3xl text-white mb-8">
              <p className="text-xs opacity-70 leading-relaxed italic text-justify">
                *Este es un tamizaje digital. se recomienda una evaluación
                clínica completa para confirmar estos hallazgos.*
              </p>
            </div>
            <button
              onClick={() => {
                const whatsapp: { numero: string; mensaje: string } = {
                  numero: '573227861029',
                  mensaje: 'Hola, me gustaría agendar una consulta',
                }
                window.open(
                  `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`,
                  '_blank',
                )
              }}
              className="w-full bg-[var(--color-btn)] py-5 rounded-2xl text-white font-black hover:bg-[var(--color-btn-hover)] transition-all shadow-xl shadow-[var(--color-btn)] uppercase tracking-widest"
            >
              Agendar con Especialista
            </button>
            <button
              onClick={() => setStep(-1)}
              className="w-full py-5 rounded-2xl text-[var(--color-text)] font-black hover:text-[var(--color-btn)] transition-all"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
