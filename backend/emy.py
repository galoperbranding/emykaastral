from langdetect import detect
from typing import Dict, List, Optional
import random
import re

class EmyAI:
    def __init__(self):
        # Temas restringidos: solo se entregan en los PDFs
        self.restricted_topics = {
            "es": [
                "interpretacion completa", "manual personal", "pdf", "contenido completo",
                "explicacion detallada", "analisis profundo", "todo el informe",
                "informe completo", "entrega completa", "resultado completo",
                "resultado final", "detalle completo", "explicación completa"
            ],
            "en": [
                "full interpretation", "personal manual", "pdf", "full content",
                "detailed explanation", "deep analysis", "full report",
                "complete report", "full delivery", "complete result",
                "final result", "complete detail", "full explanation"
            ]
        }
        self.name = "Emyka"
        import threading
        self._lock = threading.Lock()
        # Contexto conversacional en memoria por usuario
        self.user_context: Dict[str, List[Dict[str, str]]] = {}

        # Base de conocimiento "entrenada" (Topics Knowledge Base) — Bilingüe
        self.knowledge_base = {
            "carta_astral": {
                "keywords": {"es": ["carta astral", "natal"], "en": ["birth chart", "natal chart", "astral chart"]},
                "responses": {
                    "es": [
                        "Tu Carta Astral es el mapa del cielo en el momento exacto en que naciste. No es solo tu signo solar, es una huella digital cósmica única que revela tu potencial.",
                        "Imagina la Carta Astral como tu manual de instrucciones de fábrica. Muestra tus talentos ocultos, tus desafíos emocionales y tu propósito de vida."
                    ],
                    "en": [
                        "Your Birth Chart is the map of the sky at the exact moment you were born. It's not just your Sun sign — it's a unique cosmic fingerprint that reveals your potential.",
                        "Think of your Birth Chart as your factory instruction manual. It shows your hidden talents, emotional challenges, and life purpose."
                    ]
                },
                "suffix": {"es": " Es la base de nuestro Manual Personal. 🌟", "en": " It's the foundation of our Personal Manual. 🌟"}
            },
            "revolucion_solar": {
                "keywords": {"es": ["revoluci", "solar"], "en": ["solar return", "solar revolution", "annual forecast"]},
                "responses": {
                    "es": [
                        "La Revolución Solar es tu pronóstico anual, se calcula cada año cuando el Sol vuelve a la posición exacta de tu nacimiento. Marca la energía disponible para tu año.",
                        "A diferencia de la carta natal que es fija, la Revolución Solar cambia cada cumpleaños. Es ideal para saber en qué áreas de tu vida enfocarte este año."
                    ],
                    "en": [
                        "The Solar Return is your annual forecast, calculated each year when the Sun returns to your exact birth position. It marks the energy available for your year.",
                        "Unlike your fixed birth chart, the Solar Return changes every birthday. It's ideal for knowing which areas of your life to focus on this year."
                    ]
                },
                "suffix": {"es": "", "en": ""}
            },
            "mapa_numerologico": {
                "keywords": {"es": ["numero", "mapa"], "en": ["numerolog", "number map", "life path"]},
                "responses": {
                    "es": [
                        "El Mapa Numerológico complementa tu astrología decodificando la vibración de tu nombre y fecha de nacimiento. Revela ciclos de vida y misiones ocultas.",
                        "Los números no mienten. Tu mapa numerológico nos dice 'el qué' y 'el cuándo' de tus aprendizajes vitales."
                    ],
                    "en": [
                        "The Numerological Map complements your astrology by decoding the vibration of your name and birth date. It reveals life cycles and hidden missions.",
                        "Numbers don't lie. Your numerological map tells us the 'what' and 'when' of your life lessons."
                    ]
                },
                "suffix": {"es": "", "en": ""}
            },
            "signos": {
                "keywords": {"es": ["signo"], "en": ["sign", "zodiac"]},
                "responses": {
                    "es": [
                        "Los signos son los disfraces que usan los planetas. Cada uno tiene una energía: Fuego (acción), Tierra (materia), Aire (mente) o Agua (emoción).",
                        "Más allá de tu signo solar, tienes a los 12 signos en alguna parte de tu carta. Donde caigan, es donde actúas con esa energía."
                    ],
                    "en": [
                        "Signs are the costumes planets wear. Each carries an energy: Fire (action), Earth (matter), Air (mind) or Water (emotion).",
                        "Beyond your Sun sign, all 12 signs live somewhere in your chart. Wherever they land, that's where you express that energy."
                    ]
                },
                "suffix": {
                    "es": " ¿Sabes en qué signo tienes tu Sol o tu Venus?",
                    "en": " Do you know which sign your Sun or Venus is in?"
                }
            },
            "compatibilidad": {
                "keywords": {"es": ["compatib", "pareja"], "en": ["compatib", "partner", "relationship", "soulmate"]},
                "responses": {
                    "es": [
                        "La compatibilidad no es solo 'tauro se lleva bien con virgo'. Se trata de cómo la Luna de uno habla con el Sol del otro, o cómo sus Venus se entienden.",
                        "En astrología psicológica, no hay signos incompatibles, solo maestros difíciles. Todo depende del nivel de consciencia de la pareja."
                    ],
                    "en": [
                        "Compatibility isn't just 'Taurus gets along with Virgo.' It's about how one person's Moon speaks to the other's Sun, or how their Venus placements connect.",
                        "In psychological astrology, there are no incompatible signs — only challenging teachers. It all depends on the couple's level of awareness."
                    ]
                },
                "suffix": {
                    "es": " En tu Manual Personal analizamos tu Venus a profundidad.",
                    "en": " In your Personal Manual, we analyze your Venus in depth."
                }
            }
        }

        # Estrategia de Ventas (Pillars) — Bilingüe
        self.sales_pillars = {
            "sol": {
                "keywords": {
                    "es": ["quien soy", "propósito", "identidad", "talento", "perdida", "no se que hacer", "sol", "rumbo", "camino"],
                    "en": ["who am i", "purpose", "identity", "talent", "lost", "don't know what to do", "sun", "direction", "path"]
                },
                "response": {
                    "es": "El SOL es vital porque define tu Identidad, tu brillo natural y tu Propósito. Conocerlo es clave para dejar de sentirte perdida y activar tu talento único. ☀️ Justamente, nuestro **MANUAL PERSONAL** (que incluye los 4 PDF completos) comienza descifrando tu Sol para que recuperes el rumbo de tu vida.",
                    "en": "The SUN is vital because it defines your Identity, your natural brilliance, and your Purpose. Understanding it is key to stop feeling lost and activate your unique talent. ☀️ Our **PERSONAL MANUAL** (which includes all 4 complete PDFs) begins by decoding your Sun so you can find your path again."
                },
                "topic": {"es": "Identidad y Propósito", "en": "Identity and Purpose"}
            },
            "venus": {
                "keywords": {
                    "es": ["amor", "pareja", "relacion", "vínculo", "soledad", "toxic", "venus", "novio", "esposo", "soltera"],
                    "en": ["love", "partner", "relationship", "bond", "loneliness", "toxic", "venus", "boyfriend", "husband", "single"]
                },
                "response": {
                    "es": "VENUS es esencial porque rige cómo amas y te valoras. Entenderlo te permite romper patrones tóxicos y atraer relaciones sanas. 💜 En el **MANUAL PERSONAL** no solo analizamos tu Venus, sino todo tu mapa (4 PDF) para darte una visión completa de por qué vives lo que vives.",
                    "en": "VENUS is essential because it rules how you love and value yourself. Understanding it allows you to break toxic patterns and attract healthy relationships. 💜 In the **PERSONAL MANUAL**, we don't just analyze your Venus — we cover your entire map (4 PDFs) to give you a complete picture of why you experience what you do."
                },
                "topic": {"es": "Amor y Vínculos", "en": "Love and Bonds"}
            },
            "mercurio": {
                "keywords": {
                    "es": ["mente", "pensar", "decision", "duda", "cabeza", "ideas", "mercurio", "inteligente", "ansiedad mental", "futuro"],
                    "en": ["mind", "thinking", "decision", "doubt", "head", "ideas", "mercury", "smart", "mental anxiety", "future", "overthink"]
                },
                "response": {
                    "es": "MERCURIO es importante porque gobierna tu Mente. Conocerlo es el secreto para dejar de sobrepensar y tener claridad sobre tu futuro. 🧠 El **MANUAL PERSONAL** integra el análisis de tu Mercurio junto con tu Sol, Venus y Marte (4 PDF) para que todas las piezas de tu vida encajen.",
                    "en": "MERCURY is important because it governs your Mind. Understanding it is the secret to stop overthinking and gain clarity about your future. 🧠 The **PERSONAL MANUAL** integrates the analysis of your Mercury alongside your Sun, Venus, and Mars (4 PDFs) so all the pieces of your life fall into place."
                },
                "topic": {"es": "Mente y Decisión", "en": "Mind and Decision"}
            },
            "marte": {
                "keywords": {
                    "es": ["acción", "meta", "disciplina", "procrastin", "miedo", "arrancar", "marte", "energia", "cansancio", "lograr"],
                    "en": ["action", "goal", "discipline", "procrastin", "fear", "start", "mars", "energy", "tired", "achieve", "motivation"]
                },
                "response": {
                    "es": "MARTE es fundamental porque es tu motor de Acción. Entenderlo es el único camino para lograr disciplina real y conquistar tus metas. ⚡ Te recomiendo el **MANUAL PERSONAL** completo (4 PDF), porque al unir tu Marte con tu propósito (Sol), tendrás el plan de vida claro que buscas.",
                    "en": "MARS is fundamental because it's your engine of Action. Understanding it is the only way to achieve real discipline and conquer your goals. ⚡ I recommend the complete **PERSONAL MANUAL** (4 PDFs), because by connecting your Mars with your purpose (Sun), you'll have the clear life plan you're looking for."
                },
                "topic": {"es": "Acción y Metas", "en": "Action and Goals"}
            }
        }

    def _ensure_context(self, user_id: str):
        """Inicializa el contexto del usuario si no existe."""
        with self._lock:
            if user_id not in self.user_context:
                self.user_context[user_id] = []

    def _append_context(self, user_id: str, role: str, content: str):
        """Agrega un mensaje al contexto del usuario de forma thread-safe."""
        with self._lock:
            self.user_context[user_id].append({"role": role, "content": content})

    def _detect_language(self, message: str) -> str:
        """Detecta el idioma del mensaje. Retorna 'es' o 'en'.
        Usa langdetect + heurística de palabras clave para mejorar precisión en frases cortas."""
        msg_lower = message.lower()

        # Heurística: palabras muy comunes en inglés que casi nunca aparecen en español
        en_indicators = [
            " i ", " my ", " me ", " about ", " tell ", " what ", " the ",
            " is ", " are ", " how ", " want ", " know ", " feel ",
            " can ", " don't ", " i'm ", " do ", " does ", " have ",
            " with ", " for ", " your ", " you ",
            "i feel", "i want", "i need", "tell me", "what is",
            "how much", "i keep", "i lack", "i can't",
            "hello", "hi ", "hey ", "good morning", "good evening",
            "good afternoon", "good night"
        ]
        # Heurística: palabras muy comunes en español
        es_indicators = [
            " mi ", " yo ", " qué ", " sobre ", " quiero ", " saber ",
            " cómo ", " puedo ", " tengo ", " siento ", " cuál ",
            "quiero saber", "me siento", "no sé", "por qué",
            "cuéntame", "dime", " como ", "¿", "¡"
        ]

        # Contar indicadores en cada idioma
        padded = f" {msg_lower} "
        en_score = sum(1 for w in en_indicators if w in padded)
        es_score = sum(1 for w in es_indicators if w in padded)

        # Si la heurística es clara, usarla directamente
        if en_score > 0 and es_score == 0:
            return "en"
        if es_score > 0 and en_score == 0:
            return "es"

        # Si ambos tienen puntaje o ninguno, usar langdetect como desempate
        try:
            lang = detect(message)
            return "en" if lang == "en" else "es"
        except Exception:
            # Si la heurística dio algo, usarlo
            if en_score > es_score:
                return "en"
            return "es"

    def _detect_intent(self, message: str, lang: str) -> str:
        msg = message.lower()
        sales_keywords = {
            "es": ["precio", "costo", "valor", "vale", "comprar", "cuánto"],
            "en": ["price", "cost", "how much", "buy", "purchase", "worth"]
        }
        greeting_keywords = {
            "es": ["hola", "buenos dias", "buenas", "buen día"],
            "en": ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
        }

        if any(w in msg for w in sales_keywords.get(lang, sales_keywords["es"])):
            return "sales_inquiry"
        if any(w in msg for w in greeting_keywords.get(lang, greeting_keywords["es"])):
            return "greeting"
        return "general"

    def process_message(self, message: str, user_id: str = "anonymous", tone: str = "default") -> str:
        # Asegurar que el contexto del usuario exista
        self._ensure_context(user_id)

        # Detectar idioma automáticamente
        lang = self._detect_language(message)

        def apply_tone(text):
            if tone == "formal" and lang == "es":
                return text.replace("tu", "su").replace("te", "le")
            return text

        msg_lower = message.lower()

        # 0. Detectar si la pregunta es sobre contenido restringido (PDF)
        restricted = self.restricted_topics.get(lang, self.restricted_topics["es"])
        if any(topic in msg_lower for topic in restricted):
            if lang == "en":
                response = (
                    "That information is part of your Personal Manual! 😊 Out of respect for those who have "
                    "already purchased it, I can only give you a general overview here. If you want to discover "
                    "all the details and secrets of your chart, I invite you to get the full Personal Manual "
                    "(4 PDFs). Would you like to know how to get it?"
                )
            else:
                response = (
                    "¡Esa información es parte de tu Manual Personal! 😊 Por respeto a quienes ya lo adquirieron, "
                    "solo puedo darte una vista general aquí. Si quieres descubrir todos los detalles y secretos "
                    "de tu carta, te invito a adquirir el Manual Personal completo (4 PDFs). ¿Te gustaría saber "
                    "cómo obtenerlo?"
                )
            response = apply_tone(response)
            self._append_context(user_id, "emy", response)
            return response

        # 1. Detectar intención de venta directa o saludo
        intent = self._detect_intent(message, lang)

        if intent == "sales_inquiry":
            if lang == "en":
                response = (
                    "The Personal Manual (which includes your 4 astral DNA modules) has a special price today. "
                    "Would you like me to show you an example of what you'll receive? ✨"
                )
            else:
                response = (
                    "El Manual Personal (que incluye tus 4 módulos de ADN astral) tiene un valor especial hoy. "
                    "¿Te gustaría que te muestre un ejemplo de lo que recibirás? ✨"
                )
            response = apply_tone(response)
            self._append_context(user_id, "emy", response)
            return response

        if intent == "greeting":
            if lang == "en":
                response = (
                    f"Hi! I'm {self.name}, your astrological AI. 💜 I'm trained to read the stars and guide you. "
                    "What would you like to discover about your energy today?"
                )
            else:
                response = (
                    f"¡Hola! Soy {self.name}, tu IA astrológica. 💜 Estoy entrenada para leer las estrellas y "
                    "guiarte. ¿Qué te gustaría descubrir hoy sobre tu energía?"
                )
            response = apply_tone(response)
            self._append_context(user_id, "emy", response)
            return response

        # 2. Verificar Pilares de Venta (Sol, Venus, Mercurio, Marte)
        for pillar, data in self.sales_pillars.items():
            keywords = data["keywords"].get(lang, data["keywords"]["es"])
            if any(k in msg_lower for k in keywords):
                response = data["response"][lang]
                if lang == "en":
                    response += " Would you like to go deeper into this?"
                else:
                    response += " ¿Te gustaría profundizar en esto?"
                response = apply_tone(response)
                self._append_context(user_id, "emy", response)
                return response

        # 3. Verificar Conocimiento General (Base de Conocimiento)
        for topic_key, topic_data in self.knowledge_base.items():
            keywords = topic_data["keywords"].get(lang, topic_data["keywords"]["es"])
            # Para "revolucion_solar", necesitamos que ambas keywords coincidan
            if topic_key == "revolucion_solar":
                if lang == "es":
                    if "revoluci" in msg_lower and "solar" in msg_lower:
                        response = random.choice(topic_data["responses"][lang]) + topic_data["suffix"][lang]
                        response = apply_tone(response)
                        self._append_context(user_id, "emy", response)
                        return response
                else:
                    if any(k in msg_lower for k in keywords):
                        response = random.choice(topic_data["responses"][lang]) + topic_data["suffix"][lang]
                        response = apply_tone(response)
                        self._append_context(user_id, "emy", response)
                        return response
            elif topic_key == "mapa_numerologico":
                if lang == "es":
                    if "numero" in msg_lower and "mapa" in msg_lower:
                        response = random.choice(topic_data["responses"][lang]) + topic_data["suffix"][lang]
                        response = apply_tone(response)
                        self._append_context(user_id, "emy", response)
                        return response
                else:
                    if any(k in msg_lower for k in keywords):
                        response = random.choice(topic_data["responses"][lang]) + topic_data["suffix"][lang]
                        response = apply_tone(response)
                        self._append_context(user_id, "emy", response)
                        return response
            else:
                if any(k in msg_lower for k in keywords):
                    response = random.choice(topic_data["responses"][lang]) + topic_data["suffix"][lang]
                    response = apply_tone(response)
                    self._append_context(user_id, "emy", response)
                    return response

        # 4. Fallback empático + Venta suave
        if lang == "en":
            fallback_responses = [
                "Interesting. Everything in your sky has a reason. ✨ That's exactly the kind of answers we seek to provide in your Personal Manual.",
                "I understand you. Psychological astrology helps us see that clearly. Have you ever explored your full birth chart?",
                "It's a deep topic. 🌙 Your cosmic DNA holds the keys. If you tell me your birth date (or if you already have your manual), I could guide you better.",
                "That question is very common. It's often resolved by understanding your Mercury (your mind) or your Moon (your emotions). Would you like to know more about the Manual?"
            ]
        else:
            fallback_responses = [
                "Interesante. Todo en tu cielo tiene un porqué. ✨ Ese es justo el tipo de respuestas que buscamos responder en tu Manual Personal.",
                "Te entiendo. La astrología psicológica nos ayuda a ver eso con claridad. ¿Has explorado alguna vez tu carta astral completa?",
                "Es un tema profundo. 🌙 Tu ADN cósmico tiene las claves. Si me dices tu fecha de nacimiento (o si ya tienes tu manual), podría guiarte mejor.",
                "Esa duda es muy común. A menudo se resuelve entendiendo tu Mercurio (tu mente) o tu Luna (tus emociones). ¿Te gustaría saber más sobre el Manual?"
            ]

        response = random.choice(fallback_responses)
        response = apply_tone(response)
        self._append_context(user_id, "emy", response)
        return response

    def train(self, new_data: Dict):
        """
        Permite actualizar la base de conocimiento en tiempo de ejecución (simulado).
        """
        if "topic" in new_data and "response" in new_data:
            topic = new_data["topic"]
            lang = new_data.get("lang", "es")
            if topic in self.knowledge_base:
                if isinstance(self.knowledge_base[topic]["responses"], dict):
                    self.knowledge_base[topic]["responses"].setdefault(lang, []).append(new_data["response"])
            else:
                self.knowledge_base[topic] = {
                    "keywords": {"es": [], "en": []},
                    "responses": {lang: [new_data["response"]]},
                    "suffix": {"es": "", "en": ""}
                }
