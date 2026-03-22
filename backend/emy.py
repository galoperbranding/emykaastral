from langdetect import detect
from typing import Dict, List, Optional
import random
import re

class EmyAI:
    def __init__(self):
        # Temas restringidos: solo se entregan en los PDFs
        self.restricted_topics = [
            "interpretacion completa", "manual personal", "pdf", "contenido completo", "explicacion detallada", "analisis profundo", "todo el informe", "informe completo", "entrega completa", "resultado completo", "resultado final", "detalle completo", "explicación completa"
        ]
        self.name = "Emyka"
        import threading
        self._lock = threading.Lock()
        # Contexto conversacional en memoria por usuario
        self.user_context = {}  # user_id: List[Dict[str, str]]
        # Base de conocimiento "entrenada" (Topics Knowledge Base)
        self.knowledge_base = {
            "carta_astral": [
                "Tu Carta Astral es el mapa del cielo en el momento exacto en que naciste. No es solo tu signo solar, es una huella digital cósmica única que revela tu potencial.",
                "Imagina la Carta Astral como tu manual de instrucciones de fábrica. Muestra tus talentos ocultos, tus desafíos emocionales y tu propósito de vida."
            ],
            "revolucion_solar": [
                "La Revolución Solar es tu pronóstico anual, se calcula cada año cuando el Sol vuelve a la posición exacta de tu nacimiento. Marca la energía disponible para tu año.",
                "A diferencia de la carta natal que es fija, la Revolución Solar cambia cada cumpleaños. Es ideal para saber en qué áreas de tu vida enfocarte este año."
            ],
            "mapa_numerologico": [
                "El Mapa Numerológico complementa tu astrología decodificando la vibración de tu nombre y fecha de nacimiento. Revela ciclos de vida y misiones ocultas.",
                "Los números no mienten. Tu mapa numerológico nos dice 'el qué' y 'el cuándo' de tus aprendizajes vitales."
            ],
            "signos": [
                "Los signos son los disfraces que usan los planetas. Cada uno tiene una energía: Fuego (acción), Tierra (materia), Aire (mente) o Agua (emoción).",
                "Más allá de tu signo solar, tienes a los 12 signos en alguna parte de tu carta. Donde caigan, es donde actúas con esa energía."
            ],
            "compatibilidad": [
                "La compatibilidad no es solo 'tauro se lleva bien con virgo'. Se trata de cómo la Luna de uno habla con el Sol del otro, o cómo sus Venus se entienden.",
                "En astrología psicológica, no hay signos incompatibles, solo maestros difíciles. Todo depende del nivel de consciencia de la pareja."
            ]
        }

        # Estrategia de Ventas (Pillars) - ENFOQUE: Importancia + Beneficio + Venta sutil de Manual Personal COMPLETO (4 PDFs)
        self.sales_pillars = {
            "sol": {
                "keywords": ["quien soy", "propósito", "identidad", "talento", "perdida", "no se que hacer", "sol", "rumbo", "camino"],
                "response": "El SOL es vital porque define tu Identidad, tu brillo natural y tu Propósito. Conocerlo es clave para dejar de sentirte perdida y activar tu talento único. ☀️ Justamente, nuestro **MANUAL PERSONAL** (que incluye los 4 PDF completos) comienza descifrando tu Sol para que recuperes el rumbo de tu vida.",
                "topic": "Identidad y Propósito"
            },
            "venus": {
                "keywords": ["amor", "pareja", "relacion", "vínculo", "soledad", "toxic", "venus", "novio", "esposo", "soltera"],
                "response": "VENUS es esencial porque rige cómo amas y te valoras. Entenderlo te permite romper patrones tóxicos y atraer relaciones sanas. 💜 En el **MANUAL PERSONAL** no solo analizamos tu Venus, sino todo tu mapa (4 PDF) para darte una visión completa de por qué vives lo que vives.",
                "topic": "Amor y Vínculos"
            },
            "mercurio": {
                "keywords": ["mente", "pensar", "decision", "duda", "cabeza", "ideas", "mercurio", "inteligente", "ansiedad mental", "futuro"],
                "response": "MERCURIO es importante porque gobierna tu Mente. Conocerlo es el secreto para dejar de sobrepensar y tener claridad sobre tu futuro. 🧠 El **MANUAL PERSONAL** integra el análisis de tu Mercurio junto con tu Sol, Venus y Marte (4 PDF) para que todas las piezas de tu vida encajen.",
                "topic": "Mente y Decisión"
            },
            "marte": {
                "keywords": ["acción", "meta", "disciplina", "procrastin", "miedo", "arrancar", "marte", "energia", "cansancio", "lograr"],
                "response": "MARTE es fundamental porque es tu motor de Acción. Entenderlo es el único camino para lograr disciplina real y conquistar tus metas. ⚡ Te recomiendo el **MANUAL PERSONAL** completo (4 PDF), porque al unir tu Marte con tu propósito (Sol), tendrás el plan de vida claro que buscas.",
                "topic": "Acción y Metas"
            }
        }

    def _detect_intent(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["precio", "costo", "valor", "vale", "comprar"]):
            return "sales_inquiry"
        if any(w in msg for w in ["hola", "buenos dias", "buenas"]):
            return "greeting"
        return "general"

    def process_message(self, message: str, user_id: str = "anonymous", tone: str = "default") -> str:
        # Detectar idioma automáticamente
        try:
            lang = detect(message)
            if lang not in ("es", "en"):
                lang = "es"
        except Exception:
            lang = "es"

        # Ajustar idioma y tono (solo español e inglés por ahora)
        def translate(text_es, text_en):
            return text_en if lang == "en" else text_es
        def apply_tone(text):
            if tone == "formal":
                return text.replace("tu", "su").replace("te", "le")
            return text

        # 0. Detectar si la pregunta es sobre contenido restringido (PDF)
        msg_lower = message.lower()
        if any(topic in msg_lower for topic in self.restricted_topics):
            response = translate(
                "¡Esa información es parte de tu Manual Personal! 😊 Por respeto a quienes ya lo adquirieron, solo puedo darte una vista general aquí. Si quieres descubrir todos los detalles y secretos de tu carta, te invito a adquirir el Manual Personal completo (4 PDFs). ¿Te gustaría saber cómo obtenerlo?",
                "That information is part of your Personal Manual! 😊 Out of respect for those who have already purchased it, I can only give you a general overview here. If you want to discover all the details and secrets of your chart, I invite you to get the full Personal Manual (4 PDFs). Would you like to know how to get it?"
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        # 1. Detectar intención de venta directa o saludo
        intent = self._detect_intent(message)
        if intent == "sales_inquiry":
            response = translate(
                "El Manual Personal (que incluye tus 4 módulos de ADN astral) tiene un valor especial hoy. ¿Te gustaría que te muestre un ejemplo de lo que recibirás? ✨",
                "The Personal Manual (which includes your 4 astral DNA modules) has a special price today. Would you like me to show you an example of what you'll receive? ✨"
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response
        if intent == "greeting":
            response = translate(
                f"¡Hola! Soy {self.name}, tu IA astrológica. 💜 Estoy entrenada para leer las estrellas y guiarte. ¿Qué te gustaría descubrir hoy sobre tu energía?",
                f"Hi! I'm {self.name}, your astrological AI. 💜 I'm trained to read the stars and guide you. What would you like to discover about your energy today?"
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        # 2. Verificar Pilares de Venta (Sol, Venus, Mercurio, Marte)
        for pillar, data in self.sales_pillars.items():
            if any(k in msg_lower for k in data["keywords"]):
                response = translate(
                    data["response"] + " ¿Te gustaría profundizar en esto?",
                    "This topic is key in your Personal Manual. Would you like to go deeper into this?"
                )
                response = apply_tone(response)
                with self._lock:
                    self.user_context[user_id].append({"role": "emy", "content": response})
                return response

        # 3. Verificar Conocimiento General (Base de Conocimiento)
        if "carta astral" in msg_lower or "natal" in msg_lower:
            response = translate(
                random.choice(self.knowledge_base["carta_astral"]) + " Es la base de nuestro Manual Personal. 🌟",
                "Your Birth Chart is the foundation of your Personal Manual. 🌟"
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        if "revoluci" in msg_lower and "solar" in msg_lower:
            response = translate(
                random.choice(self.knowledge_base["revolucion_solar"]),
                "The Solar Revolution is your annual forecast, calculated each year when the Sun returns to your birth position. It marks the energy available for your year."
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        if "numero" in msg_lower and "mapa" in msg_lower:
            response = translate(
                random.choice(self.knowledge_base["mapa_numerologico"]),
                "The Numerological Map complements your astrology by decoding the vibration of your name and birth date. It reveals life cycles and hidden missions."
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        if "signo" in msg_lower:
            response = translate(
                random.choice(self.knowledge_base["signos"]) + " ¿Sabes en qué signo tienes tu Sol o tu Venus?",
                "Signs are the costumes planets wear. Do you know which sign your Sun or Venus is in?"
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        if "compatib" in msg_lower or "pareja" in msg_lower:
            response = translate(
                random.choice(self.knowledge_base["compatibilidad"]) + " En tu Manual Personal analizamos tu Venus a profundidad.",
                "Compatibility is not just 'Taurus gets along with Virgo'. In your Personal Manual, we analyze your Venus in depth."
            )
            response = apply_tone(response)
            with self._lock:
                self.user_context[user_id].append({"role": "emy", "content": response})
            return response

        # 4. Fallback empático + Venta suave
        fallback_responses = [
            translate(
                "Interesante. Todo en tu cielo tiene un porqué. ✨ Ese es justo el tipo de respuestas que buscamos responder en tu Manual Personal.",
                "Interesting. Everything in your sky has a reason. ✨ That's exactly the kind of answers we seek to provide in your Personal Manual."
            ),
            translate(
                "Te entiendo. La astrología psicológica nos ayuda a ver eso con claridad. ¿Has explorado alguna vez tu carta astral completa?",
                "I understand you. Psychological astrology helps us see that clearly. Have you ever explored your full birth chart?"
            ),
            translate(
                "Es un tema profundo. 🌙 Tu ADN cósmico tiene las claves. Si me dices tu fecha de nacimiento (o si ya tienes tu manual), podría guiarte mejor.",
                "It's a deep topic. 🌙 Your cosmic DNA holds the keys. If you tell me your birth date (or if you already have your manual), I could guide you better."
            ),
            translate(
                "Esa duda es muy común. A menudo se resuelve entendiendo tu Mercurio (tu mente) o tu Luna (tus emociones). ¿Te gustaría saber más sobre el Manual?",
                "That question is very common. It's often resolved by understanding your Mercury (your mind) or your Moon (your emotions). Would you like to know more about the Manual?"
            )
        ]
        response = random.choice(fallback_responses)
        response = apply_tone(response)
        with self._lock:
            self.user_context[user_id].append({"role": "emy", "content": response})
        return response

        
        if "revoluci" in msg_lower and "solar" in msg_lower:
            return random.choice(self.knowledge_base["revolucion_solar"])
            
        if "numero" in msg_lower and "mapa" in msg_lower:
            return random.choice(self.knowledge_base["mapa_numerologico"])
            
        if "signo" in msg_lower:
            return random.choice(self.knowledge_base["signos"]) + " ¿Sabes en qué signo tienes tu Sol o tu Venus?"

        if "compatib" in msg_lower or "pareja" in msg_lower:
            return random.choice(self.knowledge_base["compatibilidad"]) + " En tu Manual Personal analizamos tu Venus a profundidad."

        # 4. Fallback empático + Venta suave
        fallback_responses = [
            translate(
                "Interesante. Todo en tu cielo tiene un porqué. ✨ Ese es justo el tipo de respuestas que buscamos responder en tu Manual Personal.",
                "Interesting. Everything in your sky has a reason. ✨ That's exactly the kind of answers we seek to provide in your Personal Manual."
            ),
            translate(
                "Te entiendo. La astrología psicológica nos ayuda a ver eso con claridad. ¿Has explorado alguna vez tu carta astral completa?",
                "I understand you. Psychological astrology helps us see that clearly. Have you ever explored your full birth chart?"
            ),
            translate(
                "Es un tema profundo. 🌙 Tu ADN cósmico tiene las claves. Si me dices tu fecha de nacimiento (o si ya tienes tu manual), podría guiarte mejor.",
                "It's a deep topic. 🌙 Your cosmic DNA holds the keys. If you tell me your birth date (or if you already have your manual), I could guide you better."
            ),
            translate(
                "Esa duda es muy común. A menudo se resuelve entendiendo tu Mercurio (tu mente) o tu Luna (tus emociones). ¿Te gustaría saber más sobre el Manual?",
                "That question is very common. It's often resolved by understanding your Mercury (your mind) or your Moon (your emotions). Would you like to know more about the Manual?"
            )
        ]
        response = random.choice(fallback_responses)
        response = apply_tone(response)
        with self._lock:
            self.user_context[user_id].append({"role": "emy", "content": response})
        return response

    def train(self, new_data: Dict):
        """
        Permite actualizar la base de conocimiento en tiempo de ejecución (simulado).
        """
        if "topic" in new_data and "response" in new_data:
            topic = new_data["topic"]
            if topic in self.knowledge_base:
                self.knowledge_base[topic].append(new_data["response"])
            else:
                self.knowledge_base[topic] = [new_data["response"]]
