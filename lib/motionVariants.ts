import { Variants } from "framer-motion";

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleSpring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0px rgba(6,182,212,0)",
    borderColor: "rgba(55,65,81,1)",
  },
  hover: {
    scale: 1.015,
    boxShadow: "0 0 28px rgba(6,182,212,0.12)",
    borderColor: "rgba(6,182,212,0.35)",
    transition: { duration: 0.25 },
  },
};

export const pulseGlow: Variants = {
  initial: { boxShadow: "0 0 8px rgba(239,68,68,0.4)" },
  animate: {
    boxShadow: [
      "0 0 8px rgba(239,68,68,0.4)",
      "0 0 22px rgba(239,68,68,0.75)",
      "0 0 8px rgba(239,68,68,0.4)",
    ],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: { duration: 0.3 },
  },
};