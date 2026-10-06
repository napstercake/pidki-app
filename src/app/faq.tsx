import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { AppName } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: `¿Qué es ${AppName} Circle Savings?`,
    answer: `${AppName} es una aplicación de ahorro en círculos que ayuda a amigos y familiares a ahorrar dinero juntos. Permite crear círculos de ahorro con objetivos específicos y gestionar los pagos de manera estructurada.`,
  },
  {
    id: "2",
    question: "¿Cómo funciona un círculo de ahorro?",
    answer:
      "Un círculo de ahorro funciona cuando un grupo de personas contribuye con una cantidad fija regularmente (semanal, quincenal o mensual). En cada ronda, un miembro recibe el monto total recaudado. El orden se determina por un sorteo aleatorio.",
  },
  {
    id: "3",
    question: "¿Cuál es el número mínimo y máximo de participantes?",
    answer:
      "Necesitas un mínimo de 3 participantes y puedes tener hasta 12 participantes en un solo círculo de ahorro.",
  },
  {
    id: "4",
    question: "¿Cómo se calcula el monto de los pagos?",
    answer:
      "El monto de los pagos se calcula dividiendo el monto objetivo por el número de participantes. Por ejemplo, si tu objetivo es S/ 1,200 con 6 participantes, cada persona paga S/ 200 por período de pago.",
  },
  {
    id: "5",
    question: "¿Qué períodos de pago están disponibles?",
    answer: "Ofrecemos tres períodos de pago: Semanal, Quincenal y Mensual.",
  },
  {
    id: "6",
    question: "¿Cómo funciona el sorteo?",
    answer:
      "Una vez que todos los participantes se han unido, el creador del círculo puede realizar el sorteo. Esto asigna posiciones aleatoriamente a los participantes, determinando el orden en que reciben el dinero.",
  },
  {
    id: "7",
    question: "¿Qué pasa si alguien no paga?",
    answer:
      "Si un participante no paga, el círculo puede estar en pausa hasta que se realice el pago. Recomendamos la comunicación abierta entre los participantes para resolver cualquier problema.",
  },
  {
    id: "8",
    question: "¿Puedo salir de un círculo después de unirme?",
    answer:
      "Puedes salir de un círculo antes de que se realice el sorteo. Una vez que el círculo esté activo, los participantes están comprometidos a completar todos los pagos.",
  },
  {
    id: "9",
    question: "¿Cuántos círculos puedo crear o unirme?",
    answer:
      "Puedes crear hasta 10 círculos y unirte a hasta 10 círculos, para un total de 20 círculos máximo.",
  },
  {
    id: "10",
    question: "¿Mi dinero está seguro?",
    answer: `${AppName} actúa como facilitador para tus círculos de ahorro. Proveemos la plataforma y las herramientas para gestionar tus círculos, pero los transferencias de dinero entre participantes son responsabilidad exclusiva de cada uno.`,
  },
];

export default function FAQScreen() {
  const theme = useTheme<Theme>();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box paddingHorizontal="l" paddingTop="xxxl" paddingBottom="l">
          <Box flexDirection="row" alignItems="center" marginBottom="m">
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </IconButton>
            <Box flex={1} marginLeft="m">
              <Text variant="titleBold" style={{ color: "#FFFFFF" }}>
                FAQ
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.8)" }}>
                Preguntas frecuentes
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
      >
        <Box gap="m">
          {faqData.map((item) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <Card key={item.id} padding="l">
                <TouchableOpacity
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flex={1}>
                      <Text variant="bodyBold" color="text" marginBottom="xs">
                        {item.question}
                      </Text>
                    </Box>
                    {isExpanded ? (
                      <ChevronDown
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    ) : (
                      <ChevronRight
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    )}
                  </Box>
                </TouchableOpacity>

                {isExpanded && (
                  <Box
                    marginTop="m"
                    paddingTop="m"
                    borderTopWidth={1}
                    borderTopColor="borderLight"
                  >
                    <Text variant="body" color="textSecondary" lineHeight={24}>
                      {item.answer}
                    </Text>
                  </Box>
                )}
              </Card>
            );
          })}
        </Box>

        {/* Contact Support */}
        <Card padding="l" marginTop="l">
          <Text
            variant="subtitle"
            color="text"
            marginBottom="s"
            textAlign="center"
          >
            Aún tienes preguntas?
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            textAlign="center"
            marginBottom="m"
          >
            Contacta a nuestro equipo de soporte para obtener ayuda adicional
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.s,
              paddingHorizontal: theme.spacing.l,
              borderRadius: theme.borderRadii.s,
              alignItems: "center",
            }}
            activeOpacity={0.8}
          >
            <Text variant="button" color="white">
              Contactar soporte
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </Box>
  );
}
