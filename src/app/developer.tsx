import { Text } from "@/components/authorable/Text";
import { AppName } from "@/constants/Common";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STUDIO_URL = "https://headboxstudio.com";

export default function DeveloperScreen() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;
  const taglineSlide = useRef(new Animated.Value(30)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const ctaSlide = useRef(new Animated.Value(30)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(ctaFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(ctaSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" />

      {/* Deep dark background */}
      <LinearGradient
        colors={["#000000", "#0a0a0f", "#0f0a1a", "#000000"]}
        locations={[0, 0.3, 0.7, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Accent glow — top right */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
          },
          { opacity: glowPulse },
        ]}
      >
        <LinearGradient
          colors={["#e6636e50", "#e6636e20", "transparent"]}
          style={{ flex: 1, borderRadius: 300 }}
        />
      </Animated.View>

      {/* Accent glow — bottom left */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
          },
          {
            opacity: Animated.subtract(
              new Animated.Value(1.4),
              glowPulse,
            ) as any,
          },
        ]}
      >
        <LinearGradient
          colors={["#97def240", "#97def220", "transparent"]}
          style={{ flex: 1, borderRadius: 300 }}
        />
      </Animated.View>

      {/* Noise/grain overlay — thin horizontal lines for texture */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundColor: "transparent",
        }}
      />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[
          {
            position: "absolute",
            left: 20,
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          },
          { top: insets.top + 12 },
        ]}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      {/* Main content — vertically centered */}
      <View
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Label chip */}
        <Animated.View
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(151,222,242,0.35)",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: "rgba(151,222,242,0.07)",
            }}
          >
            <Sparkles size={11} color="#97def2" style={{ marginRight: 5 }} />
            <Text
              style={{
                color: "#97def2",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 2.5,
                fontFamily: "PlusJakartaSans-Bold",
              }}
            >
              CREADO POR
            </Text>
          </View>
        </Animated.View>

        {/* Studio name — the hero moment */}
        <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 56,
              fontWeight: "900",
              letterSpacing: -1,
              textAlign: "center",
              lineHeight: 58,
              fontFamily: "PlusJakartaSans-Bold",
            }}
          >
            HEADBOX
          </Text>
          <Text
            style={{
              fontSize: 56,
              fontWeight: "900",
              letterSpacing: -1,
              textAlign: "center",
              lineHeight: 60,
              fontFamily: "PlusJakartaSans-Bold",
              opacity: 0.75,
              color: "#e6636e",
            }}
          >
            STUDIO
          </Text>
        </Animated.View>

        {/* Divider line */}
        <Animated.View
          style={[
            {
              marginTop: 24,
              width: 48,
              height: 1,
              backgroundColor: "rgba(230,99,110,0.6)",
            },
            { opacity: taglineFade },
          ]}
        />

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: taglineFade,
            transform: [{ translateY: taglineSlide }],
            marginTop: 28,
            paddingHorizontal: 32,
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              lineHeight: 23,
              textAlign: "center",
              fontFamily: "PlusJakartaSans",
            }}
          >
            Diseñamos productos digitales que{" "}
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "PlusJakartaSans-Bold",
              }}
            >
              importan.
            </Text>
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              lineHeight: 23,
              textAlign: "center",
              fontFamily: "PlusJakartaSans",
              marginTop: 12,
            }}
          >
            Apps con propósito. Experiencias que las personas recuerdan.
          </Text>
        </Animated.View>

        {/* CTA button */}
        <Animated.View
          style={{
            opacity: ctaFade,
            transform: [{ translateY: ctaSlide }],
            marginTop: 48,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL(STUDIO_URL)}
            activeOpacity={0.85}
            style={{
              borderRadius: 14,
              overflow: "hidden",
              shadowColor: "#e6636e",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <LinearGradient
              colors={["#e6636e", "#c44d57"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 28,
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "700",
                  fontFamily: "PlusJakartaSans-Bold",
                  letterSpacing: 0.3,
                }}
              >
                headboxstudio.com
              </Text>
              <ArrowUpRight size={18} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:hola@headboxstudio.com")}
            activeOpacity={0.7}
            style={{ marginTop: 20, paddingVertical: 8 }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                fontFamily: "PlusJakartaSans",
                letterSpacing: 0.2,
                textDecorationLine: "underline",
                textDecorationColor: "rgba(255,255,255,0.2)",
              }}
            >
              hola@headboxstudio.com
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom built-with strip */}
      <Animated.View
        style={[
          { alignItems: "center", paddingHorizontal: 24 },
          { paddingBottom: insets.bottom + 16, opacity: ctaFade },
        ]}
      >
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "rgba(255,255,255,0.07)",
            marginBottom: 14,
          }}
        />
        <Text
          style={{
            color: "rgba(255,255,255,0.18)",
            fontSize: 11,
            letterSpacing: 1.2,
            fontFamily: "PlusJakartaSans",
            textAlign: "center",
          }}
        >
          {AppName} · React Native · Expo · Shopify Restyle
        </Text>
      </Animated.View>
    </View>
  );
}
