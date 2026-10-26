"use client";

import { motion, useReducedMotion } from "framer-motion";

// Standard editorial animation easing curve (restrained, fluid, non-bouncy)
const standardEase = [0.22, 1, 0.36, 1];

/**
 * FadeIn: Smooth scroll-triggered reveal with subtle directional translation
 */
export function FadeIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 16,
  threshold = 0,
  once = true,
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  const getOffset = () => {
    if (shouldReduceMotion) return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getOffset();
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: standardEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * StaggerContainer: Parent wrapper for staggered entrance of card grids
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.05,
  initialDelay = 0.02,
  as = "div",
  animate = "show",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={shouldReduceMotion ? false : "hidden"}
      animate={animate}
      whileInView="show"
      viewport={{ once: true, amount: 0 }}
      variants={{
        hidden: { opacity: shouldReduceMotion ? 1 : 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren: shouldReduceMotion ? 0 : initialDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * StaggerItem: Individual child item inside StaggerContainer
 */
export function StaggerItem({
  children,
  className = "",
  distance = 14,
  duration = 0.45,
  as = "div",
  animate = "show",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={{
        hidden: {
          opacity: shouldReduceMotion ? 1 : 0,
          y: shouldReduceMotion ? 0 : distance,
        },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.01 : duration,
            ease: standardEase,
          },
        },
      }}
      animate={animate}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * SectionHeadingReveal: Refined entrance animation for section headers
 */
export function SectionHeadingReveal({
  children,
  className = "",
  delay = 0,
  once = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.45,
        delay: shouldReduceMotion ? 0 : delay,
        ease: standardEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SubtleHoverCard: Gentle hover response for interactive cards
 */
export function SubtleHoverCard({
  children,
  className = "",
  hoverY = -3,
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      whileHover={shouldReduceMotion ? {} : { y: hoverY }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * InteractiveTap: Micro-feedback on button clicks/taps
 */
export function InteractiveTap({
  children,
  className = "",
  scale = 0.98,
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      whileTap={shouldReduceMotion ? {} : { scale }}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
